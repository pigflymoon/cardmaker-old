import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Platform,
    Picker,
    Item,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
    Alert,
    Keyboard
} from 'react-native';
import {
    Button,
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {auth} from '../../config/FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardEditInputModal from '../../components/CardEditInputModal';
import  Utils from '../../utils/utils';
import bg from '../../assets/images/noWifiBg.png';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';
import showInfo from '../../styles/showInfo';
import {
    onRestore,
    upDateRole
} from '../../utils/AppPay';
import {
    renderAuthBox,
} from '../../utils/authApi';
import {makerTask} from '../../utils/MakerTask';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default class MakeInvitation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            title: '',
            caption: '',
            checked: false,
            signin: false,
            textPosition: 'bottomCenter',
            textColor: colors.primary1,
            fontFamily: 'Didot-Italic',
            fontSize: 32,
            fontWeight: 'normal',
            modalIndex: 1,
            showIconPanel: true,
            modalVisible: false,
            selectText: false,
            opacity: 1,
        }
    }

    //right  header
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {};

        if (params.signin) {
            return ({
                headerRight: (
                    <Button
                        title="Restore"
                        icon={{name: 'refresh', color: colors.secondary2, size: 24}}
                        onPress={() => {
                            onRestore().then(function (restoreResponse) {
                                if (restoreResponse.restore) {
                                    navigation.setParams({
                                        isPaidUser: true,
                                    });
                                    //update db user
                                    upDateRole();
                                    Alert.alert('Restore Successful', 'Successfully restores all your purchases.');

                                }
                            })

                        }}
                        textStyle={{fontWeight: '700', color: colors.secondary2}}
                        buttonStyle={{
                            backgroundColor: 'transparent',
                            borderColor: 'transparent',
                            borderWidth: 0,
                            borderRadius: 5,
                        }}
                        containerViewStyle={{width: 100,}}
                    />

                )
            });
        } else {
            return {
                headerRight: false,
            };
        }

    };

    componentWillMount() {
        if (this.props.navigation.state.params) {
            var makeCard = this.props.navigation.state.params.chooseCards;
            var signin = this.props.navigation.state.params.signin;
            var isPaidUser = this.props.navigation.state.params.isPaidUser;

            if (makeCard) {
                this.setState({makeCard: makeCard, signin: signin, isPaidUser: isPaidUser});
            }
        }
    }

    componentDidMount() {
        var self = this;
        auth.onAuthStateChanged(function (user) {
            if (user) {
                self.setState({signin: true})
            } else {
                self.setState({signin: false})
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        var makeCard = (nextProps.navigation.state.params.chooseCards);
        var isPaidUser = nextProps.navigation.state.params.isPaidUser;
        this.setState({makeCard: makeCard, isPaidUser: isPaidUser});
    }

    componentWillUnmount() {
        this.setState({makeCard: []});
    }

    onShare = () => {
        Utils.shareImage(this.state.imageUrl, this.state.title, this.state.caption)
    }
    /**
     *
     * @param text
     * @param input
     */

    setWishwords = (text, input) => {
        console.log('input is ', input)
        var stateName = `${input}Text`;
        console.log('input name is ', stateName)

        this.setState({[stateName]: this.insertEnter(text, 52)});
    }

    insertEnter = (str, n) => {
        // str = str.replace(/↵/g, "")


//trim the string to the maximum length
        var trimmedString = str.substr(0, n);

//re-trim if we are in the middle of a word

        var len = str.length;//获取字符的长度 52
        var strTemp = '';
        if (len > n) {//如果字符的长度大于指定的长度
            // strTemp = str.substring(0, n);//那么截取指定长度的字符串
            // str = str.substring(n, len);//截取剩余的字符串

            strTemp = trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
            str = str.substr(n,Math.min(trimmedString.length, trimmedString.lastIndexOf(" ")))
            //在截取的指定长度的字符串添加\n 标签实现换行并返回
            return strTemp + '\n' + this.insertEnter(str, n);
        } else {
            return str;
        }
    }
    /**
     *
     * @param imageUrl
     * @param textInfo1
     * @param textInfo2
     * @param textInfo3
     * @returns {Promise}
     */
    writeImage = (imageUrl, textInfo1, textInfo2, textInfo3, textInfo4, textInfo5, textInfo6, textInfo7) => {
        return new Promise((resolve, reject) => {
            var value = makerTask(imageUrl, textInfo1).then((data) => makerTask(data, textInfo2)).then((data) => makerTask(data, textInfo3))
                .then((data) => makerTask(data, textInfo4)).then((data) => makerTask(data, textInfo5)).then((data) => makerTask(data, textInfo6))
                .then((data) => makerTask(data, textInfo7));
            resolve(value);
        })

    }

    imageMarker = (url) => {
        var self = this;
        var title = this.state.title;
        var caption = this.state.caption;

        title = this.insertEnter(title, 26)
        var textColor = colors.primary1;
        var position = this.state.textPosition;
        var font = this.state.fontFamily;
        var fontSize = this.state.fontSize;
        //
        var imageUrl = url;
        var textInfo1 = {
            // font: font,
            // fontSize: fontSize,
            // position: position,
            text: this.state.input1Text || '',
            color: this.state.input1Color || textColor,
            fontSize: this.state.input1FontSize || fontSize,
            fontName: this.state.input1FontFamily || font,
            // position: this.state.input1Position || position,
            xPos: 20,
            yPos: 20,

        }

        var textInfo2 = {
            text: this.state.input2Text || '',
            color: this.state.input2Color || textColor,
            fontSize: this.state.input2FontSize || fontSize,
            fontName: this.state.input2FontFamily || font,
            // position: this.state.input2Position || position,
            xPos: 30,
            yPos: 220,
        }

        var textInfo3 = {
            text: this.state.input3Text || '',
            color: this.state.input3Color || textColor,
            fontSize: this.state.input3FontSize || fontSize,
            fontName: this.state.input3FontFamily || font,
            // position: this.state.input3Position || position,
            xPos: 30,
            yPos: 320,
        }
        var textInfo4 = {
            text: this.state.input4Text || '',
            color: this.state.input4Color || textColor,
            fontSize: this.state.input4FontSize || fontSize,
            fontName: this.state.input4FontFamily || font,
            // position: this.state.input4Position || position,
            xPos: 30,
            yPos: 400,
        }
        var textInfo5 = {
            text: this.state.input5Text || '',
            color: this.state.input5Color || textColor,
            fontSize: this.state.input5FontSize || fontSize,
            fontName: this.state.input5FontFamily || font,
            // position: this.state.input5Position || position,
            xPos: 30,
            yPos: 450,
        }
        var textInfo6 = {
            text: this.state.input6Text || '',
            color: this.state.input6Color || textColor,
            fontSize: this.state.input6FontSize || fontSize,
            fontName: this.state.input6FontFamily || font,
            // position: this.state.input6Position || position,
            xPos: 30,
            yPos: 500,
        }
        var textInfo7 = {
            text: this.state.input7Text || '',
            color: this.state.input7Color || textColor,
            fontSize: this.state.input7FontSize || fontSize,
            fontName: this.state.input7FontFamily || font,
            // position: this.state.input7Position || position,
            xPos: 30,
            yPos: 550
        }
        console.log('textInfo1 :', textInfo1);
        console.log('textInfo2 :', textInfo2);
        console.log('textInfo3 :', textInfo3);

        this.writeImage(imageUrl, textInfo1, textInfo2, textInfo3, textInfo4, textInfo5, textInfo6, textInfo7).then((path) => {
            self.setState({
                show: true,
                imageUrl: Platform.OS === 'android' ? 'file://' + path : path
            })
        });
    }
    /**
     * show Icon panel or not
     */
    showIconPanel = () => {
        let showPanel = (this.state.showIconPanel == true) ? false : true;
        this.setState({showIconPanel: showPanel});
    }

    renderEmptyStates = () => {
        return (
            <View style={cardStyle.container}>
                <ImageBackground
                    source={bg}
                    style={{
                        flex: 1,
                        width: null,
                        height: 400,
                    }}
                >
                    <View style={showInfo.container}><Text style={showInfo.greyText}>Oops,No cards!</Text>
                        <TouchableOpacity style={{
                            paddingLeft: 8,
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <Ionicons
                                name={'ios-return-left'}
                                size={28}
                                style={{color: colors.secondary2, paddingRight: 20,}}
                                onPress={() => {
                                    this.props.navigation.goBack();
                                }}
                            />
                            <Text style={showInfo.greyText}>Please select your favourite one to make your own card. Have
                                fun! </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground >
            </View>
        );
    }
    renderIcon = (name, onPress) => (
        <Button
            title=""
            icon={{name: name, type: 'font-awesome', color: colors.secondary2, size: 24}}
            onPress={onPress}
            buttonStyle={{
                padding: 0,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0,
            }}
            containerViewStyle={{width: 60,}}

            textStyle={{fontWeight: '700', color: colors.secondary2}}
        />
    )
    /**
     * Render Edit
     * @returns {XML}
     */

    renderEditInput = () => {
        return (
            <View
                style={[cardStyle.container, this.state.showIconPanel ? {opacity: 1} : {opacity: 0}]}
            >
                <ScrollView style={cardStyle.container}

                            showsHorizontalScrollIndicator={false}>
                    <KeyboardAvoidingView contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                                          enabled
                                          behavior='position'

                    >
                        <View
                            style={{
                                paddingBottom: 32,
                                alignItems: 'center',
                            }}>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={[cardStyle.inputStyle]}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input1')}
                                        selectTextOnFocus={this.state.selectText}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, selectText: true, modalIndex: 1})
                                    })}

                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input2')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 2})

                                    })}

                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 280)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input3')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 3})
                                    })}
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input4')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 4})
                                    })}
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input5')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 5})
                                    })}
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input6')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 6})
                                    })}
                                </View>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                            }}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey0}
                                        onChangeText={(text) => this.setWishwords(text, 'input7')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1, marginRight: 10,}}>
                                    {this.renderIcon("cog", () => {
                                        this.setState({modalVisible: true, modalIndex: 7})
                                    })}
                                </View>
                            </View>

                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>
            </View>

        )
    }

    renderIconPanel = () => {
        return (
            <View style={cardStyle.iconsContainer}>
                <View style={cardStyle.shareRightIcon}>
                    <Icon name="caret-down" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={() => this.showIconPanel()}
                    />
                </View>
                <View style={cardStyle.shareRightIcon}>
                    <Icon name="magic" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={() => this.imageMarker((this.state.makeCard).illustration)}
                    />
                </View>

                <View style={cardStyle.shareRightIcon}>
                    <Icon name="share-alt" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={this.onShare}
                    />
                </View>


            </View>
        )
    }
    /**
     * Edit modal
     * @returns {XML}
     */
    renderEditModal = () => {
        return (
            <CardEditInputModal
                visible={this.state.modalVisible}
                color={this.state.color}

                onCancel={() => this.setState({modalVisible: false})}
                onOk={(color, size, family, position) => {
                    console.log('edit modal return values are!!', color, size, family, position)
                    var fontSize = `input${this.state.modalIndex}FontSize`;
                    var fontFamily = `input${this.state.modalIndex}FontFamily`;
                    var textPosition = `input${this.state.modalIndex}Position`;
                    var textColor = `input${this.state.modalIndex}Color`;

                    this.setState({
                        [fontSize]: size,
                        [fontFamily]: family,
                        [textColor]: color,
                        [textPosition]: position,
                        modalVisible: false,

                    });

                }}
                modalIndex={this.state.modalIndex}
                okLabel="Done"
                cancelLabel="Cancel"
            />
        )
    }
    /**
     *
     * @returns {XML}
     */
    renderEditContainer = () => {//renderEditModal renderModal
        var imageUrl = this.state.show ? this.state.imageUrl : (this.state.makeCard).illustration;
        return (
            <View style={cardStyle.container}>
                <View style={[cardStyle.container, {
                    justifyContent: 'center',
                }]}>
                    {this.renderIconPanel()}
                    <View style={[cardStyle.container, cardStyle.editCardContainer]}>
                        <ImageBackground
                            source={{uri: imageUrl}}
                            style={cardStyle.cardImage}
                            imageStyle={{resizeMode: 'contain'}}
                        >
                            {this.renderEditInput()}
                            {this.renderEditModal()}
                        </ImageBackground>
                    </View>
                </View>

            </View>
        )
    }

    /**
     * render
     * @returns {*}
     */
    render() {
        var navigation = this.props.navigation;
        var card = Utils.isEmptyObject(this.state.makeCard)
        var renderCard = (!card && this.state.signin);

        if (renderCard) {
            return this.renderEditContainer();

        } else if (this.state.signin) {
            return (
                <View style={layoutStyle.container}>
                    {this.renderEmptyStates()}
                </View>
            )
        } else {
            return renderAuthBox(this.state.isLoading, navigation)
        }
    }
}

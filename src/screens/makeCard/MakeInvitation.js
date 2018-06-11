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
} from 'react-native';
import {
    Button,
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {ColorWheel} from 'react-native-color-wheel';
import Marker from 'react-native-image-marker'
import {Dropdown} from 'react-native-material-dropdown';
import Modal from "react-native-modal";

import {auth} from '../../config/FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

import  Utils from '../../utils/utils';


import bg from '../../assets/images/noWifiBg.png';
import formStyle from '../../styles/form';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';
import modalStyles from "../../styles/modal";

import showInfo from '../../styles/showInfo';
import {
    onRestore,
    upDateRole
} from '../../utils/AppPay';
import {
    renderAuthBox,
} from '../../utils/authApi';
import {makerTask} from '../../utils/MakerTask';

import CardConfig from '../../config/CardConfig';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const IMAGE_SIZE = SCREEN_WIDTH - 80;
const PRVIEW_IMAGE_SIZE = SCREEN_WIDTH - 20;
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
            fontFamily: 'AmericanTypewriter-Bold',
            fontSize: 48,
            fontWeight: 'normal',
            modalIndex: 1,
            showIconPanel: true,
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

    /**
     *
     * @param text
     * @param input
     */

    setWishwords = (text, input) => {
        console.log('input is ', input)
        var stateName = `${input}Text`;
        console.log('input name is ', stateName)

        this.setState({[stateName]: this.insertEnter(text, 26)});
    }

    setName = (text) => {
        this.setState({caption: text});
    }

    onShare = () => {
        Utils.shareImage(this.state.imageUrl, this.state.title, this.state.caption)
    }


    setTextColor = (color) => {
        var hexColor = color ? color.hexColor : colors.primary1;
        this.setState({textColor: hexColor})
    }

    insertEnter = (str, n) => {
        var len = str.length;//获取字符的长度
        var strTemp = '';
        if (len > n) {//如果字符的长度大于指定的长度
            strTemp = str.substring(0, n);//那么截取指定长度的字符串
            str = str.substring(n, len);//截取剩余的字符串
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
    writeImage = (imageUrl, textInfo1, textInfo2, textInfo3) => {
        return new Promise((resolve, reject) => {
            var value = makerTask(imageUrl, textInfo1).then((data) => makerTask(data, textInfo2)).then((data) => makerTask(data, textInfo3));
            resolve(value);
        })

    }

    imageMarker = (url) => {
        var self = this;
        var title = this.state.title;
        var caption = this.state.caption;

        title = this.insertEnter(title, 26)
        var text = (title + '\n' + caption) || '';
        var textColor = this.state.textColor || colors.primary1;
        var position = this.state.textPosition;
        var font = this.state.fontFamily;
        var textSize = this.state.fontSize;
        //
        var imageUrl = url;
        var textInfo1 = {
            // font: font,
            // textSize: textSize,
            // position: position,
            text: this.state.input1Text || '',
            textColor: textColor,
            textSize: this.state.input1FontSize || textSize,
            font: this.state.input1FontFamily || font,
            // input1TextColor: this.state.input1TextColor,
            position: this.state.input1Position || position,

        }

        var textInfo2 = {
            text: this.state.input2Text || '',
            textColor: textColor,
            textSize: this.state.input2FontSize || textSize,
            font: this.state.input2FontFamily || font,
            // input2TextColor: this.state.input2TextColor,
            position: this.state.input2Position || position,
        }

        var textInfo3 = {
            text: this.state.input3Text || '',
            textColor: textColor,
            textSize: this.state.input3FontSize || textSize,
            font: this.state.input3FontFamily || font,
            // input3TextColor: this.state.input3TextColor,
            position: this.state.input3Position || position,
        }
        this.writeImage(imageUrl, textInfo1, textInfo2, textInfo3).then((path) => {
            self.setState({
                show: true,
                imageUrl: Platform.OS === 'android' ? 'file://' + path : path
            })
        });
    }
    /**
     * Edit input style
     * @param size
     */
    onChangeFontSize = (size) => {
        var stateName = `input${this.state.modalIndex}FontSize`;
        console.log('stateName is', stateName)


        this.setState({
            [stateName]: size,
            fontSize: size,
        });
    }
    onChangeFontFamily = (font) => {
        var stateName = `input${this.state.modalIndex}FontFamily`;
        this.setState({
            [stateName]: font,
            fontFamily: font,
        });
    }

    onChangeTextColor = (color) => {
        var stateName = `input${this.state.modalIndex}TextColor`;

        let showColors = {
            'grey': colors.grey1,
            'red': colors.red,
            'green': colors.secondary2,
            'purple': colors.purple,
            'orange': colors.orange1,
            'blue': colors.blue,
            'pink': colors.primary3,
        }

        for (let key in showColors) {
            if (color == key) {
                this.setState({
                    [stateName]: showColors[key],
                    textColor: showColors[key]
                });
            }
        }
    }
    onChangeTextPosition = (position) => {
        var stateName = `input${this.state.modalIndex}Position`;

        this.setState({
            [stateName]: position,
            textPosition: position
        });
    }

    handleOnScroll = event => {
        this.setState({
            scrollOffset: event.nativeEvent.contentOffset.y
        });
    };

    handleScrollTo = p => {
        if (this.scrollViewRef) {
            this.scrollViewRef.scrollTo(p);
        }
    };
    /**
     * show Icon panel or not
     */
    showIconPanel = () => {
        let showPanel = (this.state.showIconPanel == true) ? false : true;
        console.log('showPanel is ', showPanel)
        this.setState({showIconPanel: showPanel})
    }


    /**
     * render component
     * @returns {XML}
     */
    renderEdit = () => {
        let fontFamily = CardConfig.freefontFamily, isPaidUser = this.state.isPaidUser;
        if (isPaidUser) {
            fontFamily = CardConfig.allfontFamily;
        }
        return (
            <View style={layoutStyle.container}>
                <View style={cardStyle.iconsContainer}>
                    <View style={cardStyle.shareRightIcon}>
                        {
                            isPaidUser
                                ? <ColorWheel
                                    initialColor="#ee0000"
                                    onColorChange={(color) => this.setTextColor(color)}
                                    style={{width: 60, height: 60, marginLeft: 20,}}
                                    thumbSize={20}
                                    thumbStyle={{height: 50, width: 50, borderRadius: 50}}/> : null
                        }


                    </View>
                    <View style={cardStyle.shareRightIcon}>
                        <Icon name="pencil-square" type="font-awesome" color={colors.secondary2} size={28}
                              onPress={() => this.imageMarker((this.state.makeCard).illustration)}
                        />
                    </View>
                    <View style={cardStyle.shareRightIcon}>
                        <Icon name="share-alt" type="font-awesome" color={colors.secondary2} size={28}
                              onPress={this.onShare}
                        />
                    </View>


                </View>
                <ScrollView style={[cardStyle.container, {
                    flexGrow: 1,
                }]}>
                    <KeyboardAvoidingView behavior='position' contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                        <View style={[cardStyle.editTextContainer]}>
                            <View style={formStyle.inputsContainer}>
                                <View style={cardStyle.inputContainer}>
                                    <FormLabel containerStyle={cardStyle.labelContainerStyle}
                                               labelStyle={cardStyle.labelStyle}>
                                        Wish words
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               multiline
                                               numberOfLines={4}
                                               maxLength={80}
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words(length less than 80)"
                                               placeholderTextColor={colors.grey3}
                                               onChangeText={(text) => this.setWishwords(text)}
                                    />
                                </View>

                                <View style={cardStyle.inputContainer}>
                                    <FormLabel containerStyle={cardStyle.labelContainerStyle}
                                               labelStyle={cardStyle.labelStyle}>
                                        Name
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="Name"
                                               maxLength={80}
                                               containerRef="namecontainerRef"
                                               textInputRef="nameInputRef"
                                               placeholder="Please Sign your name(length less than 80)"
                                               placeholderTextColor={colors.grey3}
                                               onChangeText={(text) => this.setName(text)}
                                    />
                                </View>
                                {this.state.errorMessage ?
                                    <FormValidationMessage containerStyle={formStyle.validateContainer}>
                                        {this.state.errorMessage}
                                    </FormValidationMessage>
                                    : null
                                }
                            </View>
                        </View>
                    </KeyboardAvoidingView>

                    <View style={[cardStyle.container, cardStyle.wrapper]}>
                        {isPaidUser ? null : <Dropdown
                                label='Text Color'
                                data={CardConfig.textColor}
                                onChangeText={this.onChangeTextColor}
                            />}
                        <Dropdown
                            label='Font Size'
                            data={CardConfig.fontSize}
                            onChangeText={this.onChangeFontSize}
                        />
                        <Dropdown
                            label='Font Family'
                            data={fontFamily}
                            setFontFamily={true}
                            onChangeText={this.onChangeFontFamily}
                        />

                        <Dropdown
                            label='Text Position'
                            data={CardConfig.textPostion}
                            onChangeText={this.onChangeTextPosition}
                        />

                    </View>


                </ScrollView>
                <ScrollView style={{
                    flex: 1, flexGrow: 2,
                }}>

                    <View style={cardStyle.editImageContainer}>
                        {
                            this.state.show
                                ? <Image
                                    source={{uri: this.state.imageUrl}}
                                    style={cardStyle.editImage}
                                /> : <Image
                                    source={{uri: (this.state.makeCard).illustration}}
                                    style={cardStyle.editImage}
                                />
                        }
                    </View>
                </ScrollView>


            </View>
        )
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
                                    {
                                        this.props.navigation.goBack();
                                    }

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
    renderButton = (text, onPress) => (
        <TouchableOpacity onPress={onPress}>
            <View style={modalStyles.button}>
                <Text>{text}</Text>
            </View>
        </TouchableOpacity>
    );
    renderIcon = (name, onPress) => (
        <Button
            title=""
            icon={{name: name, color: colors.secondary2, size: 24}}
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
    );

    /**
     * Render Edit
     * @returns {XML}
     */
    renderEditInput = () => {

        return (
            <View style={cardStyle.container}>

                <ScrollView style={cardStyle.container} showsHorizontalScrollIndicator={false}>
                    <KeyboardAvoidingView contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center'
                    }} behavior='position'>

                        <View style={{
                            width: SCREEN_WIDTH - 30,
                            borderRadius: 10,
                            paddingBottom: 32,
                            alignItems: 'center',
                        }}>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               multiline
                                               numberOfLines={4}
                                               maxLength={80}
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words(length less than 80)"
                                               placeholderTextColor={colors.grey0}
                                               onChangeText={(text) => this.setWishwords(text, 'input1')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1}}>
                                    {this.renderIcon("edit", () => {
                                        this.setState({visibleModal: 8, modalIndex: 1})
                                    })}

                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               multiline
                                               numberOfLines={4}
                                               maxLength={80}
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words(length less than 80)"
                                               placeholderTextColor={colors.grey0}
                                               onChangeText={(text) => this.setWishwords(text, 'input2')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1}}>
                                    {this.renderIcon("edit", () => {
                                        this.setState({visibleModal: 8, modalIndex: 2})

                                    })}

                                </View>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',}}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               multiline
                                               numberOfLines={4}
                                               maxLength={80}
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words(length less than 80)"
                                               placeholderTextColor={colors.grey0}
                                               onChangeText={(text) => this.setWishwords(text, 'input3')}
                                    />
                                </View>
                                <View style={{flex: 1, flexGrow: 1}}>
                                    {this.renderIcon("edit", () => {
                                        this.setState({visibleModal: 8, modalIndex: 3})

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
                    <Icon name="pencil" type="font-awesome" color={colors.secondary2} size={28}
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

    renderModal = () => {
        let fontFamily = CardConfig.freefontFamily, isPaidUser = this.state.isPaidUser;
        if (isPaidUser) {
            fontFamily = CardConfig.allfontFamily;
        }
        return (
            <Modal
                isVisible={this.state.visibleModal === 8}
                onSwipe={() => this.setState({visibleModal: null})}
                swipeDirection="down"
                scrollTo={this.handleScrollTo}
                scrollOffset={this.state.scrollOffset}
                scrollOffsetMax={400 - 300} // content height - ScrollView height
                style={modalStyles.bottomModal}
            >
                <View style={modalStyles.scrollableModal}>
                    <ScrollView
                        ref={ref => (this.scrollViewRef = ref)}
                        onScroll={this.handleOnScroll}
                        scrollEventThrottle={16}
                    >
                        {this.renderButton("Close", () => this.setState({visibleModal: null}))}

                        <View style={modalStyles.scrollableModalContent1}>
                            <View style={[cardStyle.container, cardStyle.wrapper]}>
                                {isPaidUser ? null : <Dropdown
                                        label='Text Color'
                                        data={CardConfig.textColor}
                                        onChangeText={this.onChangeTextColor}
                                    />}
                                <Dropdown
                                    label='Font Size'
                                    data={CardConfig.fontSize}
                                    onChangeText={this.onChangeFontSize}
                                />
                                <Dropdown
                                    label='Font Family'
                                    data={fontFamily}
                                    setFontFamily={true}
                                    onChangeText={this.onChangeFontFamily}
                                />

                                <Dropdown
                                    label='Text Position'
                                    data={CardConfig.textPostion}
                                    onChangeText={this.onChangeTextPosition}
                                />

                            </View>
                        </View>

                    </ScrollView>

                </View>
            </Modal>
        )
    }

    renderEditContainer = () => {
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
                            {this.state.showIconPanel ? this.renderEditInput() : null}
                            {this.renderModal()}
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

        }
        else if (this.state.signin) {
            return (
                <View style={layoutStyle.container}>
                    {this.renderEmptyStates()}
                </View>
            )
        } else {
            {
                return renderAuthBox(this.state.isLoading, navigation)
            }

        }
    }
}

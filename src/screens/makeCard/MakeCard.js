import React, {Component} from 'react';
import {
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Platform,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
    Alert,
    TextInput,
    ActivityIndicator,
    Keyboard,
} from 'react-native';
import {
    Button,
    Icon,
    FormInput,
} from 'react-native-elements';
import FlipComponent from 'react-native-flip-component';
import Marker from "react-native-image-marker"

import {auth} from '../../config/FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CardEditInputModal from '../../components/CardEditInputModal';
import KeyboardShift from '../../components/KeyboardShift';
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
import CardConfig from '../../config/CardConfig';

const whiteCanvas = 'https://firebasestorage.googleapis.com/v0/b/cardmaker-31ae8.appspot.com/o/whiteCanvas.jpg?alt=media&token=9c901edd-0646-4fa6-a103-b9c1b3499855';

export default class MakeCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            signin: false,
            textColor: colors.gold,
            fontFamily: 'Blenda Script',
            fontSize: 65,
            modalIndex: 1,
            modalVisible: false,
            opacity: 1,
            xPos: CardConfig.defaultCardTextPosition.xPos,
            textAlign: 'align-justify',
            isFlipped: false,
            show: false,
            loading: false,

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

    componentDidMount() {
        if (this.props.navigation.state.params) {
            var makeCard = this.props.navigation.state.params.chooseCards;
            var signin = this.props.navigation.state.params.signin;
            var isPaidUser = this.props.navigation.state.params.isPaidUser;
            if (makeCard) {
                this.setState({makeCard: makeCard, signin: signin, isPaidUser: isPaidUser});
            }
        }
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
        if (this.state.shareImageUrl) {
            Utils.shareImage(this.state.shareImageUrl, 'Cards', 'Join the fun in celebrating')//to do
        }
    }
    /**
     *
     * @param text
     * @param input
     */

    setWishwords = (text, input) => {
        var stateName = `${input}Text`;
        var words = this.insertEnter(text, 200);
        this.setState({[stateName]: words});
    }

    insertEnter = (str, n) => {//to test
        //trim the string to the maximum length
        var trimmedString = str.substr(0, n);
        //re-trim if we are in the middle of a word
        var len = str.length;//获取字符的长度 208
        var strTemp = '';
        if (len > n) {//如果字符的长度大于指定的长度
            // strTemp = str.substring(0, n);//那么截取指定长度的字符串
            // str = str.substring(n, len);//截取剩余的字符串
            var pos = Math.min(trimmedString.length, trimmedString.lastIndexOf(" "));

            strTemp = trimmedString.substring(0, pos)
            str = str.substring(pos, n)
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
        this.setState({loading: true});
        var image = (this.state.makeCard).illustration;

        var self = this;
        var textColor = colors.gold;
        // var position = this.state.textPosition;
        var xPos = this.state.xPos;
        var textAlign = this.state.textAlign;
        var font = this.state.fontFamily;
        var fontSize = this.state.fontSize;
        var imageUrl = whiteCanvas //url;

        var textInfo1 = {
            text: this.state.input1Text || '',
            color: this.state.input1Color || textColor,
            fontSize: this.state.input1FontSize || fontSize,
            fontName: this.state.input1FontFamily || font,
            // position: this.state.input1Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos1,
            alignment: this.state.input1TextAlign || textAlign,
        }

        var textInfo2 = {
            text: this.state.input2Text || '',
            color: this.state.input2Color || textColor,
            fontSize: this.state.input2FontSize || fontSize,
            fontName: this.state.input2FontFamily || font,
            // position: this.state.input2Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos2,
            alignment: this.state.input2TextAlign || textAlign,
        }

        var textInfo3 = {
            text: this.state.input3Text || '',
            color: this.state.input3Color || textColor,
            fontSize: this.state.input3FontSize || fontSize,
            fontName: this.state.input3FontFamily || font,
            // position: this.state.input3Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos3,
            alignment: this.state.input3TextAlign || textAlign,

        }
        var textInfo4 = {
            text: this.state.input4Text || '',
            color: this.state.input4Color || textColor,
            fontSize: this.state.input4FontSize || fontSize,
            fontName: this.state.input4FontFamily || font,
            // position: this.state.input4Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos4,
            alignment: this.state.input4TextAlign || textAlign,
        }
        var textInfo5 = {
            text: this.state.input5Text || '',
            color: this.state.input5Color || textColor,
            fontSize: this.state.input5FontSize || fontSize,
            fontName: this.state.input5FontFamily || font,
            // position: this.state.input5Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos5,
            alignment: this.state.input5TextAlign || textAlign,
        }
        var textInfo6 = {
            text: this.state.input6Text || '',
            color: this.state.input6Color || textColor,
            fontSize: this.state.input6FontSize || fontSize,
            fontName: this.state.input6FontFamily || font,
            // position: this.state.input6Position || position,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos6,
            alignment: this.state.input6TextAlign || textAlign,
        }
        var textInfo7 = {
            text: this.state.input7Text || '',
            color: this.state.input7Color || textColor,
            fontSize: this.state.input7FontSize || fontSize,
            fontName: this.state.input7FontFamily || font,
            xPos: xPos,//30,
            yPos: CardConfig.defaultCardTextPosition.yPos7,
            // position: this.state.input7Position || position,
            alignment: this.state.input7TextAlign || textAlign,
        }
        this.writeImage(imageUrl, textInfo1, textInfo2, textInfo3, textInfo4, textInfo5, textInfo6, textInfo7).then((path) => {
            Marker.markImage({
                src: image,
                markerSrc: path, // icon uri
                X: 788, // left
                Y: 0, // top
                scale: 0.5, // scale of bg
                markerScale: 0.5, // scale of icon
                quality: 80, // quality of image
                compressionRatio: 0.5
            }).then((resultPath) => {
                self.setState({
                    show: true,
                    loading: false,
                    imageUrl: Platform.OS === 'android' ? 'file://' + path : path,
                    shareImageUrl: Platform.OS === 'android' ? 'file://' + resultPath : resultPath
                })
            }).catch((err) => {
                console.log(err, 'err')
            })

        });


    }

    showEditPanel = () => {
        let showEditPanel = (this.state.show == true) ? false : true;
        this.setState({
            show: showEditPanel,
        });
    }

    flip = () => {
        this.setState({
            isFlipped: !this.state.isFlipped,
        });
    }

    renderIcon = (name, onPress) => (
        <Button
            title=""
            icon={{name: name, type: 'font-awesome', color: colors.secondary2, size: 26}}
            onPress={onPress}
            buttonStyle={{
                padding: 0,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
                borderWidth: 0,
            }}
            containerViewStyle={{width: 40,}}
            textStyle={{fontWeight: '700', color: colors.secondary2}}
        />
    )


    /**
     * Render Edit
     * @returns {XML}
     */
    renderEditInput = () => {
        return (
            <ScrollView style={[cardStyle.container,this.state.show ? {opacity: 0} : {opacity: 1}]}
                        showsHorizontalScrollIndicator={false}>
                <View
                    style={{paddingBottom: 32,alignItems: 'center',}}>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={[cardStyle.inputStyle]}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input1')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 1})
                        })}
                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input2')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 2})
                        })}


                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input3')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 3})
                        })}

                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input4')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>

                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 4})
                        })}

                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input5')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 5})
                        })}

                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input6')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 6})
                        })}

                    </View>
                    <View style={cardStyle.inputContainer}>
                        <View style={{flex: 1, flexGrow: 6}}>
                            <FormInput
                                inputStyle={cardStyle.inputStyle}
                                ref="wishwords"
                                multiline
                                numberOfLines={4}
                                maxLength={280}
                                containerRef="wishwordscontainerRef"
                                textInputRef="wishwordsInputRef"
                                placeholder="Please enter wish words(less than 4 lines,each line less than 67 character )"
                                placeholderTextColor={colors.grey3}
                                onChangeText={(text) => this.setWishwords(text, 'input7')}
                                onSubmitEditing={Keyboard.dismiss}
                            />
                        </View>
                        {this.renderIcon("cog", () => {
                            this.setState({modalVisible: true, modalIndex: 7})
                        })}

                    </View>

                </View>


            </ScrollView>
        )
    }
    renderIconPanel = () => {
        return (
            <View style={cardStyle.iconsContainer}>
                <View style={cardStyle.shareRightIcon}>
                    <Icon name="hand-o-left" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={this.flip}
                    />
                </View>
                <View style={cardStyle.shareRightIcon}>
                    <Icon name="caret-down" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={this.showEditPanel}
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
                onOk={(color, size, family, alignment) => {
                    var fontSize = `input${this.state.modalIndex}FontSize`;
                    var fontFamily = `input${this.state.modalIndex}FontFamily`;
                    var textAlign = `input${this.state.modalIndex}TextAlign`;
                    var textColor = `input${this.state.modalIndex}Color`;
                    this.setState({
                        [fontSize]: size,
                        [fontFamily]: family,
                        [textColor]: color,
                        [textAlign]: alignment,
                        modalVisible: false,

                    });

                }}
                modalIndex={this.state.modalIndex}
                okLabel="Done"
                cancelLabel="Cancel"
            />
        )
    }

    renderFrontView = (makecard) => {
        var imageUrl = makecard.illustration;
        return (
            <View style={[cardStyle.container, cardStyle.editCardContainer]}>
                <ImageBackground
                    source={{uri: imageUrl}}
                    style={cardStyle.cardImage}
                    imageStyle={{resizeMode: 'contain'}}
                >
                    <View style={{flex: 1, flexDirection: 'row', alignSelf: 'flex-end', marginTop: 20,}}>
                        {this.renderIcon("hand-o-right", () => {
                            this.flip()
                        })}
                    </View>
                </ImageBackground>
            </View>
        )
    }

    renderBackView = () => {
        var imageUrl = this.state.show ? this.state.imageUrl : whiteCanvas;
        return (
            <View style={cardStyle.container}>
                <View style={[cardStyle.container]}>
                    {this.renderIconPanel()}
                </View>
                <View style={[cardStyle.container, cardStyle.editCardContainer]}>
                    {this.state.loading ?
                        <View style={[cardStyle.container,{ alignSelf: 'center',
                        justifyContent: 'center',}]}>
                            <ActivityIndicator size="large" color={colors.secondary2}/>
                        </View>
                        : null}
                    <ImageBackground
                        source={{uri: imageUrl}}
                        style={[cardStyle.cardImage,this.state.loading ? {opacity: 0} : {opacity: 1}]}
                        imageStyle={{resizeMode: 'contain'}}
                    >
                        <KeyboardShift>
                            {() => {
                                return (
                                    <View style={cardStyle.container}>
                                        {this.renderEditInput()}
                                    </View>
                                )

                            }
                            }
                        </KeyboardShift>
                        {this.renderEditModal()}
                    </ImageBackground>
                </View>
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


    render() {
        var makeCard = this.props.navigation.state.params.chooseCards || null;
        var signin = this.props.navigation.state.params.signin;

        var navigation = this.props.navigation;
        var card = Utils.isEmptyObject(makeCard)
        var renderCard = (!card && signin);

        if (renderCard) {
            return (
                <View style={cardStyle.container}>
                    <FlipComponent
                        isFlipped={this.state.isFlipped}
                        frontView={
                            this.renderFrontView(makeCard)
                        }
                        backView={
                            this.renderBackView()
                        }
                        frontStyles={cardStyle.frontStyles}
                        backStyles={cardStyle.backStyles}
                        rotateDuration={1000}
                    />
                </View>
            )
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

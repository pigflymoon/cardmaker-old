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
} from 'react-native';
import {
    Button,
    Icon,
    FormInput,
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
import CardConfig from '../../config/CardConfig';
export default class MakeInvitation extends Component {
    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            signin: false,
            textColor: colors.gold,
            fontFamily: 'Al Nile',
            fontSize: 40,
            importantFontSize: 85,
            modalIndex: 1,
            modalVisible: false,
            show: false,
            opacity: 1,
            xPos: CardConfig.defaultTextPosition.xPos,
            bgColor: colors.white,
            textAlign: 'align-justify',
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

    componentWillMount() {
        if (this.props.navigation.state.params) {
            var makeCard = this.props.navigation.state.params.chooseCards;
            // var signin = this.props.navigation.state.params.signin;
            // var isPaidUser = this.props.navigation.state.params.isPaidUser;
            const {isPaidUser, signin, templateType} = this.props.navigation.state.params;
            if (makeCard) {
                this.setState({makeCard: makeCard, signin: signin, isPaidUser: isPaidUser});

            }
            switch (templateType) {
                case 'invitation':
                    this.setState({
                        defaultText1Value: CardConfig.invitationTemplate.weddingTextValue.defaultText1Value,
                        defaultText2Value: CardConfig.invitationTemplate.weddingTextValue.defaultText2Value,
                        defaultText3Value: CardConfig.invitationTemplate.weddingTextValue.defaultText3Value,
                        defaultText4Value: CardConfig.invitationTemplate.weddingTextValue.defaultText4Value,
                        defaultText5Value: CardConfig.invitationTemplate.weddingTextValue.defaultText5Value,
                        defaultText6Value: CardConfig.invitationTemplate.weddingTextValue.defaultText6Value,
                        input1Text: CardConfig.invitationTemplate.weddingTextValue.defaultText1Value,
                        input2Text: CardConfig.invitationTemplate.weddingTextValue.defaultText2Value,
                        input3Text: CardConfig.invitationTemplate.weddingTextValue.defaultText3Value,
                        input4Text: CardConfig.invitationTemplate.weddingTextValue.defaultText4Value,
                        input5Text: CardConfig.invitationTemplate.weddingTextValue.defaultText5Value,
                        input6Text: CardConfig.invitationTemplate.weddingTextValue.defaultText6Value,
                        yPos1: CardConfig.invitationTemplate.textPosition.yPos1,
                        yPos2: CardConfig.invitationTemplate.textPosition.yPos2,
                        yPos3: CardConfig.invitationTemplate.textPosition.yPos3,
                        yPos4: CardConfig.invitationTemplate.textPosition.yPos4,
                        yPos5: CardConfig.invitationTemplate.textPosition.yPos5,
                        yPos6: CardConfig.invitationTemplate.textPosition.yPos6,
                        yPos7: CardConfig.invitationTemplate.textPosition.yPos7
                    });
                    break;
                case 'saveTheDate'   :
                    this.setState({
                        defaultText1Value: CardConfig.saveDateTemplate.textValue.defaultText1Value,
                        defaultText2Value: CardConfig.saveDateTemplate.textValue.defaultText2Value,
                        defaultText3Value: CardConfig.saveDateTemplate.textValue.defaultText3Value,
                        defaultText4Value: CardConfig.saveDateTemplate.textValue.defaultText4Value,
                        defaultText5Value: CardConfig.saveDateTemplate.textValue.defaultText5Value,
                        defaultText6Value: CardConfig.saveDateTemplate.textValue.defaultText6Value,
                        input1Text: CardConfig.saveDateTemplate.textValue.defaultText1Value,
                        input2Text: CardConfig.saveDateTemplate.textValue.defaultText2Value,
                        input3Text: CardConfig.saveDateTemplate.textValue.defaultText3Value,
                        input4Text: CardConfig.saveDateTemplate.textValue.defaultText4Value,
                        input5Text: CardConfig.saveDateTemplate.textValue.defaultText5Value,
                        input6Text: CardConfig.saveDateTemplate.textValue.defaultText6Value,
                        yPos1: CardConfig.saveDateTemplate.textPosition.yPos1,
                        yPos2: CardConfig.saveDateTemplate.textPosition.yPos2,
                        yPos3: CardConfig.saveDateTemplate.textPosition.yPos3,
                        yPos4: CardConfig.saveDateTemplate.textPosition.yPos4,
                        yPos5: CardConfig.saveDateTemplate.textPosition.yPos5,
                        yPos6: CardConfig.saveDateTemplate.textPosition.yPos6,
                        yPos7: CardConfig.saveDateTemplate.textPosition.yPos7,

                    });
                    break;
                case 'rsvp':
                    this.setState({
                        defaultText1Value: CardConfig.rsvpTemplate.textValue.defaultText1Value,
                        defaultText2Value: CardConfig.rsvpTemplate.textValue.defaultText2Value,
                        defaultText3Value: CardConfig.rsvpTemplate.textValue.defaultText3Value,
                        defaultText4Value: CardConfig.rsvpTemplate.textValue.defaultText4Value,
                        defaultText5Value: CardConfig.rsvpTemplate.textValue.defaultText5Value,
                        defaultText6Value: CardConfig.rsvpTemplate.textValue.defaultText6Value,
                        input1Text: CardConfig.rsvpTemplate.textValue.defaultText1Value,
                        input2Text: CardConfig.rsvpTemplate.textValue.defaultText2Value,
                        input3Text: CardConfig.rsvpTemplate.textValue.defaultText3Value,
                        input4Text: CardConfig.rsvpTemplate.textValue.defaultText4Value,
                        input5Text: CardConfig.rsvpTemplate.textValue.defaultText5Value,
                        input6Text: CardConfig.rsvpTemplate.textValue.defaultText6Value,
                        yPos1: CardConfig.rsvpTemplate.textPosition.yPos1,
                        yPos2: CardConfig.rsvpTemplate.textPosition.yPos2,
                        yPos3: CardConfig.rsvpTemplate.textPosition.yPos3,
                        yPos4: CardConfig.rsvpTemplate.textPosition.yPos4,
                        yPos5: CardConfig.rsvpTemplate.textPosition.yPos5,
                        yPos6: CardConfig.rsvpTemplate.textPosition.yPos6,
                        yPos7: CardConfig.rsvpTemplate.textPosition.yPos7,
                    });
                    break;
                default:
                    this.setState({
                        defaultText1Value: '',
                        defaultText2Value: '',
                        defaultText3Value: '',
                        defaultText4Value: '',
                        defaultText5Value: '',
                        defaultText6Value: '',
                        input1Text: '',
                        input2Text: '',
                        input3Text: '',
                        input4Text: '',
                        input5Text: '',
                        input6Text: '',
                        yPos1: CardConfig.defaultTextPosition.yPos1,
                        yPos2: CardConfig.defaultTextPosition.yPos2,
                        yPos3: CardConfig.defaultTextPosition.yPos3,
                        yPos4: CardConfig.defaultTextPosition.yPos4,
                        yPos5: CardConfig.defaultTextPosition.yPos5,
                        yPos6: CardConfig.defaultTextPosition.yPos6,
                        yPos7: CardConfig.defaultTextPosition.yPos7,
                        input1FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input2FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input3FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input4FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input5FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input6FontSize: CardConfig.defaultTextSize.inputFontSize,
                        input7FontSize: CardConfig.defaultTextSize.inputFontSize,

                        input1FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input2FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input3FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input4FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input5FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input6FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                        input7FontFamily: CardConfig.defultFontFamily.inputFontFamily
                    });
                    break;
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
        // var isPaidUser = nextProps.navigation.state.params.isPaidUser;
        const {isPaidUser, templateType} = nextProps.navigation.state.params;

        this.setState({makeCard: makeCard, isPaidUser: isPaidUser});
        switch (templateType) {
            case 'invitation':
                this.setState({
                    defaultText1Value: CardConfig.invitationTemplate.weddingTextValue.defaultText1Value,
                    defaultText2Value: CardConfig.invitationTemplate.weddingTextValue.defaultText2Value,
                    defaultText3Value: CardConfig.invitationTemplate.weddingTextValue.defaultText3Value,
                    defaultText4Value: CardConfig.invitationTemplate.weddingTextValue.defaultText4Value,
                    defaultText5Value: CardConfig.invitationTemplate.weddingTextValue.defaultText5Value,
                    defaultText6Value: CardConfig.invitationTemplate.weddingTextValue.defaultText6Value,
                    input1Text: CardConfig.invitationTemplate.weddingTextValue.defaultText1Value,
                    input2Text: CardConfig.invitationTemplate.weddingTextValue.defaultText2Value,
                    input3Text: CardConfig.invitationTemplate.weddingTextValue.defaultText3Value,
                    input4Text: CardConfig.invitationTemplate.weddingTextValue.defaultText4Value,
                    input5Text: CardConfig.invitationTemplate.weddingTextValue.defaultText5Value,
                    input6Text: CardConfig.invitationTemplate.weddingTextValue.defaultText6Value,
                    yPos1: CardConfig.invitationTemplate.textPosition.yPos1,
                    yPos2: CardConfig.invitationTemplate.textPosition.yPos2,
                    yPos3: CardConfig.invitationTemplate.textPosition.yPos3,
                    yPos4: CardConfig.invitationTemplate.textPosition.yPos4,
                    yPos5: CardConfig.invitationTemplate.textPosition.yPos5,
                    yPos6: CardConfig.invitationTemplate.textPosition.yPos6,
                    yPos7: CardConfig.invitationTemplate.textPosition.yPos7,
                    input1FontSize: CardConfig.invitationTemplate.textSize.input1FontSize,
                    input2FontSize: CardConfig.invitationTemplate.textSize.input2FontSize,
                    input3FontSize: CardConfig.invitationTemplate.textSize.input3FontSize,
                    input4FontSize: CardConfig.invitationTemplate.textSize.input4FontSize,
                    input5FontSize: CardConfig.invitationTemplate.textSize.input5FontSize,
                    input6FontSize: CardConfig.invitationTemplate.textSize.input6FontSize,
                    input7FontSize: CardConfig.invitationTemplate.textSize.input7FontSize,
                    input1FontFamily: CardConfig.invitationTemplate.textFontFamily.input1FontFamily,
                    input2FontFamily: CardConfig.invitationTemplate.textFontFamily.input2FontFamily,
                    input3FontFamily: CardConfig.invitationTemplate.textFontFamily.input3FontFamily,
                    input4FontFamily: CardConfig.invitationTemplate.textFontFamily.input4FontFamily,
                    input5FontFamily: CardConfig.invitationTemplate.textFontFamily.input5FontFamily,
                    input6FontFamily: CardConfig.invitationTemplate.textFontFamily.input6FontFamily,
                    input7FontFamily: CardConfig.invitationTemplate.textFontFamily.input7FontFamily,

                });
                break;
            case 'saveTheDate'   :
                this.setState({
                    defaultText1Value: CardConfig.saveDateTemplate.textValue.defaultText1Value,
                    defaultText2Value: CardConfig.saveDateTemplate.textValue.defaultText2Value,
                    defaultText3Value: CardConfig.saveDateTemplate.textValue.defaultText3Value,
                    defaultText4Value: CardConfig.saveDateTemplate.textValue.defaultText4Value,
                    defaultText5Value: CardConfig.saveDateTemplate.textValue.defaultText5Value,
                    defaultText6Value: CardConfig.saveDateTemplate.textValue.defaultText6Value,
                    input1Text: CardConfig.saveDateTemplate.textValue.defaultText1Value,
                    input2Text: CardConfig.saveDateTemplate.textValue.defaultText2Value,
                    input3Text: CardConfig.saveDateTemplate.textValue.defaultText3Value,
                    input4Text: CardConfig.saveDateTemplate.textValue.defaultText4Value,
                    input5Text: CardConfig.saveDateTemplate.textValue.defaultText5Value,
                    input6Text: CardConfig.saveDateTemplate.textValue.defaultText6Value,
                    yPos1: CardConfig.saveDateTemplate.textPosition.yPos1,
                    yPos2: CardConfig.saveDateTemplate.textPosition.yPos2,
                    yPos3: CardConfig.saveDateTemplate.textPosition.yPos3,
                    yPos4: CardConfig.saveDateTemplate.textPosition.yPos4,
                    yPos5: CardConfig.saveDateTemplate.textPosition.yPos5,
                    yPos6: CardConfig.saveDateTemplate.textPosition.yPos6,
                    yPos7: CardConfig.saveDateTemplate.textPosition.yPos7,
                    input1FontSize: CardConfig.saveDateTemplate.textSize.input1FontSize,
                    input2FontSize: CardConfig.saveDateTemplate.textSize.input2FontSize,
                    input3FontSize: CardConfig.saveDateTemplate.textSize.input3FontSize,
                    input4FontSize: CardConfig.saveDateTemplate.textSize.input4FontSize,
                    input5FontSize: CardConfig.saveDateTemplate.textSize.input5FontSize,
                    input6FontSize: CardConfig.saveDateTemplate.textSize.input6FontSize,
                    input7FontSize: CardConfig.saveDateTemplate.textSize.input7FontSize,

                    input1FontFamily: CardConfig.saveDateTemplate.textFontFamily.input1FontFamily,
                    input2FontFamily: CardConfig.saveDateTemplate.textFontFamily.input2FontFamily,
                    input3FontFamily: CardConfig.saveDateTemplate.textFontFamily.input3FontFamily,
                    input4FontFamily: CardConfig.saveDateTemplate.textFontFamily.input4FontFamily,
                    input5FontFamily: CardConfig.saveDateTemplate.textFontFamily.input5FontFamily,
                    input6FontFamily: CardConfig.saveDateTemplate.textFontFamily.input6FontFamily,
                    input7FontFamily: CardConfig.saveDateTemplate.textFontFamily.input7FontFamily,

                });
                break;
            case 'rsvp':
                this.setState({
                    defaultText1Value: CardConfig.rsvpTemplate.textValue.defaultText1Value,
                    defaultText2Value: CardConfig.rsvpTemplate.textValue.defaultText2Value,
                    defaultText3Value: CardConfig.rsvpTemplate.textValue.defaultText3Value,
                    defaultText4Value: CardConfig.rsvpTemplate.textValue.defaultText4Value,
                    defaultText5Value: CardConfig.rsvpTemplate.textValue.defaultText5Value,
                    defaultText6Value: CardConfig.rsvpTemplate.textValue.defaultText6Value,
                    input1Text: CardConfig.rsvpTemplate.textValue.defaultText1Value,
                    input2Text: CardConfig.rsvpTemplate.textValue.defaultText2Value,
                    input3Text: CardConfig.rsvpTemplate.textValue.defaultText3Value,
                    input4Text: CardConfig.rsvpTemplate.textValue.defaultText4Value,
                    input5Text: CardConfig.rsvpTemplate.textValue.defaultText5Value,
                    input6Text: CardConfig.rsvpTemplate.textValue.defaultText6Value,
                    yPos1: CardConfig.rsvpTemplate.textPosition.yPos1,
                    yPos2: CardConfig.rsvpTemplate.textPosition.yPos2,
                    yPos3: CardConfig.rsvpTemplate.textPosition.yPos3,
                    yPos4: CardConfig.rsvpTemplate.textPosition.yPos4,
                    yPos5: CardConfig.rsvpTemplate.textPosition.yPos5,
                    yPos6: CardConfig.rsvpTemplate.textPosition.yPos6,
                    yPos7: CardConfig.rsvpTemplate.textPosition.yPos7,
                    input1FontSize: CardConfig.rsvpTemplate.textSize.input1FontSize,
                    input2FontSize: CardConfig.rsvpTemplate.textSize.input2FontSize,
                    input3FontSize: CardConfig.rsvpTemplate.textSize.input3FontSize,
                    input4FontSize: CardConfig.rsvpTemplate.textSize.input4FontSize,
                    input5FontSize: CardConfig.rsvpTemplate.textSize.input5FontSize,
                    input6FontSize: CardConfig.rsvpTemplate.textSize.input6FontSize,
                    input7FontSize: CardConfig.rsvpTemplate.textSize.input7FontSize,

                    input1FontFamily: CardConfig.rsvpTemplate.textFontFamily.input1FontFamily,
                    input2FontFamily: CardConfig.rsvpTemplate.textFontFamily.input2FontFamily,
                    input3FontFamily: CardConfig.rsvpTemplate.textFontFamily.input3FontFamily,
                    input4FontFamily: CardConfig.rsvpTemplate.textFontFamily.input4FontFamily,
                    input5FontFamily: CardConfig.rsvpTemplate.textFontFamily.input5FontFamily,
                    input6FontFamily: CardConfig.rsvpTemplate.textFontFamily.input6FontFamily,
                    input7FontFamily: CardConfig.rsvpTemplate.textFontFamily.input7FontFamily,
                });
                break;
            default:
                this.setState({
                    defaultText1Value: '',
                    defaultText2Value: '',
                    defaultText3Value: '',
                    defaultText4Value: '',
                    defaultText5Value: '',
                    defaultText6Value: '',
                    input1Text: '',
                    input2Text: '',
                    input3Text: '',
                    input4Text: '',
                    input5Text: '',
                    input6Text: '',
                    yPos1: CardConfig.defaultTextPosition.yPos1,
                    yPos2: CardConfig.defaultTextPosition.yPos2,
                    yPos3: CardConfig.defaultTextPosition.yPos3,
                    yPos4: CardConfig.defaultTextPosition.yPos4,
                    yPos5: CardConfig.defaultTextPosition.yPos5,
                    yPos6: CardConfig.defaultTextPosition.yPos6,
                    yPos7: CardConfig.defaultTextPosition.yPos7,
                    input1FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input2FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input3FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input4FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input5FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input6FontSize: CardConfig.defaultTextSize.inputFontSize,
                    input7FontSize: CardConfig.defaultTextSize.inputFontSize,

                    input1FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input2FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input3FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input4FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input5FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input6FontFamily: CardConfig.defultFontFamily.inputFontFamily,
                    input7FontFamily: CardConfig.defultFontFamily.inputFontFamily

                });
                break;
        }

    }

    componentWillUnmount() {
        this.setState({makeCard: []});
    }

    onShare = () => {
        Utils.shareImage(this.state.imageUrl, 'Invitation', 'Join the fun in celebrating')//to do
    }
    /**
     *
     * @param text
     * @param input
     */

    setWishwords = (text, input) => {
        var stateName = `${input}Text`;
        this.setState({[stateName]: this.insertEnter(text, 280)});
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
        var self = this;
        var textColor = colors.gold;
        var font = this.state.fontFamily;
        var fontSize = this.state.fontSize;

        var xPos = this.state.xPos;
        var textAlign = this.state.textAlign;
        var imageUrl = url;
        var textInfo1 = {
            text: this.state.input1Text || '',
            color: this.state.input1Color || textColor,
            fontSize: this.state.input1FontSize || fontSize,
            fontName: this.state.input1FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos1,
            alignment: this.state.input1TextAlign || textAlign,

        }

        var textInfo2 = {
            text: this.state.input2Text || '',
            color: this.state.input2Color || textColor,
            fontSize: this.state.input2FontSize || fontSize,
            fontName: this.state.input2FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos2,// 56*4,
            alignment: this.state.input2TextAlign || textAlign,

        }

        var textInfo3 = {
            text: this.state.input3Text || '',
            color: this.state.input3Color || textColor,
            fontSize: this.state.input3FontSize || fontSize,
            fontName: this.state.input3FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos3,// 56*6,
            alignment: this.state.input3TextAlign || textAlign,

        }
        var textInfo4 = {
            text: this.state.input4Text || '',
            color: this.state.input4Color || textColor,
            fontSize: this.state.input4FontSize || fontSize,
            fontName: this.state.input4FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos4,
            alignment: this.state.input4TextAlign || textAlign,
        }
        var textInfo5 = {
            text: this.state.input5Text || '',
            color: this.state.input5Color || textColor,
            fontSize: this.state.input5FontSize || fontSize,
            fontName: this.state.input5FontFamily || fontSize,
            xPos: xPos,//30,
            yPos: this.state.yPos5,//56*13,
            alignment: this.state.input5TextAlign || textAlign,
        }
        var textInfo6 = {
            text: this.state.input6Text || '',
            color: this.state.input6Color || textColor,
            fontSize: this.state.input6FontSize || fontSize,
            fontName: this.state.input6FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos6,// 56*14,
            alignment: this.state.input6TextAlign || textAlign,
        }
        var textInfo7 = {
            text: this.state.input7Text || '',
            color: this.state.input7Color || textColor,
            fontSize: this.state.input7FontSize || fontSize,
            fontName: this.state.input7FontFamily || font,
            xPos: xPos,//30,
            yPos: this.state.yPos7,//56*15
            alignment: this.state.input7TextAlign || textAlign,
        }

        this.writeImage(imageUrl, textInfo1, textInfo2, textInfo3, textInfo4, textInfo5, textInfo6, textInfo7).then((path) => {
            self.setState({
                show: true,
                loading: false,
                bgColor: colors.pink,
                imageUrl: Platform.OS === 'android' ? 'file://' + path : path
            })
        });
    }

    showEditPanel = () => {
        let showEditPanel = (this.state.show == true) ? false : true;
        this.setState({
            show: showEditPanel,
        });
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
            containerViewStyle={{width: 40}}

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
                style={[cardStyle.container, this.state.show ? {opacity: 0} : {opacity: 1}, {flexGrow: 4,}]}
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

                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText1Value}
                                        inputStyle={[cardStyle.inputStyle]}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input1')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 1})
                                })}
                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText2Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input2')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 2})

                                })}
                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText3Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 280)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input3')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 3})
                                })}
                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText4Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input4')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 4})
                                })}

                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText5Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input5')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 5})
                                })}
                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText6Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input6')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 6})
                                })}
                            </View>
                            <View style={cardStyle.inputContainer}>
                                <View style={{flex: 1, flexGrow: 6}}>
                                    <FormInput
                                        value={this.state.defaultText7Value}
                                        inputStyle={cardStyle.inputStyle}
                                        ref="wishwords"
                                        multiline
                                        numberOfLines={4}
                                        maxLength={280}
                                        containerRef="wishwordscontainerRef"
                                        textInputRef="wishwordsInputRef"
                                        placeholder="Please enter wish words(length less than 80)"
                                        placeholderTextColor={colors.grey3}
                                        onChangeText={(text) => this.setWishwords(text, 'input7')}
                                    />
                                </View>
                                {this.renderIcon("cog", () => {
                                    this.setState({modalVisible: true, modalIndex: 7})
                                })}
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
                          onPress={() => this.showEditPanel()}
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
     * *var textPosition = `input${this.state.modalIndex}Position`; removed
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
                        // [textPosition]: position,
                        modalVisible: false,
                    });

                }}
                modalIndex={this.state.modalIndex}
                okLabel="Done"
                cancelLabel="Cancel"
            />
        )
    }

    renderEditContainer = () => {
        var imageUrl = this.state.show ? this.state.imageUrl : (this.state.makeCard).illustration;
        return (

            <View style={cardStyle.container}>
                <View style={[cardStyle.container,{flexGrow:1}]}>
                    {this.renderIconPanel()}
                </View>
                <View style={[cardStyle.container, cardStyle.editCardContainer,{backgroundColor:this.state.bgColor}]}>

                    {this.state.loading ?
                        <View style={[cardStyle.container, {
                        alignSelf: 'center',
                        justifyContent: 'center',
                    }]}>
                            <ActivityIndicator size="large" color={colors.secondary2}/>
                        </View>
                        : null}
                    <ImageBackground
                        source={{uri: imageUrl}}
                        style={[cardStyle.cardImage, this.state.loading ? {opacity: 0} : {opacity: 1}]}
                        imageStyle={{resizeMode: 'contain'}}
                    >

                        {this.renderEditInput()}
                        {this.renderEditModal()}
                    </ImageBackground>
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

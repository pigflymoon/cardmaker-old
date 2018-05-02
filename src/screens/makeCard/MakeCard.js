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
    AsyncStorage
} from 'react-native';
import {
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    Card,
    CheckBox
} from 'react-native-elements';
import {ColorWheel} from 'react-native-color-wheel';
import Marker from 'react-native-image-marker'
import {Dropdown} from 'react-native-material-dropdown';
import {auth} from '../../config/FirebaseConfig';

import formStyle from '../../styles/form';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';

import {
    renderAuthBox,
} from '../../utils/authApi';
const iOS_fonts = ['SnellRoundhand-Bold', 'Baskerville-Italic', 'Bradley Hand', 'Noteworthy-Bold', 'Party LET', 'Papyrus', 'SnellRoundhand-Bold', 'Zapfino']
const fonts = iOS_fonts;
const fontFamily = [{
    value: 'Academy Engraved LET'
}, {
    value: 'AcademyEngravedLetPlain'
}, {
    value: 'Al Nile'
}, {
    value: 'AlNile-Bold'
}, {
    value: 'American Typewriter'
}, {
    value: 'AmericanTypewriter-Bold'
}, {
    value: 'AmericanTypewriter-Condensed'
}, {
    value: 'AmericanTypewriter-CondensedBold'
}, {
    value: 'Apple Color Emoji'
}, {
    value: 'Apple SD Gothic Neo'
}, {
    value: 'AppleSDGothicNeo-Bold'
}, {
    value: 'Arial'
}, {
    value: 'Arial-BoldItalicMT'
}, {
    value: 'Arial-BoldMT'
}, {
    value: 'ArialHebrew-Bold'
}, {
    value: 'ArialMT'
}, {
    value: 'Avenir'
}, {
    value: 'AvenirNext-DemiBoldItalic'
}, {
    value: 'Bangla Sangam MN'
}, {
    value: 'Baskerville-Bold'
}, {
    value: 'Bodoni 72'
}, {
    value: 'Bodoni 72 Oldstyle'
}, {
    value: 'Bradley Hand'
}, {
    value: 'BradleyHandITCTT-Bold'
}, {
    value: 'Chalkboard SE'
}, {
    value: 'ChalkboardSE-Bold'
}, {
    value: 'Chalkduster'
}, {
    value: 'Cochin-Bold'
}, {
    value: 'Cochin-BoldItalic'
}, {
    value: 'Courier'
}, {
    value: 'DamascusBold'
}, {
    value: 'Didot',
}, {
    value: 'Didot-Bold'
}, {
    value: 'Didot-Italic'
}, {
    value: 'EuphemiaUCAS-Bold'
}, {
    value: 'Farah'
}, {
    value: 'Futura'
}, {
    value: 'GeezaPro-Bold'
}, {
    value: 'Georgia-Bold'
}, {
    value: 'Gill Sans'
}, {
    value: 'GillSans-Bold'
}, {
    value: 'GillSans-Italic'
}, {
    value: 'GujaratiSangamMN-Bold'
}, {
    value: 'Helvetica'
}, {
    value: 'Helvetica-Bold'
}, {
    value: 'HelveticaNeue-Bold'
}, {
    value: 'HelveticaNeue-Italic'
}, {
    value: 'Marker Felt'
}, {
    value: 'Menlo'
}, {
    value: 'Noteworthy'
},{
    value:'Noteworthy-Bold'
}, {
    value: 'Optima-BoldItalic'
}, {
    value: 'Palatino-Bold'
}, {
    value: 'Palatino-BoldItalic'
}, {
    value: 'Papyrus'
}, {
    value: 'Party LET'
}, {
    value: 'PartyLetPlain'
}, {
    value: 'Savoye LET'
}, {
    value: 'SnellRoundhand-Bold'
}, {
    value: 'Times New Roman'
}, {
    value: 'TimesNewRomanPS-BoldItalicMT'
}, {
    value: 'Trebuchet-BoldItalic'
}, {
    value: 'Verdana-BoldItalic'
}, {
    value: 'Zapf Dingbats'
}, {
    value: 'Zapfino'
}
]
const fontSize = [{
    value: 32,
}, {
    value: 48,
}, {
    value: 50,
}, {
    value: 52
}, {
    value: 54
}, {
    value: 58
}, {
    value: 64
}, {
    value: 72
},
];

const textPostion = [{
    value: 'topLeft'
}, {
    value: 'topCenter'
}, {
    value: 'topRight'
}, {
    value: 'bottomLeft'
}, {
    value: 'bottomCenter'
}, {
    value: 'bottomRight'
}, {
    value: 'center'
},]
export default class MakeCard extends Component {

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
            check: [],
            fontFamily: 'SnellRoundhand-Bold',
            fontSize: 48,
        }
    }

    componentWillMount() {
        if (this.props.navigation.state.params) {
            var makeCard = this.props.navigation.state.params.chooseCards;
            var signin = this.props.navigation.state.params.signin;

            if (makeCard) {
                this.setState({makeCard: makeCard, signin: signin});
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
        var makeCard = nextProps.navigation.state.params.chooseCards;
        this.setState({makeCard: makeCard});
    }

    componentWillUnmount() {
        this.setState({makeCard: null});
    }

    setWishwords = (text) => {
        this.setState({title: text});
    }

    setName = (text) => {
        this.setState({caption: text});
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

    imageMarker = (url) => {
        var title = this.state.title;
        var caption = this.state.caption;

        title = this.insertEnter(title, 26)
        var text = title + '\n' + caption;
        var textColor = this.state.textColor || colors.primary1;
        var position = this.state.textPosition;
        var font = this.state.fontFamily;
        console.log('size  font position', this.state.fontSize, this.state.fontFamily, this.state.textPosition)
        var textSize = this.state.fontSize;
        //
        Marker.addTextByPostion(url, text, position, textColor, font, textSize)
            .then((path) => {
                this.setState({
                    show: true,
                    imageUrl: Platform.OS === 'android' ? 'file://' + path : path
                })
            }).catch((err) => {
            console.log(err)
        })
    }

    onChangeFontSize = (size) => {
        console.log('size is ', size)
        this.setState({
            fontSize: size,
        });
    }
    onChangeFontFamily = (font) => {
        console.log('font is ', font)
        this.setState({
            fontFamily: font,
        });
    }
    onChangeTextPosition = (position) => {
        console.log('position is ', position)
        this.setState({
            textPosition: position
        });

    }
    renderEdit = () => {
        return (
            <View style={layoutStyle.container}>
                <View style={cardStyle.iconsContainer}>
                    <View style={cardStyle.shareRightIcon}>

                        <ColorWheel
                            initialColor="#ee0000"
                            onColorChange={(color) => this.setTextColor(color)}
                            style={{width: 60, height: 60, marginLeft: 20,}}
                            thumbSize={20}
                            thumbStyle={{height: 50, width: 50, borderRadius: 50}}/>

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
                        <Dropdown
                            label='Font Size'
                            data={fontSize}
                            onChangeText={this.onChangeFontSize}
                        />
                        <Text style={[cardStyle.editCardTip,{fontFamily:this.state.fontFamily}]}>
                           selected: {this.state.fontFamily}
                        </Text>
                        <Dropdown
                            label='Font Family'
                            data={fontFamily}
                            onChangeText={this.onChangeFontFamily}
                        />
                        <Dropdown
                            label='Text Position'
                            data={textPostion}
                            onChangeText={this.onChangeTextPosition}
                        />

                    </View>


                </ScrollView>
                <View style={{
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
                </View>


            </View>
        )
    }

    render() {
        var navigation = this.props.navigation;

        if ((this.state.makeCard) && (this.state.signin)) {
            return this.renderEdit();

        }
        else if (this.state.signin) {
            return (
                <View style={cardStyle.container}>
                    <Card title='Welcome to cardmaker'>
                        <Text style={{marginBottom: 10}}>
                            Please choose picture to make card
                        </Text>

                    </Card>
                </View>
            )
        } else {
            {
                return renderAuthBox(this.state.isLoading, navigation)
            }

        }
    }
}

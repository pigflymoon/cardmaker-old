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
} from 'react-native';
import {
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {ColorWheel} from 'react-native-color-wheel';
import Marker from 'react-native-image-marker'
import {Dropdown} from 'react-native-material-dropdown';
import {auth} from '../../config/FirebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';

import  Utils from '../../utils/utils';


import bg from '../../assets/images/noWifiBg.png';
import formStyle from '../../styles/form';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';
import showInfo from '../../styles/showInfo';

import {
    renderAuthBox,
} from '../../utils/authApi';
import CardConfig from '../../config/CardConfig';

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
            fontFamily: 'SnellRoundhand-Bold',
            fontSize: 48,
            fontStyle: 'normal',
            fontWeight: 'normal',
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
        var makeCard = (nextProps.navigation.state.params.chooseCards);
        this.setState({makeCard: makeCard});
    }

    componentWillUnmount() {
        this.setState({makeCard: []});
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
        this.setState({
            fontSize: size,
        });
    }
    onChangeFontFamily = (font) => {
        this.setState({
            fontFamily: font,
        });
    }

    onChangeFontStyle = (style) => {
        this.setState({fontStyle: style});
    }


    onChangeTextPosition = (position) => {
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
                                               autoCapitalize = "none"
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
                                               autoCapitalize = "none"
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
                            data={CardConfig.fontSize}
                            onChangeText={this.onChangeFontSize}
                        />
                        <Dropdown
                            label='Font Family'
                            data={CardConfig.fontFamily}
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

    render() {
        var navigation = this.props.navigation;
        var card = Utils.isEmptyObject(this.state.makeCard)
        var renderCard = (!card && this.state.signin);

        if (renderCard) {
            return this.renderEdit();

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

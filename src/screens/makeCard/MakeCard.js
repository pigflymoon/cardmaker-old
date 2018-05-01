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
import {auth} from '../../config/FirebaseConfig';
import Marker from 'react-native-image-marker'
import TextPositionButton from '../../components/TextPositionButton';
// import CustomTagGroups from '../../components/CustomTagGroups';
import  Utils from '../../utils/utils';
import formStyle from '../../styles/form';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';

import {
    renderAuthBox,
} from '../../utils/authApi';
const iOS_fonts = ['SnellRoundhand-Bold', 'Baskerville-Italic', 'Bradley Hand','Noteworthy-Bold', 'Party LET', 'Papyrus', 'SnellRoundhand-Bold', 'Zapfino']
const fonts = iOS_fonts;

export default class MakeCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            title: '',
            caption: '',
            checked: false,
            signin: false,
            position: 'bottomCenter',
            textColor: colors.primary1,
            check: [],
            font: 'SnellRoundhand-Bold',
            fontSize: 48,
        }
    }

    componentWillMount() {
        if (this.props.navigation.state.params) {
            var makeCard = this.props.navigation.state.params.chooseCards;
            var signin = this.props.navigation.state.params.signin;

            if (makeCard) {
                var my_check = []
                fonts.forEach((folder) => {
                    my_check.push(false)
                });
                console.log('my check', my_check)

                this.setState({makeCard: makeCard, signin: signin, check: my_check});
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
        var position = this.state.position;
        var font = this.state.font;
        console.log('size ', this.state.fontSize)
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
    onHandleSelect = (selectedName, selectedValue, position) => {
        this.setState({
            selectedName: selectedName,
            selectedValue: selectedValue,
            position: position
        });

    }
    updateFont = (item, index) => {
        console.log('item is ', item)
        console.log('index is ', index)
        // var myFonts = this.state.check;
        this.setState({check: []});
        var my_check = []
        fonts.forEach(() => {
            my_check.push(false)
        });

        my_check[index] = true;
        this.setState({
            check: my_check,
            font: item,
        })
    }
    updateFontSize = (rule) => {
        this.setState({fontSize: rule});
    }
    onPreview = (url) => {
        var title = this.state.title;
        var caption = this.state.caption;

        title = this.insertEnter(title, 26)
        var text = title + '\n' + caption;
        var textColor = this.state.textColor || colors.primary1;
        var position = this.state.position;
        var font = this.state.font;
        console.log('size ', this.state.fontSize)
        var textSize = this.state.fontSize;
        this.props.navigation.navigate('PreviewCard', {
            url: url, text: text, position: position, textColor: textColor, font: font, textSize: textSize
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
                              onPress={() => this.onPreview((this.state.makeCard).illustration)}
                        />
                    </View>

                </View>
                <ScrollView style={[cardStyle.container, {
                    flexGrow: 2,
                }]}>
                    <KeyboardAvoidingView behavior='position' contentContainerStyle={{
                        alignItems: 'center',
                        justifyContent: 'center',

                    }}>
                        <View style={cardStyle.editTextContainer}>
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

                    <View style={cardStyle.container}>
                        <Text style={cardStyle.editCardTip}>
                            Font Family
                        </Text>
                        <View style={cardStyle.editCardPositionContainer}>
                            <ScrollView
                                style={cardStyle.container}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={[cardStyle.container]}>
                                    <FlatList
                                        style={[{flexDirection: 'column'}]}
                                        numColumns={2}
                                        data={fonts}
                                        extraData={this.state}
                                        renderItem={({item, index}) => (
                                            <CheckBox
                                                title={item}
                                                fontFamily={item}
                                                key={index}
                                                checked={this.state.check[index]}
                                                onPress={() => this.updateFont(item, index)}
                                            />
                                        )}
                                    />
                                </View>

                            </ScrollView>
                        </View>
                        <Text style={cardStyle.editCardTip}>
                            Text Position
                        </Text>
                        <View style={cardStyle.editCardPositionContainer}>
                            <ScrollView
                                style={cardStyle.container}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                <View style={{flex: 1, flexDirection: 'row'}}>
                                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                        <View style={cardStyle.container}>
                                            <TextPositionButton positionType="topLeft"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>
                                            <TextPositionButton positionType="bottomLeft"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>
                                            <TextPositionButton positionType="center"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>


                                        </View>
                                        <View style={cardStyle.container}>
                                            <TextPositionButton positionType="topCenter"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>
                                            <TextPositionButton positionType="bottomCenter"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>

                                        </View>
                                        <View style={cardStyle.container}>
                                            <TextPositionButton positionType="topRight"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>
                                            <TextPositionButton positionType="bottomRight"
                                                                selectedName={this.state.selectedName}
                                                                selectedValue={this.state.selectedValue}
                                                                handleSelect={this.onHandleSelect}/>


                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                        <Text style={cardStyle.editCardTip}>
                            Font Size
                        </Text>

                        <View style={cardStyle.container}>
                            <Picker style={cardStyle.pickerContainer}
                                    selectedValue={this.state.fontSize}
                                    onValueChange={this.updateFontSize}
                            >
                                <Picker.Item label="32" value={32}/>
                                <Picker.Item label="48" value={48}/>
                                <Picker.Item label="50" value={50}/>
                                <Picker.Item label="54" value={54}/>
                                <Picker.Item label="58" value={58}/>
                                <Picker.Item label="60" value={60}/>

                            </Picker>
                        </View>
                    </View>


                </ScrollView>


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

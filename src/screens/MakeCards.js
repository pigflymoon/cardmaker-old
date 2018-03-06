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
} from 'react-native';
import {
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    Card,
    Button,
    Badge,
} from 'react-native-elements';
import {ColorWheel} from 'react-native-color-wheel';
import {auth, db, storage} from '../config/FirebaseConfig';
import Marker from 'react-native-image-marker'
import  Utils from '../utils/utils';
import colors from '../styles/colors';
import formStyle from '../styles/form';
import cardStyle from '../styles/card';
import buttonStyle from '../styles/button';

const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;

export default class MakeCards extends Component {


    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            title: '',
            caption: '',
            checked: false,
            signin: false,
            position: 'bottomRight',
            textColor: colors.primary,
            selectedItem: [{name: "topLeft", value: false},
                {name: "topCenter", value: false},
                {name: "topRight", value: false},
                {name: "bottomLeft", value: false},
                {name: "bottomCenter", value: false},
                {name: "bottomRight", value: false},
                {name: "center", value: false}],
            selectedIndex: 0,

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
                console.log('no user?')
                self.setState({signin: false})
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        var makeCard = nextProps.navigation.state.params.chooseCards;
        console.log('makeCard passed in nextprops,', makeCard)
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

    onShare = () => {
        Utils.shareImage(this.state.imageUrl, this.state.title, this.state.caption)
    }


    updateChoice(type) {

        //
        console.log('update choice')
        var self = this;
        let showPosition = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'center'];

        var selectedItem = showPosition.map(position => ({name: position, value: false}));

        var selectedIndex = 0;
        selectedItem.forEach(function (item, i) {
            if (item.name == type) {
                item.value = !item.value;
                selectedIndex = i;
                self.setState({
                    selectedItem,
                    selectedIndex: selectedIndex,
                    position: item.name
                });
            }

        })

    }

    setTextColor = (color) => {
        var hexColor = color ? color.hexColor : colors.primary
        this.setState({textColor: hexColor})
    }
    insertEnter = (str, n) => {
        var len = str.length;//获取字符的长度
        var strTemp = '';
        if (len > n) {//如果字符的长度大于指定的长度
            strTemp = str.substring(0, n);//那么截取指定长度的字符串
            str = str.substring(n, len);//截取剩余的字符串
            //在截取的指定长度的字符串添加<br />标签实现换行并返回
            return strTemp + '\n' + this.insertEnter(str, n);
        } else {
            return str;
        }
    }

    imageMarker = (url) => {
        var title = this.state.title;
        var caption = this.state.caption;
        console.log('title is ',title)

        title = this.insertEnter(title,26)
        var text = title + '\n' + caption;
        var textColor = this.state.textColor;
        var position = this.state.position;
        var textSize = 60;
        console.log('textColor is ', textColor)

        //
        Marker.addTextByPostion(url, text, position, textColor, 'Arial-BoldItalicMT', textSize)
            .then((path) => {
                this.setState({
                    show: true,
                    imageUrl: Platform.OS === 'android' ? 'file://' + path : path
                })

                console.log('image path is ,', path)
            }).catch((err) => {
            console.log('====================================')
            console.log(err)
            console.log('====================================')
        })
    }




    navigateToSignin = () => {
        this.props.navigation.navigate('MySettings', {});

    }

    renderSignCard() {
        return (
            <Card title='Welcome to cardmaker'>
                <Text style={{marginBottom: 10}}>
                    Please sign in then choose picture to make card
                </Text>
                <Button
                    icon={{name: 'perm-identity'}}
                    buttonStyle={buttonStyle.submitButton}
                    title='Sign in /Sign up'
                    onPress={this.navigateToSignin}
                />
            </Card>
        );
    }

    render() {
        if ((this.state.makeCard) && (this.state.signin)) {
            return (
                <View style={[cardStyle.cardsContainer]}>

                    <View style={cardStyle.imageListContainer}>
                        <View style={{
                            width: '40%',

                        }}>
                            <View style={[formStyle.container, cardStyle.imageContainer, cardStyle.thumbnail]}>
                                <Image style={{
                                    flex: 1,

                                }}
                                       resizeMethod="resize"
                                       source={{uri: (this.state.makeCard).uri}}
                                />
                            </View>

                        </View>
                        <View style={{
                            width: '55%',
                        }}>
                            <View style={formStyle.inputsContainer}>

                                <View style={formStyle.inputContainer}>

                                    <FormLabel containerStyle={formStyle.labelContainerStyle}>
                                        Wish words
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               multiline
                                               numberOfLines = {4}
                                               maxLength = {52}
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words(length less than 52)"
                                               onChangeText={(text) => this.setWishwords(text)}
                                    />
                                </View>

                                <View style={formStyle.inputContainer}>

                                    <FormLabel containerStyle={formStyle.labelContainerStyle}>
                                        Name
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="Name"
                                               maxLength = {26}
                                               containerRef="namecontainerRef"
                                               textInputRef="nameInputRef"
                                               placeholder="Please Sign your name"
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


                    </View>
                    <View style={cardStyle.editContainer}>
                        <View style={cardStyle.markerTextContainer}>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'topLeft') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}
                                   value='topLeft'
                                   onPress={() => {
                                       this.updateChoice('topLeft')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'topCenter') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='topCenter'
                                   onPress={() => {
                                       this.updateChoice('topCenter')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'topRight') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='topRight'
                                   onPress={() => {
                                       this.updateChoice('topRight')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'bottomLeft') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='bottomLeft'
                                   onPress={() => {
                                       this.updateChoice('bottomLeft')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'bottomCenter') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='bottomCenter'
                                   onPress={() => {
                                       this.updateChoice('bottomCenter')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'bottomRight') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='bottomRight'
                                   onPress={() => {
                                       this.updateChoice('bottomRight')
                                   }}/>
                            <Badge containerStyle={cardStyle.badgeBg}
                                   textStyle={{color: (((this.state.selectedItem)[this.state.selectedIndex].name == 'center') && ((this.state.selectedItem)[this.state.selectedIndex].value == true))?colors.white:colors.grey0}}

                                   value='center'
                                   onPress={() => {
                                       this.updateChoice('center')
                                   }}/>


                        </View>
                        <View style={cardStyle.iconsContainer}>
                            <View style={cardStyle.shareRightIcon}>
                                <ColorWheel
                                    initialColor="#ee0000"
                                    onColorChange={(color) => this.setTextColor(color)}
                                    style={{width: 100}}
                                    thumbStyle={{height: 10, width: 10, borderRadius: 10}}/>

                            </View>
                            <View style={cardStyle.shareRightIcon}>
                                <Icon name="pencil-square" type="font-awesome" color={colors.primary1} size={24}
                                      onPress={() => this.imageMarker((this.state.makeCard).uri)}
                                />
                            </View>
                            <View style={cardStyle.shareRightIcon}>
                                <Icon name="share-alt" type="font-awesome" color={colors.primary1} size={24}
                                      onPress={this.onShare}
                                />
                            </View>
                        </View>
                    </View>


                    <View style={cardStyle.previewContainer}>
                        <View style={{flex: 1}}>
                            {
                                this.state.show
                                    ? <Image source={{uri: this.state.imageUrl}} resizeMode='contain'
                                             style={cardStyle.preview}/>
                                    : null
                            }
                        </View>
                    </View>


                </View>
            );

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
            return (
                <View style={cardStyle.container}>
                    {this.renderSignCard()}
                </View>
            )

        }


    }

}

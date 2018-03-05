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
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import {auth, db, storage} from '../config/FirebaseConfig';
import Marker from 'react-native-image-marker'
import Utils from '../utils/utils';
import colors from '../styles/colors';
import formStyle from '../styles/form';
import cardStyle from '../styles/card';
import buttonStyle from '../styles/button';
import CardTextBadege from '../components/CardTextBadge';

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

    imageMarker = (url) => {
        //

        var title = this.state.title;
        var caption = this.state.caption;
        var text = title + '\n' + caption;
        var textColor = Utils.getRandomColor();
        var position = this.state.position;
        console.log('positon is ', position)

        //
        Marker.addTextByPostion(url, text, position, textColor, 'Arial-BoldItalicMT', 44)
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


    getItemColor = (item) => {
        var items = this.state.selectedItem;
        console.log('name is ', items[this.state.selectedIndex].name, 'item name is ', item)

        if ((items[this.state.selectedIndex].name == item) && (items[this.state.selectedIndex].value == true)) {
            return colors.white;
        } else {
            return colors.grey0;
        }
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
                    <View style={[formStyle.container, cardStyle.imageContainer, cardStyle.thumbnail]}>
                        <Image style={{
                            flex: 1,

                        }}
                               resizeMethod="resize"
                               source={{uri: (this.state.makeCard).uri}}
                        />
                    </View>
                    <View style={cardStyle.imageListContainer}>
                        <View style={{
                            width: '40%',

                        }}>

                            <View style={formStyle.inputsContainer}>

                                <View style={formStyle.inputContainer}>

                                    <FormLabel containerStyle={formStyle.labelContainerStyle}>
                                        Wish words
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="wishwords"
                                               containerRef="wishwordscontainerRef"
                                               textInputRef="wishwordsInputRef"
                                               placeholder="Please enter wish words"
                                               onChangeText={(text) => this.setWishwords(text)}
                                    />
                                </View>

                                <View style={formStyle.inputContainer}>

                                    <FormLabel containerStyle={formStyle.labelContainerStyle}>
                                        Name
                                    </FormLabel>
                                    <FormInput inputStyle={cardStyle.inputStyle}
                                               ref="Name"
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
                        <View style={{
                            width: '55%',
                        }}>
                            <View style={cardStyle.editContainer}>
                                <View style={cardStyle.markerTextContainer}>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('topLeft')}}
                                           value='topLeft'
                                           onPress={() => {
                                               this.updateChoice('topLeft')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('topCenter')}}
                                           value='topCenter'
                                           onPress={() => {
                                               this.updateChoice('topCenter')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('topRight')}}
                                           value='topRight'
                                           onPress={() => {
                                               this.updateChoice('topRight')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('bottomLeft')}}
                                           value='bottomLeft'
                                           onPress={() => {
                                               this.updateChoice('bottomLeft')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('bottomCenter')}}
                                           value='bottomCenter'
                                           onPress={() => {
                                               this.updateChoice('bottomCenter')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('bottomRight')}}
                                           value='bottomRight'
                                           onPress={() => {
                                               this.updateChoice('bottomRight')
                                           }}/>
                                    <Badge containerStyle={cardStyle.badgeBg}
                                           textStyle={{color: this.getItemColor('center')}}
                                           value='center'
                                           onPress={() => {
                                               this.updateChoice('center')
                                           }}/>

                                </View>
                                <View style={cardStyle.iconsContainer}>
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
                        </View>


                    </View>


                    <View style={cardStyle.previewContainer}>
                        <View
                            style={{flex: 1}}
                        >
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

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
            position: 'bottomRight'
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

    updatePosition = (position) => {
        let showPositions = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'center'];

        this.setState({position: position}, function () {
            for (let position of showPositions) {
                if (this.state.position === position) {
                    let index = showPositions.indexOf(position);
                    let value = position;
                    // let value = ( index == 0 ) ? 0 : (index + 2);
                    // AsyncStorage.setItem('postionValue', value.toString());
                    // this.setState({postionValue: value});
                }

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

    getDataUri(canvas, url, callback) {
        const image = new CanvasImage(canvas);
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_WIDTH; //* 0.904
        // this.canvas.width = 600;
        // // this.canvas.height = 800;

        // canvas.autoScale();
        console.log('canvas width is :', canvas.width, 'height is :', canvas.height);
        const context = canvas.getContext('2d');
        image.src = url;
        //
        image.addEventListener('load', () => {
            var imageAspectRatio = (image.width / image.height).toFixed(1);
            var canvasAspectRatio = (canvas.width / canvas.height).toFixed(1);
            console.log('imageAspectRatio is , ', imageAspectRatio)
            console.log('canvasAspectRatio is ', canvasAspectRatio)
            var renderableHeight, renderableWidth, xStart, yStart;
// If image's aspect ratio is less than canvas's we fit on height
            // and place the image centrally along width
            if (imageAspectRatio < canvasAspectRatio) {
                renderableHeight = canvas.height;
                renderableWidth = (image.width * (renderableHeight / image.height)).toFixed(0);
                xStart = (canvas.width - renderableWidth) / 2;
                yStart = 0;
            }

            // If image's aspect ratio is greater than canvas's we fit on width
            // and place the image centrally along height
            else if (imageAspectRatio > canvasAspectRatio) {
                renderableWidth = canvas.width
                renderableHeight = (image.height * (renderableWidth / image.width)).toFixed(0);
                xStart = 0;
                yStart = (canvas.height - renderableHeight) / 2;
            }

            // Happy path - keep aspect ratio
            else {
                renderableHeight = canvas.height;
                renderableWidth = canvas.width;
                xStart = 0;
                yStart = 0;
            }

            console.log('renderableWidth', renderableWidth, 'renderableHeight', renderableHeight)
            context.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);

            //

            var title = this.state.title;
            var caption = this.state.caption;

            context.font = "italic bold 30px Hoefler";

            context.textAlign = "start";
            context.textBaseline = "bottom";
            context.fillStyle = Utils.getRandomColor();  //<======= here
            context.fillText(title, 100, 250);

            context.font = "bold 24px Hoefler";
            context.fillStyle = Utils.getRandomColor();
            context.fillText(caption, 150, 300);
            console.log('canvas width', canvas.width);

            canvas.toDataURL().then((dataUrl) => {
                //get rid of extra "" of the return value ""dsdsfs""
                dataUrl = dataUrl.substring(dataUrl.indexOf("\"") + 1, dataUrl.lastIndexOf("\""));
                callback(dataUrl);
            });

        });

    }


    drawCanvas = (url) => {
        var canvas = this.refs.canvasImage;
        var self = this;
        this.getDataUri(canvas, url, function (dataUri) {
            self.setState({imageUrl: dataUri});
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
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>topLeft</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>topCenter</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>topRight</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>bottomLeft</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>bottomCenter</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>bottomRight</Text>
                                    </Badge>
                                    <Badge containerStyle={{backgroundColor: 'violet'}}>
                                        <Text>center</Text>
                                    </Badge>
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

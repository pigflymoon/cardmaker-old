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
} from 'react-native';
import {
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    Card,
    Button,
} from 'react-native-elements';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import firebaseApp from '../config/FirebaseConfig';

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
        }
    }

    componentDidMount() {
        var self = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
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
        this.setState({makeCard: makeCard});
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


    getDataUri(canvas, url, callback) {
        const image = new CanvasImage(canvas);
        canvas.width = SCREEN_WIDTH;
        canvas.height = SCREEN_WIDTH * 0.904;
        const context = canvas.getContext('2d');
        image.src = url;
        //
        image.addEventListener('load', () => {
            var imageAspectRatio = image.width / image.height;
            var canvasAspectRatio = canvas.width / canvas.height;
            console.log('imageAspectRatio, ', imageAspectRatio)
            console.log('canvasAspectRatio', canvasAspectRatio)
            var renderableHeight, renderableWidth, xStart, yStart;
// If image's aspect ratio is less than canvas's we fit on height
            // and place the image centrally along width
            if (imageAspectRatio < canvasAspectRatio) {
                renderableHeight = canvas.height;
                renderableWidth = image.width * (renderableHeight / image.height);
                xStart = (canvas.width - renderableWidth) / 2;
                yStart = 0;
            }

            // If image's aspect ratio is greater than canvas's we fit on width
            // and place the image centrally along height
            else if (imageAspectRatio > canvasAspectRatio) {
                renderableWidth = canvas.width
                renderableHeight = image.height * (renderableWidth / image.width);
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

            context.drawImage(image, xStart, yStart, renderableWidth, renderableHeight);

            //

            var title = this.state.title;
            var caption = this.state.caption;

            context.font = "italic bold 30px Hoefler";

            context.textAlign = "start";
            context.textBaseline = "bottom";
            context.fillStyle = colors.red1;  //<======= here
            context.fillText(title, 60, 250);

            context.font = "bold 24px Hoefler";
            context.fillStyle = colors.orange1;
            context.fillText(caption, 150, 300);
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

                    <View style={cardStyle.imageListContainer}>
                        <View style={[formStyle.container, cardStyle.imageContainer]}>
                            <Image style={{
                                flex: 1,

                            }}
                                   resizeMethod="scale"
                                   source={{uri: (this.state.makeCard).uri}}
                            />
                        </View>
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
                            <View style={cardStyle.iconContainer}>
                                <View style={cardStyle.shareRightIcon}>
                                    <Icon name="pencil-square" type="font-awesome" color={colors.primary1} size={24}
                                          onPress={() => this.drawCanvas((this.state.makeCard).uri)}
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

                    <View style={cardStyle.previewContainer}>
                        <Canvas ref="canvasImage" style={cardStyle.canvasContainer}/>
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

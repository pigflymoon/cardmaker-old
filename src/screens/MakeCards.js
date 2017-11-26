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
    CheckBox,
} from 'react-native-elements';
import axios from 'axios';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import firebaseApp from '../config/FirebaseConfig';

import Utils from '../utils/utils';
import colors from '../styles/colors';
import formStyle from '../styles/form';
import cardStyle from '../styles/card';


const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;

export default class MakeCards extends Component {


    constructor(props) {
        super(props)
        this.state = {
            moviesList: [],
            makeCard: null,
            title: '',
            caption: '',
            checked: false,
        }
    }

    componentDidMount() {
        var self = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('#########sign in -- Make Cards #########', user)
                self.setState({signin: true})
            } else {
                console.log('no user?')
                self.setState({signin: false})
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        var makeCard = nextProps.navigation.state.params.chooseCards;
        var signin = nextProps.navigation.state.params.signin;

        console.log('makecard', makeCard)
        this.setState({makeCard: makeCard, signin: signin});
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
        canvas.height = 400;
        const context = canvas.getContext('2d');
        image.src = url;
        image.addEventListener('load', () => {
            var originalWidth = image.width;
            var originalHeight = image.height;
            var newWidth = canvas.width;
            var newHeight = (newWidth / originalWidth) * originalHeight;

            context.drawImage(image, 0, 0, newWidth, newHeight)
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


    render() {
        if ((this.state.makeCard) && (this.state.signin)) {
            return (
                <View style={[cardStyle.cardsContainer]}>

                    <View style={cardStyle.imageListContainer}>
                        <View style={[formStyle.container, cardStyle.imageContainer]}>
                            <Image style={{height: 150}}
                                   source={{uri: (this.state.makeCard).uri}}
                                   resizeMode='cover'/>
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
                        <Canvas ref="canvasImage"/>
                    </View>


                </View>
            );

        }
        return (
            <View>
                <Text>Choose your picture</Text>
            </View>
        )

    }


    getMoviesFromApiAsync = () => {
        var url = 'https://dog.ceo/api/breed/hound/afghan/images';
        // var url = 'https://api.geonet.org.nz/quake?MMI=0';//http://droidtute.com/reactexample/sample_api/getMovieList.php';
        var self = this;
        axios.get(url)
            .then(function (result) {
                console.log('result', result.data.message)
                self.setState({moviesList: result.data.message});
                // return result.data.data.pins;

            });
        // return fetch('http://droidtute.com/reactexample/sample_api/getMovieList.php')
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         // alert(JSON.stringify(responseJson))
        //         this.setState({moviesList: responseJson.movieList}) // this will update state to re-render ui
        //         return responseJson.movieList;
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });
    }

}

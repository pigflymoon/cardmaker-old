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
    // Share,
} from 'react-native';
import {
    Tile,
    // Button,
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    List,
    ListItem,
} from 'react-native-elements';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import Utils from '../utils/utils';

import axios from 'axios';
import colors from '../styles/colors';

import formStyle from '../styles/form';
import cardStyle from '../styles/card';
// import buttonStyle from '../styles/button';
// sample api http://droidtute.com/reactexample/sample_api/getMovieList.php

const {width, height} = Dimensions.get('window');
const SCREEN_WIDTH = width;

const equalWidth = (width / 2 )

export default class MakeCards extends Component {


    constructor(props) {
        super(props)
        this.state = {
            moviesList: [],
            makeCard: [],
            previewImage: 'https://i.imgflip.com/1j2oed.jpg',
            showText: false,
            title: '',
            caption: '',
        }
    }

    pickImage = (url) => {
        console.log('image url', url)
        this.setState({
            previewImage: url,
        })
    }

    markByPosition = (position, wishwords, name) => {

        this.setState({
            title: wishwords,
            caption: name,
        })
    }
    _keyExtractor = (item, index) => `key${index}`;
//http://placehold.it/150/92c952
    //https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg
    renderRowItem = (itemData) => {
        console.log('itemData', itemData)

        return (
            <View>
                <TouchableOpacity onPress={() => this.pickImage(itemData.item.uri)}>
                    <Image style={{height: 50, width: equalWidth}}

                           source={{uri: itemData.item.uri}}

                           resizeMode='cover'/>
                </TouchableOpacity>
            </View>
        )
    }

    componentWillMount() {
        // {
        //     this.getMoviesFromApiAsync()
        // }
    }



    //
    componentWillReceiveProps(nextProps) {
        var makeCard = nextProps.navigation.state.params.chooseCards;
        console.log('makecard', makeCard)
        this.setState({makeCard: makeCard});
    }


    setWishwords = (text) => {
        this.setState({title: text});

    }

    setName = (text) => {
        this.setState({caption: text});

    }

    onShare = () => {
        // console.log('****************this.state.imageUrl',this.state.imageUrl)
        Utils.shareImage(this.state.imageUrl, this.state.title, this.state.caption)
        // let shareImageBase64 = {
        //     title: "React Native",
        //     message: "Hola mundo",
        //     url: this.state.imageUrl,//"http://facebook.github.io/react-native/",
        //     subject: "Share Link" //  for email
        // };
        // Share.open(shareImageBase64).catch(err => console.log(err));
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


            context.font = "20px Arial";
            context.strokeText(title, 60, 200);

            context.font = "14px Arial";
            context.strokeText(caption, 60, 250);
            console.log('hi called image load')
            canvas.toDataURL().then((dataUrl) => {
                //get rid of extra "" of the return value ""dsdsfs""
                dataUrl = dataUrl.substring(dataUrl.indexOf("\"") + 1, dataUrl.lastIndexOf("\""));
                callback(dataUrl);
                // return dataUrl;
            });

        });

    }


    drawCanvas = (url) => {
        var canvas = this.refs.canvasImage;
        var text = 'Hello,duck';
        var self = this;
        // this.handleImageRect(canvas, url, text)
        this.getDataUri(canvas, url, function (dataUri) {
            self.setState({imageUrl: dataUri});
        })

    }

    componentDidMount() {

    }

    render() {
        if (this.state.makeCard.length < 1) {
            return (
                <View>
                    <Text>Choose your picture</Text>
                </View>
            )
        }
        return (
            <View style={[cardStyle.cardsContainer]}>

                <View style={cardStyle.imageListContainer}>
                    <View style={[formStyle.container, cardStyle.imageContainer]}>
                        <Image style={{height: 150}}
                               source={{uri: (this.state.makeCard)[0].uri}}
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
                                      onPress={() => this.drawCanvas((this.state.makeCard)[0].uri)}
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

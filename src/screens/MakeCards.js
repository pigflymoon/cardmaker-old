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
import Share, {ShareSheet, Button} from 'react-native-share';
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
import BackgroundTimer from 'react-native-background-timer';
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
            makeCard: [{
                id: 1,
                text: 'Emma',
                age: 29,
                uri: 'https://image.freepik.com/free-vector/unicorn-background-design_1324-79.jpg'
            }],
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

    componentWillUnmount() {
        BackgroundTimer.clearTimeout(this.timeoutId);
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
        // Utils.shareImage(this.state.imageUrl)
        let shareImageBase64 = {
            title: "React Native",
            message: "Hola mundo",
            url: this.state.imageUrl,//"http://facebook.github.io/react-native/",
            // url: imageUrl,
            subject: "Share Link" //  for email
        };
        Share.open(shareImageBase64).catch(err => console.log(err));
    }

    handleImageRect(canvas, url, text) {
        const image = new CanvasImage(canvas);
        canvas.width = SCREEN_WIDTH;
        canvas.height = 400;

        const context = canvas.getContext('2d');

        image.src = url;
        // image.src = 'https://s-media-cache-ak0.pinimg.com/736x/41/75/26/4175268906d97492e4a3175eab95c0f5.jpg';

        image.addEventListener('load', () => {
            console.log('image is loaded');

            var originalWidth = image.width;
            var originalHeight = image.height;
            var newWidth = canvas.width;
            var newHeight = (newWidth / originalWidth) * originalHeight;
            console.log('originalWidth,  originalHeight', originalWidth, originalHeight)
            console.log('newWidth,  newHeight', newWidth, newHeight)

            context.drawImage(image, 0, 0, newWidth, newHeight)
            var title = this.state.title;
            var caption = this.state.caption;


            context.font = "20px Arial";
            context.strokeText(title, 60, 200);

            context.font = "14px Arial";
            context.strokeText(caption, 60, 250);
            canvas.toDataURL().then((dataUrl, callback) => {
                // console.log('dataUrl', dataUrl)
                // callback (generalLastName, options);

                return dataUrl;
            }).then((value) => {
                console.log('value', value)//data:image/png;base64

                // Utils.shareImage(value);
                // Start a timer that runs once after X milliseconds
                this.timeoutId = BackgroundTimer.setTimeout(() => {
                    let shareImageBase64 = {
                        title: "React Native",
                        message: "Hola mundo",
                        url: value,//"http://facebook.github.io/react-native/",
                        // url: imageUrl,
                        subject: "Share Link" //  for email
                    };
                    Share.open(shareImageBase64).catch(err => console.log(err));
                    console.log('tac');
                }, 10000);

// Cancel the timeout if necessary
//

                // this.setState({
                //     imageUrl: value,
                // })
            })
                .catch((error) => {
                    console.error(error);
                }).done();

        });
    }

    drawCanvas = (url) => {
        var canvas = this.refs.canvasImage;
        var text = 'Hello,duck';
        this.handleImageRect(canvas, url, text)

    }

    componentDidMount() {
        // this.props.navigation.setParams({handleShare: this.onShare})
        console.log('this.state.makeCard)[0].uri', (this.state.makeCard)[0])
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
                        <TouchableOpacity onPress={() => this.drawCanvas((this.state.makeCard)[0].uri)}>
                            <Image style={{height: 150}}

                                   source={{uri: (this.state.makeCard)[0].uri}}

                                   resizeMode='cover'/>
                        </TouchableOpacity>

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
                        <View style={cardStyle.shareRightIcon}>
                            <Icon name="share-alt" type="font-awesome" color={colors.primary1} size={24}
                                  onPress={this.onShare}
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

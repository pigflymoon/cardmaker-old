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
    Share,
} from 'react-native';
import {
    Tile,
    Button,
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    List,
    ListItem,
} from 'react-native-elements';
import Utils from '../utils/utils';

import axios from 'axios';
import colors from '../styles/colors';

import formStyle from '../styles/form';
import cardStyle from '../styles/card';
// import buttonStyle from '../styles/button';
// sample api http://droidtute.com/reactexample/sample_api/getMovieList.php

const {width, height} = Dimensions.get('window');

const equalWidth = (width / 2 )

export default class MakeCards extends Component {


    constructor(props) {
        super(props)
        this.state = {
            moviesList: [],
            makeCard: [{id: 1, text: 'Emma', age: 29, uri: 'https://i.imgur.com/FHxVpN4.jpg'}],
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

    onShare = (message, url) => {
        Utils.shareText(this.state.title, 'http://facebook.com')
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
                    <View style={[formStyle.container, cardStyle.imageContainer]}>
                        <TouchableOpacity onPress={() => this.pickImage((this.state.makeCard)[0].uri)}>
                            <Image style={{height: 150}}

                                   source={{uri: (this.state.makeCard)[0].uri}}

                                   resizeMode='cover'/>
                        </TouchableOpacity>

                    </View>

                </View>
                <View style={cardStyle.previewContainer}>
                    <Tile
                        imageSrc={{uri: this.state.previewImage}}
                        title={this.state.title}
                        featured
                        caption={this.state.caption}

                    />

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

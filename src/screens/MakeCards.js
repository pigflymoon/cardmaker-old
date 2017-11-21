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
import {Tile} from 'react-native-elements';

import axios from 'axios';

// sample api http://droidtute.com/reactexample/sample_api/getMovieList.php

const {width, height} = Dimensions.get('window');

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
                    <Image style={{height: 150, width: equalWidth}}

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


    render() {
        if (this.state.makeCard.length < 1) {
            return (
                <View>
                    <Text>Choose your picture</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <View style={styles.imageListContainer}>
                    <FlatList
                        data={this.state.makeCard}
                        numColumns={2}
                        keyExtractor={this._keyExtractor}
                        renderItem={this.renderRowItem}
                    />

                </View>
                <View style={styles.previewContainer}>


                    <Tile
                        onPress={() => this.markByPosition('', 'Wish you Merry Christmas', 'By Duck')}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    imageListContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'column'
    },
    previewContainer: {
        flex: 1,
        flexDirection: 'row',
        // width: width,
    },
    button: {
        backgroundColor: 'tomato',
        width: 34,
        height: 34,
        borderRadius: 34 / 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    }

});

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
} from 'react-native';
import axios from 'axios';

// sample api http://droidtute.com/reactexample/sample_api/getMovieList.php

const {width, height} = Dimensions.get('window');

const equalWidth = (width / 2 )

export default class MakeCards extends Component {


    constructor(props) {
        super(props)
        this.state = {
            moviesList: []
        }
    }

    _keyExtractor = (item, index) => `key${index}`;
//http://placehold.it/150/92c952
    //https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg
    renderRowItem = (itemData) => {
        console.log('itemData',itemData)

        return (
            <View>
                <Image style={{height: 150, width: equalWidth}}

                       source={{uri: itemData.item}}

                       resizeMode='cover'/>
            </View>
        )
    }

    componentWillMount() {
        {
            this.getMoviesFromApiAsync()
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.moviesList}
                    numColumns={2}
                    keyExtractor={this._keyExtractor}
                    renderItem={this.renderRowItem}
                />
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
        backgroundColor: '#F5FCFF',
        flexDirection: 'column'
    }
});

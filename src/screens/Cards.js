import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
// import firebase from 'firebase';  // Initialize Firebase
import firebaseApp from '../config/FirebaseConfig';
import firebase from 'firebase';  // Initialize Firebase

import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';
import cardStyle from '../styles/card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// test data
const DATA = [
    {
        id: 1,
        uri: 'https://i.imgur.com/wO7pizCb.jpg',
        name: 'TURQUOISE',
        code: '#1abc9c'
    }, {
        id: 2,
        uri: 'https://i.imgur.com/AD3MbBi.jpg',
        name: 'EMERALD',
        code: '#2ecc71'
    },
    {
        id: 3,
        uri: 'https://i.imgur.com/mtbl1crb.jpg',
        name: 'PETER RIVER',
        code: '#3498db'
    }, {
        id: 4,
        uri: 'https://i.imgur.com/igt12tfb.jpg',
        name: 'AMETHYST',
        code: '#9b59b6'
    },
    {
        id: 5,
        uri: 'https://i.imgur.com/QxR8tQhb.jpg',
        name: 'WET ASPHALT',
        code: '#34495e'
    }, {
        id: 6,
        uri: 'https://i.imgur.com/WktFupPb.jpg',
        name: 'GREEN SEA',
        code: '#16a085'
    },
    {
        id: 7,
        uri: 'https://i.imgur.com/gM5yeySb.jpg',
        name: 'NEPHRITIS', code: '#27ae60'
    },
    {
        id: 8,
        uri: 'https://i.imgur.com/YrLxxk8b.jpg',
        name: 'BELIZE HOLE',
        code: '#2980b9'
    },

];
var likedCards = [], dislikedCards = [],
    cards = [
        {
            id: 6,
            uri: 'https://i.imgur.com/WktFupPb.jpg',
            name: 'GREEN SEA',
            code: '#16a085'
        },
        {
            id: 7,
            uri: 'https://i.imgur.com/gM5yeySb.jpg',
            name: 'NEPHRITIS', code: '#27ae60'
        }, {
            id: 8,
            uri: 'https://i.imgur.com/YrLxxk8b.jpg',
            name: 'BELIZE HOLE',
            code: '#2980b9'
        }];

var storageRef = firebaseApp.storage().ref('/images');

export default class Cards extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: cards,
            likedCards: [],
            dislikedCards: [],
        }
    }


    renderCard(card) {
        return (
            <Card
                key={card.id}
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 250,
                }}
                featuredTitle={`${card.name}`}
                featuredTitleStyle={{
                    position: 'absolute',
                    left: 15,
                    bottom: 15,
                    fontSize: 30,
                }}
                image={{uri: card.uri}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 252,
                }}
            />
        );
    }

    onSwipeRight(card) {
        console.log('Card liked: ' + card.name, 'Card is ', card);

        likedCards.push(card);
        console.log('likedCards ', likedCards)

    }

    onSwipeLeft(card) {
        console.log('Card disliked: ' + card.name, 'Card is ', card);
        dislikedCards.push(card);

    }

    gotoMyCards = () => {
        console.log('pass likedCards', likedCards)
        this.props.navigation.navigate('MyCardTab', {likedCards: likedCards, signin: true});
    }


    firebaseAsyncImage = (data, resolve, reject) => {

        var cardsSource;
        setTimeout(function () {
            var thisRef = storageRef.child(data.imageName + '.jpg');
            thisRef.getDownloadURL().then(function (url) {
                console.log('url!', url);

                cardsSource = {
                    id: Date.now().toString(36),
                    uri: url,
                    name: Date.now().toString(36),
                    code: '#2980b9'
                }
                resolve(cardsSource);
            });

            //
        }, 2000);
    }

    getAllAsyncImages = () => {

        // Create an array of promises
        var promises = [];
        var self = this;
        for (var i = 1; i < 5; i++) {
            // Fill the array with promises which initiate some async work
            promises.push(new Promise(function (resolve, reject) {
                self.firebaseAsyncImage({imageName: i}, resolve, reject);
            }));
        }

        // Return a Promise.all promise of the array
        return Promise.all(promises);
    }

    refreshImages = () => {
        AsyncStorage.getItem("cardsSource").then((value) => {
            if (value) {
                console.log('saved cards ', (value))
                this.setState({"cardsData": JSON.parse(value)});
            } else {
                AsyncStorage.setItem("cardsSource", cards);
            }

        }).done();
        // this.setState({cardsData: cards})
    }

    componentWillMount() {
        console.log('GrandChild will mount.');
        var self = this;
        var result = this.getAllAsyncImages().then(function (results) {
            console.log('All async calls completed successfully:');
            console.log(' --> ', (results));

            AsyncStorage.setItem('cardsSource', JSON.stringify(results))
                .then(self.setState({cardsData: results})
                );
        }, function (reason) {
            console.log('Some async call failed:');
            console.log(' --> ', reason);
        });
        // this.fetchFirebaseData();


    }

    componentDidMount() {
        var self = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('#########sign in -- Cards #########', user)
                self.setState({signin: true})
            } else {
                console.log('no user?')
                self.setState({signin: false})
            }
        });
    }


    renderNoMoreCards() {
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 250,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={{uri: 'https://i.imgflip.com/1j2oed.jpg'}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 252
                }}
            />
        );
    }

    renderHeader() {
        return ((this.state.signin) ?
            <View style={cardStyle.header}>

                <View style={cardStyle.headerCenter}>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="hand-o-right" type="font-awesome" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>1. Swipe your card</Text>
                    </View>
                    <View style={cardStyle.titleContainer}>
                        <Icon name="cart-plus" type="font-awesome" color={colors.primary1} size={20}/>
                        <Text style={cardStyle.title}>2. Add liked to My Cards</Text>
                    </View>

                </View>
                <View style={cardStyle.headerRightIcon}>
                    <Icon name="cart-plus" type="font-awesome" color={colors.primary1} size={35}
                          onPress={this.gotoMyCards}
                    />
                </View>


            </View> : null);

    }

    renderFooter() {
        return (
            <View style={cardStyle.footer}>
                <View style={[cardStyle.footerIcon, {paddingLeft: 10}]}>
                    <Icon
                        containerStyle={{
                            backgroundColor: 'white',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }}
                        name="replay"
                        size={30}
                        color="orange"
                        onPress={this.refreshImages}
                    />
                </View>


            </View>
        );
    }

    render() {

        return (
            <View style={cardStyle.cardsContainer}>

                {this.renderHeader()}
                <View style={cardStyle.deck}>
                    <SwipeDeck
                        data={this.state.cardsData}
                        renderCard={this.renderCard}
                        renderNoMoreCards={this.renderNoMoreCards}
                        onSwipeRight={this.onSwipeRight}
                        onSwipeLeft={this.onSwipeLeft}
                    />
                </View>
                {this.renderFooter()}
            </View>
        );
    }
}




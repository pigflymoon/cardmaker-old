import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
import {auth} from '../config/FirebaseConfig';
import {onceGetPaidImages, onceGetFreeImages} from '../config/db';
import SwipeDeck from '../components/SwipeDeck';
// import {fetchAllAsyncImages} from '../utils/FetchImagesByApi';
import Utils from '../utils/utils';

import colors from '../styles/colors';
import cardStyle from '../styles/card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var likedCards = [], dislikedCards = [], savedCards = [];


export default class Cards extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            likedCards: [],
            dislikedCards: [],
        }
        AsyncStorage.setItem("dataSource", "false");//test set user is paid user true
        AsyncStorage.setItem('cardsSource', '');

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
        likedCards.push(card);
        var savedCard = new Map(likedCards.map(obj => [obj.uri, obj]));
        // To get the unique objects
        savedCards = Array.from(savedCard.values());


    }

    onSwipeLeft(card) {
        console.log('Card disliked: ' + card.name, 'Card is ', card);
        dislikedCards.push(card);

    }

    gotoMyCards = () => {
        console.log('pass savedCards', savedCards)
        this.props.navigation.navigate('MyCardTab', {likedCards: savedCards, signin: true});
    }

    promiseAll = (promises) => {
        var results = [];
        var completedPromises = 0;
        return new Promise(function (resolve, reject) {
            promises.forEach(function (promise, index) {
                promise.then(function (value) {
                    results[index] = value;
                    completedPromises += 1;
                    if (completedPromises === promises.length) {
                        resolve(results);
                    }
                }).catch(function (error) {
                    reject(error);
                });
            });
        });
    }
    getFreeImages = () => {
        var self = this;
        onceGetFreeImages().then(snapshot => {
            console.log(' free snapshot', snapshot.val());
            var downloadImages = snapshot.val();
            var images = Object.keys(downloadImages).map(key => (
                    {
                        id: key,
                        uri: downloadImages[key].downloadUrl,
                        name: downloadImages[key].Name,
                        code: Utils.getRandomColor(),
                    }
                )
            )
            AsyncStorage.setItem('cardsSource', JSON.stringify(images))
                .then(self.setState({cardsData: images})
                );
            console.log('images,', images)

        });
    }
    getPaidImages = () => {
        var self = this;
        onceGetPaidImages().then(snapshot => {
            console.log('paid snapshot', snapshot.val());
            var downloadImages = snapshot.val();
            var images = Object.keys(downloadImages).map(key => (
                    {
                        id: key,
                        uri: downloadImages[key].downloadUrl,
                        name: downloadImages[key].Name,
                        code: Utils.getRandomColor(),
                    }
                )
            );
            //concat free images and paid images
            var cardsData = self.state.cardsData;
            console.log('free cardsData is :', cardsData)
            cardsData = cardsData.concat((images));
            console.log('concat cardsData is :', cardsData)
            //
            AsyncStorage.setItem('cardsSource', JSON.stringify(cardsData))
                .then(self.setState({cardsData: cardsData}));
        });
    }

    getImages = () => {
        //
        this.getFreeImages();
        AsyncStorage.getItem("dataSource").then((value) => {
            if (value == 'true') {//
                //paid user
                // AsyncStorage.getItem("dataSource").then((value) => {
                console.log('***********dataSource**********', value, 'value == true?', value == 'true')
                this.getPaidImages();
            }
        }).done();
    }


    refreshImages = () => {
        this.setState({cardsData: []});
        var self = this;

        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('#########REFRESh sign in -- Cards #########', user)
                self.setState({signin: true});
                self.getImages();

            } else {
                console.log('no user?')
                self.setState({signin: false})
            }
        });

        // this.setState({cardsData: cards})
    }

    componentDidMount() {
        var self = this;


        //
        auth.onAuthStateChanged(function (user) {
            if (user) {
                console.log('#########sign in -- Cards #########', user)
                self.setState({signin: true});
                self.getImages();
                // AsyncStorage.getItem("dataSource").then((value) => {
                //
                // }).done();

            } else {
                console.log('no user?')
                self.setState({signin: false})
            }
        });

        //


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
                        onPress={(e) => this.refreshImages(e)}
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




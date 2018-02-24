import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
import {auth, db} from '../config/FirebaseConfig';
import {onceGetPaidImages, onceGetFreeImages} from '../config/db';
import SwipeDeck from '../components/SwipeDeck';

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
        AsyncStorage.setItem("dataSource", "true");//test set user is paid user true
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

    getImages = (userrole) => {
        //
        console.log('userrole is ', userrole.paid_user);
        if (!userrole.paid_user) {
            this.getFreeImages();
        } else {
            this.getFreeImages();
            this.getPaidImages();
        }
    }


    refreshImages = () => {
        this.setState({cardsData: []});
        var self = this;
        this.getUserImages();
    }

    getUserImages = () => {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                console.log('current userid,', userId);
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    console.log('username is: ', username, 'role is: ', userrole)
                    self.setState({signin: true, authUser, userrole: userrole});
                    self.getImages(userrole);
                    // ...
                });
                console.log('#########sign in -- Cards #########', authUser)

            } else {
                console.log('no user?')
                self.setState({signin: false, cardsData: []})
            }
        });
    }

    componentDidMount() {
        this.getUserImages();
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




import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
import {auth, db} from '../config/FirebaseConfig';
import {onceGetPaidImages, onceGetFreeImages} from '../config/db';
import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';
import cardStyle from '../styles/card';
import refreshMore from '../assets/images/refreshMore.jpg';

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
        // AsyncStorage.setItem('cardsSource', '');
    }

    renderCard(card) {
        console.log('card', card, 'this.state,', this.state)
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
        dislikedCards.push(card);
    }

    gotoMyCards = () => {
        console.log('savedCards in Cards', savedCards)
        this.props.navigation.navigate('MyCardTab', {likedCards: savedCards, signin: true});
    }

    getFreeImages = () => {


        var self = this;
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value

                onceGetFreeImages().then(snapshot => {
                    var downloadImages = snapshot.val();
                    if (downloadImages) {
                        var images = Object.keys(downloadImages).map(key => (
                                {
                                    id: key,
                                    uri: downloadImages[key].downloadUrl,
                                    name: downloadImages[key].Name,
                                }
                            )
                        )
                        resolve(images)
                    }

                });


            }, 500);
        });


    }
    getPaidImages = (freeImages) => {
        var self = this;
        onceGetPaidImages().then(snapshot => {
            var downloadImages = snapshot.val();
            if (downloadImages) {
                var images = Object.keys(downloadImages).map(key => (
                        {
                            id: key,
                            uri: downloadImages[key].downloadUrl,
                            name: downloadImages[key].Name,

                        }
                    )
                );
                //concat free images and paid images
                var cardsData = freeImages;//self.state.cardsData;
                cardsData = cardsData.concat((images));
                //
                self.setState({cardsData: cardsData});
            }

        });
    }

    getImages = (userrole) => {
        var self = this;
        console.log('userrole.paid_user', userrole.paid_user)
        if (!userrole.paid_user) {
            console.log('called???')
            this.getFreeImages();
        } else {
            this.getFreeImages().then(function (val) {
                console.log('val is,', val)
                self.getPaidImages(val);
            })

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
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    self.setState({signin: true, authUser, userrole: userrole});
                    self.getImages(userrole);
                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });
    }

    componentDidMount() {
        this.setState({cardsData: []});

        this.getUserImages();
    }

    componentWillUnmount() {

        this.setState({cardsData: []});


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
                image={refreshMore}
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
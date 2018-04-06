import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, Platform,} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
import {auth, db} from '../config/FirebaseConfig';
// import {onceGetPaidImages, onceGetFreeImages} from '../config/db';
import {getFreeImages, getPaidImages} from '../utils/firebaseImages';
import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';
import cardStyle from '../styles/card';
import refreshMore from '../assets/images/refreshMore.jpg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var likedCards = [], dislikedCards = [], savedCards = [];

export default class BoardDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            likedCards: [],
            dislikedCards: [],
        }
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


    getImages = (userrole) => {
        var self = this;
        if (!userrole.paid_user) {
            console.log('called???')
            getFreeImages().then(function (images) {
                self.setState({cardsData: images});
            });
        } else {
            getPaidImages().then(function (val) {
                console.log('val is,', val)
                //concat free images and paid images
                var cardsData = val;//self.state.cardsData;
                // cardsData = cardsData.concat((images));
                //

                getFreeImages().then(function (images) {
                    var freeImages = images;
                    cardsData = cardsData.concat((freeImages));
                    self.setState({cardsData: cardsData});
                });
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
                    self.getImages(userrole);
                    self.setState({signin: true, authUser, userrole: userrole});

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });
    }

    componentDidMount() {
        this.getUserImages();
    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }

    renderCard(card) {
        return (
            <Card
                key={card.id}
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 250,
                    ...Platform.select({
                        ios: {
                            borderWidth: 1,
                            borderRadius: 2,
                            borderColor: colors.grey5,
                            borderBottomWidth: 0,
                            shadowColor: 'rgba(0,0,0, .1)',
                            shadowOffset: {width: 0, height: 2},
                            shadowOpacity: 0.8,
                            shadowRadius: 2,
                            marginTop: 10,
                        },
                        android: {
                            elevation: 1,
                        },
                    }),
                }}
                title={`${card.name}`}
                image={{uri: card.uri}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 300,
                }}>

            </Card>

        );
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
                    height: SCREEN_HEIGHT - 252,
                }}
            />
        );
    }

    renderHeader() {
        return (
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


            </View>
        );

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
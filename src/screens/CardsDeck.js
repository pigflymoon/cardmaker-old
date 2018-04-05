import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, TouchableOpacity} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getAllImages,
    getFreeImages,
} from '../utils/FetchImagesByApi';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';
import navigationStyle from '../styles/navigation';

import refreshMore from '../assets/images/refreshMore.jpg';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var likedCards = [], dislikedCards = [], savedCards = [];

export default class CardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            // likedCards: [],
            // dislikedCards: [],
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
                featuredTitle={`${card.title}`}
                featuredTitleStyle={{
                    position: 'absolute',
                    left: 15,
                    bottom: 15,
                    fontSize: 30,
                }}
                image={{uri: card.illustration}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 252,
                }}
            />
        );
    }

    onSwipeRight = (card) => {

        likedCards.push(card);
        var savedCard = new Map(likedCards.map(obj => [obj.illustration, obj]));
        // To get the unique objects
        savedCards = Array.from(savedCard.values());
        console.log('likedCards :', likedCards, 'savedCards ', savedCards)
        console.log('onSavedCards props ', this.props)
        this.props.onSavedCards(savedCards);

    }

    onSwipeLeft = (card) => {
        dislikedCards.push(card);
    }

    gotoMyCards = () => {
        console.log('savedCards in Cards', savedCards)
        // this.props.navigation.navigate('MyCardTab', {likedCards: savedCards, signin: true});
    }


    refreshImages = () => {
        // const {cardType, userrole, signin} = this.props.navigation.state.params;
        //
        // this.setState({cardsData: []});
        // this.getUserImages(cardType, userrole);
    }

    getUserImages = (cardType = 'birthdayImages', isPaidUser) => {
        console.log('cardType ', cardType, '************isPaidUser ', isPaidUser)
        var self = this;
        if (!isPaidUser) {
            getFreeImages(cardType).then(function (images) {
                console.log('images are**********', images)
                self.setState({cardsData: images});
            });
        } else {
            getAllImages(cardType).then(function (images) {
                console.log('images are**********', images)
                self.setState({cardsData: images});
            });

        }


    }

    componentDidMount() {
        const {cardType, isPaidUser} = this.props;
        console.log('this.props is', this.props)

        console.log('card type is ', cardType, 'isPaidUser ', isPaidUser)
        // var cardType = this.props.cardType;

        this.getUserImages(cardType, isPaidUser);
    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps is', nextProps)
        const {cardType, isPaidUser} = nextProps;
        console.log('nextProps card type is ', cardType, 'isPaidUser ', isPaidUser)
        // var cardType = this.props.cardType;

        this.getUserImages(cardType, isPaidUser);
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

        // if (this.props.screenProps.currentScreen !== 'CardsDeck') {
        //     return <View/>
        // }

        return (
            <View style={layoutStyle.container}>
                {/*{this.renderHeader()}*/}
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


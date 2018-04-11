import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, TouchableOpacity} from 'react-native';

import {Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getAllImages,
    getFreeImages,
} from '../utils/FetchImagesByApi';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';

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
    }


    refreshImages = () => {
        this.setState({cardsData: []});
        const {cardType, isPaidUser} = this.props;
        console.log('this.props is', this.props)
        console.log('card type is ', cardType, 'isPaidUser ', isPaidUser)
        // var cardType = this.props.cardType;

        this.getUserImages(cardType, isPaidUser);
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
        this.getUserImages(cardType, isPaidUser);
    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextProps is', nextProps)
        if (nextProps.cardType != this.props.cardType) {
            console.log('card type is different')
            likedCards = [];//cardtype is different ,clean the likedcards
        }
        const {cardType, isPaidUser} = nextProps;

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
                        color={colors.primary3}
                        onPress={(e) => this.refreshImages(e)}
                    />
                </View>


            </View>
        );
    }

    render() {
        return (
            <View style={layoutStyle.container}>
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


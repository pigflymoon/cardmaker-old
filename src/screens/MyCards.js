import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions,Alert} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';
import cardStyle from '../styles/card';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// test data
const DATA = [
    {
        id: 6,
        text: 'Scarlett',
        age: 25,
        uri: 'https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg',
    },
    {id: 1, text: 'Emma', age: 29, uri: 'https://i.imgur.com/FHxVpN4.jpg'},
    {
        id: 2,
        text: 'Jennifer',
        age: 24,
        uri: 'https://2.bp.blogspot.com/-Vy0NVWhQfKo/Ubma2Mx2YTI/AAAAAAAAH3s/LC_u8LRfm8o/s1600/aimee-teegarden-04.jpg',
    },
    {
        id: 3,
        text: 'Sarah',
        age: 28,
        uri: 'https://s-media-cache-ak0.pinimg.com/736x/41/75/26/4175268906d97492e4a3175eab95c0f5.jpg',
    },
];
var chooseCards = [],makeCards = [];

export default class MyCards extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showSignCard: false,
            cardsData: chooseCards,
            makeCards: [],



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
                featuredTitle={`${card.text}, ${card.age}`}
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
        console.log('Card liked: ' + card.text, 'Card is ', card);

        makeCards.push(card);
        console.log('chooseCards ', makeCards)
        // this.setState({likedCards: likedCards});

    }

    onSwipeLeft(card) {
        console.log('Card disliked: ' + card.text, 'Card is ', card);
        // this.setState({color: 'green'});

    }

    gotoMakeCards = () => {
        if(this.state.chooseCards.length >0){
            this.props.navigation.navigate('MakeCardsTab', {chooseCards: makeCards});

        }else{
            Alert.alert('Please choose a picture');
        }

    }


    componentDidMount() {
        console.log('*************Swipe card this.props*********', this.props)
        //

    }
    componentWillReceiveProps(nextProps) {
        chooseCards = nextProps.navigation.state.params.likedCards;
        console.log('pass liked cards',chooseCards)
        this.setState({chooseCards: chooseCards});
    }


    renderNoMoreCards() {
        // this.setState({likedCards: likedCards});
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 252,
                }}
                featuredTitle="No more cards,please choose cards in library"
                featuredTitleStyle={{fontSize: 25}}
                image={{uri: 'https://i.imgflip.com/1j2oed.jpg'}}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 250,
                }}
            />
        );
    }

    renderHeader() {
        return (
            <View style={cardStyle.header}>
                {this.state.showSignCard ?
                    <View style={cardStyle.headerLeftIcon}>
                        <Icon name="user" type="font-awesome" color="#ccc" size={35}/>
                    </View> : null}
                <View style={cardStyle.headerCenter}>
                    <Text>Make My Cards</Text>
                </View>
                <View style={cardStyle.headerRightIcon}>
                    <Icon name="card-giftcard" color={colors.primary1} size={35}
                          onPress={this.gotoMakeCards}
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
                        data={chooseCards}
                        renderCard={this.renderCard}
                        renderNoMoreCards={this.renderNoMoreCards}
                        onSwipeRight={this.onSwipeRight}
                        onSwipeLeft={this.onSwipeLeft}
                    />
                </View>
            </View>
        );
    }
}





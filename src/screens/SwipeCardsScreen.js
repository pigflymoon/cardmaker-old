import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';
// import {Navigation} from 'react-native-navigation';

import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// test data
const DATA = [
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
var likedCards = [];

export default class SwipeCardsScreen extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSignCard: false,
            cardsData: DATA,
            likedCards: [],
            color: 'green',

        }
    }

    renderCard(card) {
        return (
            <Card
                key={card.id}
                containerStyle={{
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 165,
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
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 165,
                }}
            />
        );
    }

    onSwipeRight(card) {
        console.log('Card liked: ' + card.text, 'Card is ', card);

        likedCards.push(card);
        console.log('likedCards ', likedCards)
        // this.setState({likedCards: likedCards});

    }

    onSwipeLeft(card) {
        console.log('Card disliked: ' + card.text, 'Card is ', card);
        // this.setState({color: 'green'});

    }

    gotoMakeCards = () => {
        this.props.navigator.push({
            screen: 'cardmaker.MakeCards',
            title: 'Make Cards',
            passProps: {
                likedCards: likedCards
            },

        });
    }

    componentWillMount() {
        navigator = this.props.navigator;
        console.log('********navigator********', navigator)
    }

    componentDidMount() {
        console.log('*************Swipe card this.props*********', this.props)
        //

        if (this.props.cards && this.props.cards.length > 0) {
            var newCards = JSON.parse(this.props.cards);
            // newCards = newCards;
            var cards = this.state.cardsData;
            cards = cards.concat(newCards);
            console.log('newCards ', newCards)

            console.log('cards ', cards)

            this.setState({showSignCard: this.props.signin, cardsData: cards}) //cardsData: this.state.cardsData.push((this.props.cards)[0])

        }

    }


    renderNoMoreCards() {
        // this.setState({likedCards: likedCards});
        return (
            <Card
                containerStyle={{
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 165,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={{uri: 'https://i.imgflip.com/1j2oed.jpg'}}
                imageStyle={{
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 165,
                }}
            />
        );
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                {this.state.showSignCard ?
                    <View style={styles.headerLeftIcon}>
                        <Icon name="user" type="font-awesome" color="#ccc" size={35}/>
                    </View> : null}
                <View style={styles.headerCenter}>
                    <View style={styles.headerCenterToggleContainer}>
                        <View style={styles.headerCenterToggleLeft}>
                            <Icon
                                name="bookmark"
                                color="#fff"
                                size={28}
                            />
                        </View>

                    </View>
                </View>
                <View style={styles.headerRightIcon}>
                    <Icon name="card-giftcard" color={colors.primary1} size={35}
                          onPress={this.gotoMakeCards}
                    />
                </View>
            </View>
        );
    }

    renderFooter() {
        return (
            <View style={styles.footer}>
                <View style={styles.footerIcon}>
                    <Icon
                        containerStyle={{
                            backgroundColor: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                        }}
                        name="close"
                        size={45}
                        color="red"
                    />
                </View>

                <View style={styles.footerIcon}>
                    <Icon
                        containerStyle={{
                            backgroundColor: 'white',
                            width: 60,
                            height: 60,
                            borderRadius: 30,
                        }}
                        name="favorite"
                        size={35}
                        color={this.state.color}

                    />
                </View>

            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.deck}>
                    <SwipeDeck
                        data={this.state.cardsData}
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

// SwipeDeck.navigationOptions = {
//     title: 'Swipe Decker',
//     header: null,
// };

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    header: {
        height: 64,
        paddingTop: 35,
        flexDirection: 'row',
    },
    headerLeftIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 15,
    },
    headerCenter: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerCenterToggleContainer: {
        flexDirection: 'row',
        width: 160,
        height: 45,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    headerCenterToggleLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        borderRadius: 30,
    },
    headerCenterToggleRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    deck: {
        flex: 1,
    },
    footer: {
        height: 64,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    footerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 10,
    },
});



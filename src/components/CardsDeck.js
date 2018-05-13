import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity} from 'react-native';

import {Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getAllImages,
    getFreeImages,
} from '../utils/FetchImagesByApi';
import {auth, db} from '../config/FirebaseConfig';

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
        this.props.onSavedCards(savedCards);

    }

    onSwipeLeft = (card) => {
        dislikedCards.push(card);
    }

    refreshImages = () => {
        this.setState({cardsData: []});
        const {cardType, isPaidUser} = this.props;
        //
        var self = this;
        var userId = auth.currentUser.uid;
        db.ref('/users/' + userId).once('value').then(function (snapshot) {
            var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
            var isPaidUser = userrole.paid_user;
            self.props.onRefreshUser(isPaidUser);
            self.setState({isPaidUser: isPaidUser}, () => {
                self.getUserImages(cardType, isPaidUser);
            });


        });

        //

    }

    getUserImages = (cardType = 'birthdayImages', isPaidUser) => {
        var self = this;
        if (!isPaidUser) {
            getFreeImages(cardType).then(function (images) {
                self.setState({cardsData: images});
            });
        } else {
            getAllImages(cardType).then(function (images) {
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
        if (nextProps.cardType != this.props.cardType) {
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


import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity} from 'react-native';

import {Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getFreeImagesByImageType,
    getAllImagesByImageType,
    getFreeUserImagesCount,
} from '../utils/FetchImagesByApi';
import {auth, db} from '../config/FirebaseConfig';
import {saveFavoriteCard} from '../config/db';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';

import bg1 from '../assets/images/bg.jpg';
import refreshMore from '../assets/images/refreshMore.jpg';

const SCREEN_WIDTH = Dimensions.get('window').width;

var likedCards = [], dislikedCards = [], savedCards = [], favoriteCardCount = 10, favoriteCardNumber = 0;

export default class CardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            imagesData: [],
            iconColor: colors.primary1,
        }
    }

    renderCard(card) {
        return (
            <Card
                key={card.id}
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: 350,
                    flex: 1,
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
                    height: 350,

                }}
            />
        );
    }

    handleSwipeRight = (card) => {
        this.setState({iconColor: colors.primary1})
        likedCards.push(card);
        var savedCard = new Map(likedCards.map(obj => [obj.illustration, obj]));
        // To get the unique objects
        savedCards = Array.from(savedCard.values());
        this.props.onSavedCards(savedCards);

    }

    onSwipeLeft = (card) => {
        this.setState({iconColor: colors.primary1})
        dislikedCards.push(card);
    }

    saveToFavorite = () => {
        let currentCard = this.swiper.onCurrentCard();
        if (currentCard) {
            this.setState({iconColor: colors.secondary2})
            favoriteCardNumber = favoriteCardNumber + 1;
            var cardUrl = currentCard.illustration;

            if (auth.currentUser != null && favoriteCardNumber <= favoriteCardCount) {

                var userId = auth.currentUser.uid,
                    name = auth.currentUser.displayName;
                db.ref(`favorite/${userId}`).once("value")
                    .then(function (snapshot) {
                        var savedCount = snapshot.numChildren(); // 1 ("name")
                        if (savedCount <= 10) {
                            saveFavoriteCard(userId, name, currentCard.id, currentCard.illustration, currentCard.title)
                                .then((data) => {
                                    if (data) {
                                        console.log('Saved successfully!')
                                    } else {
                                        console.log('Already exists!')
                                    }

                                })
                                .catch(error => {
                                    Alert.alert(
                                        'Oops!',
                                        `${error}`,
                                        [
                                            {text: 'OK'},
                                        ],
                                        {cancelable: false}
                                    );

                                });
                        } else {
                            Alert.alert(
                                'Oops!',
                                `You have reached 10 favorite card in total!`,
                                [
                                    {text: 'OK'},
                                ],
                                {cancelable: false}
                            );
                        }
                    });

            }


        }

    }

    refreshImages = () => {
        const {imageType, isPaidUser} = this.props;
        //
        var self = this;
        var userId = auth.currentUser.uid;
        db.ref('/users/' + userId).once('value').then(function (snapshot) {
            var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
            var isPaidUser = userrole.paid_user;
            self.props.onRefreshUser(isPaidUser);
            self.setState({isPaidUser: isPaidUser}, () => {
                self.fetchData(imageType, isPaidUser).then(function (images) {
                    self.setState({
                        imagesData: images
                    });
                });
            });
        });
    }


    fetchData = (imageType, isPaidUser) => {
        var self = this;
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value
                if (!isPaidUser) {
                    getFreeImagesByImageType(imageType, self.state.freeUserImageCount).then(function (images) {
                        resolve(images)
                    });

                } else {
                    getAllImagesByImageType(imageType).then(function (images) {
                        resolve(images)

                    });
                }


            }, 500);
        });
    }

    componentDidMount() {
        var self = this;
        const {imageType, isPaidUser} = this.props;
        if (isPaidUser) {
            this.fetchData(imageType, isPaidUser).then(function (images) {
                self.setState({
                    imagesData: images
                });
            });
        } else {
            getFreeUserImagesCount().then(count => {
                self.setState({freeUserImageCount: count}, () => {
                    self.fetchData(imageType, isPaidUser).then(function (images) {
                        self.setState({
                            imagesData: images
                        });
                    });
                });
            });
        }


    }

    componentWillReceiveProps(nextProps) {
        var self = this;
        const {imageType, isPaidUser} = nextProps;
        if (imageType != this.props.imageType) {
            this.setState({iconColor: colors.primary1}, function () {

                likedCards = [];//cardtype is different ,clean the likedcards
                self.fetchData(imageType, isPaidUser).then(function (images) {
                    self.setState({
                        imagesData: images
                    });
                })
            })
        }

    }

    componentWillUnmount() {
        this.setState({imagesData: []});
    }

    renderNoCards = () => {
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: 350,
                }}
                featuredTitle="Meow. Coming soon!"
                featuredTitleStyle={{fontSize: 25}}
                image={bg1}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: 350
                }}
            />

        );
    }

    renderNoMoreCards() {
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: 350,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={refreshMore}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: 350
                }}
            />
        );
    }

    renderFooter() {
        return (
            <View style={cardStyle.footer}>
                <View style={cardStyle.footerIcon}>
                    <Icon
                        containerStyle={cardStyle.footerIconContainer}
                        name="replay"
                        size={30}
                        color={colors.primary3}
                        onPress={(e) => this.refreshImages(e)}
                    />
                </View>
                <View style={cardStyle.footerIcon}>
                    <Icon
                        containerStyle={cardStyle.footerIconContainer}
                        name='close'
                        size={30}
                        color={colors.primary3}
                        onPress={() => {
                            this.swiper.forceSwipe('left');
                        }}
                    />
                </View>
                <View style={cardStyle.footerIcon}>
                    <Icon
                        containerStyle={cardStyle.footerIconContainer}
                        name='check'
                        size={30}
                        color={colors.primary3}
                        onPress={() => {
                            this.swiper.forceSwipe('right');
                        }}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={[layoutStyle.container, {
                flexGrow: 2,
                flexDirection: 'column',
                marginBottom: 10,

            }]}>
                <View style={cardStyle.deck}>
                    <SwipeDeck
                        ref={swiper => {
                            this.swiper = swiper
                        }}
                        data={this.state.imagesData}
                        renderCard={this.renderCard}
                        renderNoCards={this.renderNoCards}
                        renderNoMoreCards={this.renderNoMoreCards}
                        onSwipeRight={this.handleSwipeRight}
                        onSwipeLeft={this.onSwipeLeft}
                    />
                </View>
                {this.renderFooter()}
            </View>
        );
    }
}


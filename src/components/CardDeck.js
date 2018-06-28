import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity,} from 'react-native';

import {Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getFreeImagesByImageType,
    getAllImagesByImageType
} from '../utils/FetchImagesByApi';
import {auth, db} from '../config/FirebaseConfig';
import {saveFavoriteCard} from '../config/db';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';

import refreshMore from '../assets/images/refreshMore.jpg';
import CategoryConfig from '../config/CategoryConfig';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var likedCards = [], dislikedCards = [], savedCards = [], favoriteCardCount = 10, favoriteCardNumber = 0;

export default class CardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
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
                    height: SCREEN_HEIGHT - 450,
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
                    height: SCREEN_HEIGHT - 452,
                }}
            />
        );
    }

    handleSwipeRight = (card) => {
        console.log('called')
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
            console.log('favorite is ', currentCard)
            favoriteCardNumber = favoriteCardNumber + 1;
            var cardUrl = currentCard.illustration;


            if (auth.currentUser != null && favoriteCardNumber <= favoriteCardCount) {

                var userId = auth.currentUser.uid,
                    name = auth.currentUser.displayName;
                console.log('userid,', userId, 'name is ', auth.currentUser, 'email is ', auth.currentUser.email)
                db.ref(`favorite/${userId}`).once("value")
                    .then(function (snapshot) {
                        var savedCount = snapshot.numChildren(); // 1 ("name")
                        if (savedCount <= 10) {
                            saveFavoriteCard(userId, name, currentCard.id, currentCard.illustration, currentCard.title)
                                .then((data) => {
                                    if (data) {
                                        console.log('data is ########', data)
                                        console.log('Saved successfully!')
                                    } else {
                                        console.log('Already exists!')
                                    }

                                })
                                .catch(error => {
                                    console.log('Error', error)
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
        this.setState({cardsData: []});
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
        console.log('fetchUpdatedImages called', imageType)
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value
                if (!isPaidUser) {
                    getFreeImagesByImageType(imageType, CategoryConfig.showFreeImagesNumber).then(function (images) {
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
        const {imageType, cardType, isPaidUser} = this.props;
        // this.getUserImages(cardType, isPaidUser);
        this.fetchData(imageType, isPaidUser).then(function (images) {
            console.log('####card deck images are', images)
            self.setState({
                imagesData: images
            });
        })

    }


    componentWillReceiveProps(nextProps) {
        var self = this;
        const {imageType, cardType, isPaidUser} = nextProps;
        if (imageType != this.props.imageType) {
            this.setState({iconColor: colors.primary1}, function () {

                likedCards = [];//cardtype is different ,clean the likedcards
                console.log('imageType is ', imageType)

                self.fetchData(imageType, isPaidUser).then(function (images) {
                    console.log('######next props images are', images)
                    self.setState({
                        imagesData: images
                    });
                })
                // }

            })
        }

    }

    componentWillUnmount() {
        this.setState({cardsData: [], imagesData: []});
    }


    renderNoMoreCards() {
        return (
            <Card
                containerStyle={{
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 420,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={refreshMore}
                imageStyle={{
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 422
                }}
            />
        );
    }

    renderFooter() {
        return (
            <View style={cardStyle.footer}>
                <View style={cardStyle.footerIcon}>

                    <Icon
                        containerStyle={{
                            backgroundColor: 'rgba(255, 255, 255, .8)',
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
                <View style={cardStyle.footerIcon}>

                    <Icon
                        containerStyle={{
                            backgroundColor: 'rgba(255, 255, 255, .8)',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }}
                        name='close'
                        size={30}
                        color={colors.primary3}
                        onPress={() => {
                            console.log('swipe left?', this.swiper)
                            this.swiper.forceSwipe('left');
                        }}
                    />
                </View>
                <View style={cardStyle.footerIcon}>

                    <Icon
                        containerStyle={{
                            backgroundColor: 'rgba(255, 255, 255, .8)',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                        }}
                        name='check'
                        size={30}
                        color={colors.primary3}
                        onPress={() => {
                            console.log('swipe right?', this.swiper)
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


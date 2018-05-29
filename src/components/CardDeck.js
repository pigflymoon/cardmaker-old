import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, TouchableOpacity} from 'react-native';

import {Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getFreeImagesByImageType,
    getAllImagesByImageType
} from '../utils/FetchImagesByApi';
import {auth, db} from '../config/FirebaseConfig';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';

import refreshMore from '../assets/images/refreshMore.jpg';
import CategoryConfig from '../config/CategoryConfig';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

var likedCards = [], dislikedCards = [], savedCards = [];

export default class CardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            imagesData: [],
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

        //

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
            console.log('images are', images)
            self.setState({
                imagesData: images
            });
        })

    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }

    componentWillReceiveProps(nextProps) {
        var self = this;

        if (nextProps.imageType != this.props.imageType) {
            likedCards = [];//cardtype is different ,clean the likedcards
        }
        const {imageType, cardType, isPaidUser} = nextProps;

        // this.getUserImages(cardType, isPaidUser);
        this.fetchData(imageType, isPaidUser).then(function (images) {
            console.log('images are', images)
            self.setState({
                imagesData: images
            });
        })
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
            <View style={[layoutStyle.container, {
                flexGrow: 2,
                flexDirection: 'column',
                marginBottom: 10,
            }]}>
                <View style={cardStyle.deck}>
                    <SwipeDeck
                        data={this.state.imagesData}
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


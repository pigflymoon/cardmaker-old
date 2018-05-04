import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import {Card,} from 'react-native-elements';

import {db} from '../../config/FirebaseConfig';

import layoutStyle from '../../styles/layout';
import exploreStyle from '../../styles/explore';

let paidReferenceToOldestKey = '', lastPaidKey = '';


export default class CardsGallery extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            loading: true,
            cardsData: [],
            lodingFinished: false,
            paidCards: [],
        }
    }

    getPaidImages = (cardType = 'birthdayImages') => {
        if (!paidReferenceToOldestKey) {
            return db.ref(cardType)
                .orderByKey()
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                    // changing to reverse chronological order (latest first)
                    let arrayOfKeys = Object.keys(snapshot.val())
                        .sort()
                        .reverse();
                    // transforming to array
                    let results = arrayOfKeys
                        .map((key) => {
                            return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                        });
                    // storing reference

                    paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);

                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                })

        } else {
            return db.ref(cardType)
                .orderByKey()
                .endAt(paidReferenceToOldestKey)
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                    // changing to reverse chronological order (latest first)
                    // & removing duplicate
                    let arrayOfKeys = Object.keys(snapshot.val())
                        .sort()
                        .reverse()
                        .slice(1);
                    // transforming to array
                    let results = arrayOfKeys
                        .map((key) => {
                            return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                        });
                    // updating reference

                    paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);
                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                });
            // }


        }
        // }


    }
    fetchData = async(cardType) => {
        var self = this;
        var paidPages = await (new Promise(function (resolve, reject) {
            setTimeout(() => {
                self.getPaidImages(cardType).then(function (paidPages) {
                    var newPaidArr = [];
                    var images = self.state.paidCards;
                    if (paidPages.length > 0) {
                        var arrToConvert = paidPages;
                        lastPaidKey = paidPages[paidPages.length - 1].id;
                        if (lastPaidKey == self.state.lastPaidKey) {
                            resolve(images)
                        } else {
                            for (var i = 0; i < arrToConvert.length; i++) {
                                newPaidArr = newPaidArr.concat(paidPages[i]);
                            }

                            images = [...images, ...newPaidArr]
                            self.setState({lastPaidKey: lastPaidKey})
                            resolve(images);
                        }
                    } else {
                        self.setState({lodingFinished: true})
                        resolve(images)
                    }


                }), 2000
            });
        }));
        return paidPages;
    }
    handleScrollToEnd = (cardType) => {
        var self = this;
        if (this.state.lodingFinished) {
            return false
        } else {
            this.fetchData(cardType).then(function (pages) {
                var images = self.state.cardsData;
                images = [...images, ...pages]
                self.setState({cardsData: images, loading: false})

            })
        }
    };

    componentWillMount() {
        const {cardType} = this.props.navigation.state.params;
        var self = this;

        this.fetchData(cardType).then(function (pages) {
            self.setState({cardsData: pages, loading: false})
        })

    }

    componentWillUnmount() {
        paidReferenceToOldestKey = '';
        this.setState({cardsData: []});
    }

    render() {
        const {cardType} = this.props.navigation.state.params;
        return (
            <View style={layoutStyle.container}>
                <FlatList
                    data={this.state.cardsData}
                    keyExtractor={(item, index) => `${index}-image`}
                    onEndReached={() => this.handleScrollToEnd(cardType)}
                    onEndReachedThreshold={0}
                    shouldItemUpdate={(props, nextProps) => {
                        return props.item !== nextProps.item

                    }  }
                    ListFooterComponent={() =>
                        this.state.loading
                            ? <ActivityIndicator size="large" animating/>
                            : null}
                    renderItem={({item}) =>
                        <Card
                            key={`${item.id}`}
                            image={{uri: item.uri}}
                            featuredTitle={item.name}
                            imageStyle={exploreStyle.cardImage}
                            containerStyle={exploreStyle.cardContainer}
                        />

                    }

                />
            </View>
        );
    }
}


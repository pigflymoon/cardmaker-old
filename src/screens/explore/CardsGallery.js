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

let freeReferenceToOldestKey = '', paidReferenceToOldestKey = '', lastPaidKey = '', lastFreeKey = '';

export default class CardsGallery extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            loading: false,
            cardsData: [],
            lodingFinished: false,
            freeCards: [],
            paidCards: [],
        }
    }

    getPaidImages = (cardType = 'birthdayImages') => {
        console.log('cardType is', cardType)
        // this.setState({loading: true});
        if (!paidReferenceToOldestKey) {
            console.log('key is ~~~~~~~~~~~~~')
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
                    console.log('arrayOfKeys ', arrayOfKeys)
                    let results = arrayOfKeys
                        .map((key) => {
                            console.log(' snapshot.val()[key]', snapshot.val()[key].name)
                            return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                        });
                    console.log('Paid result is ', results)
                    // storing reference

                    // self.setState({cardsData: results})

                    paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);

                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                })

        } else {
            console.log('paidReferenceToOldestKey is ', paidReferenceToOldestKey)
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].name)
                            return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                        });
                    // updating reference
                    console.log('paid result is ', results)

                    // self.setState({cardsData:results})


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

    }
    fetchData = async(cardType) => {
        console.log('fetchData cardType is', cardType)

        var self = this;
        var paidPages = await (new Promise(function (resolve, reject) {
            setTimeout(() => {
                self.getPaidImages(cardType).then(function (paidPages) {
                    console.log('paidPages ', paidPages)
                    var newPaidArr = [];
                    var images = self.state.freeCards;
                    if (paidPages.length > 0) {
                        var arrToConvert = paidPages;
                        lastPaidKey = paidPages[paidPages.length - 1].id;
                        console.log('#######last key is ', lastPaidKey)

                        console.log('#######saved last lastPaidKey is ', self.state.lastPaidKey)
                        console.log('arrToConvert ', arrToConvert)
                        if (lastPaidKey == self.state.lastPaidKey) {
                            console.log(' key same')
                            // return false;
                            resolve(images)
                        } else {
                            for (var i = 0; i < arrToConvert.length; i++) {
                                newPaidArr = newPaidArr.concat(paidPages[i]);
                            }
                            console.log('######### state image  are :', images)

                            images = [...images, ...newPaidArr]
                            self.setState({lastPaidKey: lastPaidKey})

                            console.log('######### paid pages are :', images)
                            resolve(images)
                            // return images
                        }
                    } else {
                        self.setState({lodingFinished: true})
                        resolve(images)
                        // return false;
                    }


                }), 2000
            });
        }));
        return paidPages


    }
    handleScrollToEnd = (cardType) => {
        console.log('scroll loading is ', this.state.loading)
        var self = this;
        if (this.state.lodingFinished) {
            return false
        } else {

            this.fetchData(cardType).then(function (pages) {
                console.log('data are ', pages)
                console.log('******* data return is********* ', pages)
                var images = self.state.cardsData;
                images = [...images, ...pages]
                console.log('******* total images is********* ', images)

                self.setState({cardsData: images, loading: false})


            })
        }
    };

    componentDidMount() {
        const {cardType} = this.props.navigation.state.params;
        console.log('cardType are ', cardType)
        var self = this;
        this.fetchData(cardType).then(function (pages) {
            console.log('data are ', pages)
            console.log('******* data return is********* ', pages)
            self.setState({cardsData: pages, loading: false})


        })

    }

    render() {
        const {cardType} = this.props.navigation.state.params;
        return (
            <View style={layoutStyle.container}>
                <FlatList
                    data={this.state.cardsData}
                    keyExtractor={this.keyExtractor}
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
                            imageStyle={layoutStyle.cardImage}
                            containerStyle={layoutStyle.cardContainer}
                            wrapperStyle={layoutStyle.cardInnerwrapper}


                        >


                        </Card>

                    }

                />
            </View>
        );
    }
}


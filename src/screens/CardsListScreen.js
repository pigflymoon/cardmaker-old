import React, {Component} from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {List, ListItem, Tile, Card, Button} from "react-native-elements";
import {auth, db} from '../config/FirebaseConfig';
import {CREDENTIAL} from '../config/credentialDB';
import axios from 'axios';
let freeReferenceToOldestKey = '', paidReferenceToOldestKey = '', lastPaidKey = '', lastFreeKey = '';

export default class CardsListScreen extends Component {
    state = {
        data: [],
        page: 0,
        loading: true,
        cardsData: [],
        lodingFinished: false,
        freeCards: [],
        paidCards: [],
    };

    // componentWillMount() {
    //     this.fetchData1();
    // }


    getFreeImages = () => {
        console.log('freeReferenceToOldestKey is', freeReferenceToOldestKey)
        this.setState({loading: true});
        if (!freeReferenceToOldestKey) {
            return db.ref('freeUploadImages')
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].Name)
                            return {id: key, name: snapshot.val()[key].Name, uri: snapshot.val()[key].downloadUrl}
                        });
                    console.log('Free result is ', results)
                    // storing reference

                    // self.setState({cardsData: results})

                    freeReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);

                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                })

        } else {
            return db.ref('freeUploadImages')
                .orderByKey()
                .endAt(freeReferenceToOldestKey)
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].Name)
                            return {id: key, name: snapshot.val()[key].Name, uri: snapshot.val()[key].downloadUrl}
                        });
                    // updating reference
                    console.log('free result is ', results)

                    // self.setState({cardsData:results})


                    freeReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);
                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                });

        }

    }

    getPaidImages = () => {
        console.log('paidReferenceToOldestKey is', paidReferenceToOldestKey)
        // this.setState({loading: true});
        if (!paidReferenceToOldestKey) {
            console.log('key is ~~~~~~~~~~~~~')
            return db.ref('paidUploadImages')
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].Name)
                            return {id: key, name: snapshot.val()[key].Name, uri: snapshot.val()[key].downloadUrl}
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
            return db.ref('paidUploadImages')
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].Name)
                            return {id: key, name: snapshot.val()[key].Name, uri: snapshot.val()[key].downloadUrl}
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


    getUserImages = (isPaidUser) => {
        var self = this;
        if (isPaidUser) {
            this.getPaidImages().then(function (pages) {
                console.log('******* data return is********* ', pages)
                var newPaidArr = [];
                var images = self.state.paidCards;
                if (pages.length > 0) {
                    var arrToConvert = pages;
                    lastPaidKey = pages[pages.length - 1].id;
                    console.log('#######last key is ', lastPaidKey)

                    console.log('#######saved last lastPaidKey is ', self.state.lastPaidKey)
                    console.log('arrToConvert ', arrToConvert)
                    if (lastPaidKey == self.state.lastPaidKey) {
                        return false;
                    } else {
                        for (var i = 0; i < arrToConvert.length; i++) {
                            newPaidArr = newPaidArr.concat(pages[i]);
                        }
                        console.log('######### state image  are :', images)

                        images = [...images, ...newPaidArr]
                        self.setState({lastPaidKey: lastPaidKey})

                        console.log('######### paid pages are :', images)

                        return images
                    }
                } else {
                    return false;
                }


            }).then(function (paidPages) {
                //

                var images = self.state.cardsData;

                if (paidPages && paidPages.length > 0) {
                    var totalImages = [...images, ...paidPages]
                    console.log('images are :', totalImages)
                    self.setState({cardsData: totalImages, loading: false})

                } else {
                    console.log('fetch free images')


                }


                // if (paidPages == undefined) {
                //     paidPages = [];
                // }


                //
            });
        }
        // else {
        //     this.getFreeImages().then(function (paidImages) {
        //         console.log('******************FreeImages are :', paidImages)
        //     });
        // }

    }

    handleScrollToEnd = () => {
        console.log('scroll loading is ', this.state.loading)
        if (this.state.lodingFinished) {
            return false
        } else {

            this.getUserImages(this.state.isPaidUser);
        }
    };

    componentDidMount() {

        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    console.log('isPaid user?', isPaidUser)
                    self.setState({signin: true, authUser, userrole: userrole, isPaidUser: isPaidUser});

                    self.getUserImages(isPaidUser);

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });

    }

    navigateToBoard = () => {
        this.props.navigation.navigate('BoardModel', {likedCards: []});
    }
    keyExtractor = (item, index) => `key${index}`;

    render() {
        console.log('state cardsData ??', this.state.cardsData)
        return (
            <View>
                <List>
                    <FlatList
                        data={this.state.cardsData}
                        keyExtractor={this.keyExtractor}
                        onEndReached={() => this.handleScrollToEnd()}
                        onEndReachedThreshold={0}
                        ListFooterComponent={() =>
                            this.state.loading
                                ? <ActivityIndicator size="large" animating/>
                                : null}
                        renderItem={({item}) =>


                            <Card
                                key={`${item.id}`}
                                title={`${item.name}`}
                                image={{uri: item.uri}}
                            >

                                <Button
                                    icon={{name: 'add-to-photos'}}
                                    backgroundColor='#03A9F4'
                                    buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                                    title='Save'
                                    onPress={this.navigateToBoard}
                                />
                            </Card>

                        }
                    />
                </List>
            </View>
        );
    }
}
import React, {Component} from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {List, ListItem, Tile, Card, Button} from "react-native-elements";
import {auth, db} from '../config/FirebaseConfig';
let freeReferenceToOldestKey = '', paidReferenceToOldestKey = '', lastPaidKey = '', lastFreeKey = '';

export default class CardsList extends Component {
    state = {
        data: [],
        page: 0,
        loading: false,
        cardsData: [],
        lodingFinished: false,
        freeCards: [],
        paidCards: [],
    };

    getFreeImages = () => {
        console.log('freeReferenceToOldestKey is', freeReferenceToOldestKey)
        this.setState({loading: true});
        if (!freeReferenceToOldestKey) {
            return db.ref('uploadImages')
                .orderByKey()
                .limitToFirst(15)
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
            console.log('called????')
            return db.ref('uploadImages')
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
                            console.log(' snapshot.val()[key]', snapshot.val()[key].name)
                            return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
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
            return db.ref('uploadImages')
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
            return db.ref('uploadImages')
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



    fetchData = async(isPaidUser) => {
        var self = this;
        if(isPaidUser){
            var paidPages = await (new Promise(function (resolve, reject) {
                setTimeout(() => {
                    self.getPaidImages().then(function (paidPages) {
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
        }else{
            console.log('isPaid User?',isPaidUser)
            var freePages = await (new Promise(function (resolve, reject) {
                setTimeout(() => {
                    self.getFreeImages().then(function (freePages) {
                        console.log('freepages ', freePages)
                        var newFreeArr = [];
                        var images = self.state.freeCards;
                        if (freePages.length > 0) {
                            var arrToConvert = freePages;
                            lastFreeKey = freePages[freePages.length - 1].id;
                            console.log('#######last key is ', lastFreeKey)

                            console.log('#######saved last lastFreeKey is ', self.state.lastFreeKey)
                            console.log('arrToConvert ', arrToConvert)
                            if (lastFreeKey == self.state.lastFreeKey) {
                                // return false;
                                resolve(images)
                            } else {
                                for (var i = 0; i < arrToConvert.length; i++) {
                                    newFreeArr = newFreeArr.concat(freePages[i]);
                                }
                                console.log('######### state image  are :', images)

                                images = [...images, ...newFreeArr]
                                self.setState({lastFreeKey: lastFreeKey})

                                console.log('######### free pages are :', images)
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
            var total = freePages
            console.log('total is :',total)
            return freePages
        }

    }


    handleScrollToEnd = () => {
        console.log('scroll loading is ', this.state.loading)
        var self = this;
        if (this.state.lodingFinished) {
            return false
        } else {

            this.fetchData(this.state.isPaidUser).then(function (pages) {
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

        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    console.log('isPaid user?', isPaidUser)
                    self.setState({signin: true, authUser, userrole: userrole, isPaidUser: isPaidUser});

                    self.fetchData(isPaidUser).then(function (pages) {
                        console.log('data are ', pages)
                        console.log('******* data return is********* ', pages)
                        self.setState({cardsData: pages, loading: false})


                    })
                    //

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
        return (
            <View>

                    <FlatList
                        data={this.state.cardsData}
                        keyExtractor={this.keyExtractor}
                        onEndReached={() => this.handleScrollToEnd()}
                        onEndReachedThreshold={0}
                        shouldItemUpdate={(props,nextProps)=>
                        {
                            return props.item!==nextProps.item

                        }  }
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

            </View>
        );
    }
}
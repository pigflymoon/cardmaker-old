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
        loading: false
    };

    // componentWillMount() {
    //     this.fetchData1();
    // }

    fetchData1 = async() => {
        var url = db.ref('freeUploadImages').toString() + `.json?auth=${CREDENTIAL}&shallow=true`;
        this.setState({loading: true});
        //
        var self = this;

        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                //
                var imageRef = db.ref('freeUploadImages');
                var peopleUrl = imageRef.toString() + `.json?auth=${CREDENTIAL}&shallow=true`;
                console.log('***********json url is ', peopleUrl)
                //

                var pageLength = 2;

                axios.get(peopleUrl)
                    .then(function (res) {
                        console.log('**************res is ', res)
                        var keys = Object.keys(res.data).sort(function (a) {
                            // We're sorting with parseInt because we're using SWAPI keys.
                            // Firebase push keys work fine with the default sort, i.e., Object.keys(res.data).sort();
                            return parseInt(a);
                        }).reverse(); // Always sort keys to guarantee order!!!
                        var keysLength = keys.length;
                        var promises = [];

                        for (var i = pageLength; i <= keysLength; i += pageLength) {
                            // i =  2, 4, 6, 8, 10... so subtract 1 to get the zero-indexed array key
                            var key = keys[i - 1];
                            // limitToLast starts at the bottom and reads up the list. endAt tells us from
                            // where to start reading up... so if we have keys 1...10, a pageLength of 2
                            // and endAt(4), the query will return records 4 and 3. It starts at the end
                            // and reads backwards, returning only 2 records.
                            var query = imageRef.orderByKey().limitToLast(pageLength).endAt(key);
                            promises.push(query.once('value'));
                        }

                        Promise.all(promises)
                            .then(function (snaps) {
                                var pages = [];
                                snaps.forEach(function (snap) {
                                    var page = [];
                                    snap.forEach(function (childSnap) {
                                        console.log('***********chidSnap is ', childSnap)
                                        page.push({
                                            id: childSnap.key,
                                            name: childSnap.val().name,
                                            url: childSnap.val().downloadUrl
                                        });
                                    });
                                    pages.push(page);
                                });
                                pages.forEach(function (page, key) {
                                    console.log('page %s: %s', key, JSON.stringify(page));
                                });
                                // process.exit();
                            })
                            .catch(function (err) {
                                console.log('error', err);
                            });
                    })
                    .catch(function (err) {
                        console.log('can not get url **************', err);
                    });
                ;
                //
                //
                // var userId = auth.currentUser.uid;
                // db.ref('/users/' + userId).once('value').then(function (snapshot) {
                //     var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                //     self.getImages(userrole);
                //     self.setState({signin: true, authUser, userrole: userrole});
                //
                // });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });
        //
        const response = await fetch(
            `https://randomuser.me/api?results=15&seed=hi&page=${this.state.page}`
        );
        const json = await response.json();
        this.setState(state => ({
            data: [...state.data, ...json.results],
            loading: false
        }));
    };

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
                    console.log('result is ', results)
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
                    console.log('result is ', results)

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
                    console.log('result is ', results)
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
                    console.log('result is ', results)

                    // self.setState({cardsData:results})


                    paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);
                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                });

        }

    }

    fetchData() {
        // try {
        //     // 注意这里的await语句，其所在的函数必须有async关键字声明
        //     let response = await (
        //         this.getUserImages()
        //     );
        //     console.log('response is ', response)
        //
        //     return response;
        // } catch (error) {
        //     console.error(error);
        // }
        // this.getUserImages()

    }

    getUserImages = (isPaidUser) => {
        var self = this;
        if (isPaidUser) {
            this.getPaidImages().then(function (pages) {
                console.log('*******First data return is********* ', pages)
                var newArr = [];

                if (pages.length > 0) {
                    var arrToConvert = pages;
                    lastPaidKey = pages[pages.length - 1].id;
                    console.log('#######last key is ', lastPaidKey)

                    console.log('#######saved last key is ', self.state.lastPaidKey)
                    if (lastPaidKey == self.state.lastPaidKey) {
                        return false;
                    } else {
                        for (var i = 0; i < arrToConvert.length; i++) {
                            newArr = newArr.concat(pages[i]);
                        }
                        console.log('##########First all paid pages are :', newArr)

                        return newArr
                    }
                }


            }).then(function (paidPages) {
                //
                console.log('returned paid pages are :', paidPages)
                if (paidPages == undefined) {
                    paidPages = [];
                }
                self.getFreeImages().then(function (freePages) {
                    var newFreeArr = [], newArr = [];

                    if (freePages.length > 0) {
                        var arrToConvert = freePages;
                        lastFreeKey = freePages[freePages.length - 1].id;
                        console.log('#######last key  free is ', lastFreeKey)

                        console.log('#######saved last free key is ', self.state.lastFreeKey)
                        if (lastFreeKey == self.state.lastFreeKey) {
                            return false;
                        } else {
                            for (var i = 0; i < arrToConvert.length; i++) {
                                newFreeArr = newFreeArr.concat(freePages[i]);
                            }
                            console.log('##########First all free pages are :', newFreeArr)

                            newArr = paidPages.concat(newFreeArr);
                            self.setState({cardsData: newArr, lastFreeKey: lastFreeKey, loading: false})

                        }
                    } else {

                        self.setState({cardsData: paidPages, lastFreeKey: lastFreeKey, loading: false})

                    }

                    console.log(newArr)
                })

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
        this.getUserImages(this.state.isPaidUser);
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
                                ? null
                                : <ActivityIndicator size="large" animating/>}
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
import React, {Component} from "react";
import {ActivityIndicator, FlatList, Text, View} from "react-native";
import {List, ListItem,Tile,Card,Button} from "react-native-elements";
import {auth, db} from '../config/FirebaseConfig';
import {CREDENTIAL} from '../config/credentialDB';
import axios from 'axios';
let referenceToOldestKey = '', lastKey = '';

export default class ListScreenTest extends Component {
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
        console.log('referenceToOldestKey is', referenceToOldestKey)
        this.setState({loading: true});
        if (!referenceToOldestKey) {
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

                    referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
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
                .endAt(referenceToOldestKey)
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


                    referenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                    resolve(results);
                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                });

        }

    }

    async fetchData() {
        try {
            // 注意这里的await语句，其所在的函数必须有async关键字声明
            let response = await (
                this.getFreeImages()
            );
            console.log('response is ', response)

            return response;
        } catch (error) {
            console.error(error);
        }


    }

    handleEnd = () => {
        var self = this;

        this.fetchData().then(function (pages) {
            console.log('*******First data return is********* ', pages)
            var newArr = [];
            var images = self.state.cardsData;

            if (pages.length > 0) {
                var arrToConvert = pages;
                lastKey = pages[pages.length - 1].id;
                console.log('#######last key is ', lastKey)

                console.log('#######saved last key is ', self.state.lastKey)
                if (lastKey == self.state.lastKey) {
                    return false;
                } else {
                    for (var i = 0; i < arrToConvert.length; i++) {
                        newArr = newArr.concat(pages[i]);
                    }
                    console.log('##########First all pages are :', newArr)
                    images = [...images, ...newArr]
                    console.log('images are  ',images)
                    self.setState({cardsData: images, lastKey: lastKey, loading: false})
                }
            }


        });
    };

    componentDidMount() {

        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {

                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    self.setState({signin: true, authUser, userrole: userrole});

                    self.fetchData().then(function (pages) {
                        console.log('*******First data return is********* ', pages)
                        var newArr = [];

                        if (pages.length > 0) {
                            var arrToConvert = pages;
                            lastKey = pages[pages.length - 1].id;
                            console.log('#######last key is ', lastKey)

                            console.log('#######saved last key is ', self.state.lastKey)
                            if (lastKey == self.state.lastKey) {
                                return false;
                            } else {
                                for (var i = 0; i < arrToConvert.length; i++) {
                                    newArr = newArr.concat(pages[i]);
                                }
                                console.log('##########First all pages are :', newArr)
                                self.setState({cardsData: newArr, lastKey: lastKey, loading: false})
                            }
                        }


                    });

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });

    }
    keyExtractor = (item, index) => `key${index}`;
    render() {
        return (
            <View>
                <List>
                    <FlatList
                        data={this.state.cardsData}
                        keyExtractor={this.keyExtractor}
                        onEndReached={() => this.handleEnd()}
                        onEndReachedThreshold={0}
                        ListFooterComponent={() =>
                            this.state.loading
                                ? null
                                : <ActivityIndicator size="large" animating/>}
                        renderItem={({item}) =>


                            <Card
                            key={`${item.id}`}
                            title={`${item.name}`}
                            image={{uri: item.uri}}>
                            <Text style={{marginBottom: 10}}>
                            The idea with React Native Elements is more about component structure than actual design.
                            </Text>
                            <Button
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                            title='VIEW NOW' />
                            </Card>

                        }
                    />
                </List>
            </View>
        );
    }
}
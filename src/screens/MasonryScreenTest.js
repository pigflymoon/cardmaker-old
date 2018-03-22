import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Masonry from 'react-native-masonry';
import {Icon, Card, Button} from 'react-native-elements';

import {auth, db} from '../config/FirebaseConfig';
import buttonStyle from '../styles/button';
import cardStyle from '../styles/card';

let referenceToOldestKey = '', lastKey = '';
export default class MasonryScreenTest extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            pages: [],
            images: [],
            cardsData: [],
            listHeight: 0,
            scrollViewHeight: 0,
            columns: 2,
            padding: 5,
            refreshing: false,
            lastKey: 0,
        }
    }


    componentDidMount() {

        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {

                self.setState({
                    signin: true,

                })
            }
        });
        //
    }

    getFreeImages = () => {
        console.log('referenceToOldestKey is', referenceToOldestKey)
        if (!referenceToOldestKey) {
            return db.ref('freeUploadImages')
                .orderByKey()
                .limitToLast(4)
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

    handleScroll = (event) => {
        var self = this;
        console.log('scroll to bottom')
        const bottomOfList = Math.floor(this.state.listHeight - this.state.scrollViewHeight);
        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);//Used to manually set the starting scroll offset.
        console.log('bottomOfList height', bottomOfList)
        console.log('currentOffset height', currentOffset)

        if (currentOffset - bottomOfList > 5) {

            this.fetchData().then(function (pages) {
                console.log('*******data return is********* ', pages)
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
                        console.log('##########all pages are :', newArr)
                        self.setState({cardsData: newArr, lastKey: lastKey})
                    }
                }


            });

        }
    }

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
                                self.setState({cardsData: newArr, lastKey: lastKey})
                            }
                        }


                    });

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });

    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }


    renderSignCard() {
        return (
            <Card title='Welcome to cardmaker'>
                <Text style={{marginBottom: 10}}>
                    Please sign in then choose picture to make card
                </Text>
                <Button
                    icon={{name: 'perm-identity'}}
                    buttonStyle={buttonStyle.submitButton}
                    title='Sign in /Sign up'
                    onPress={this.navigateToSignin}
                />
            </Card>
        );
    }

    render() {

        var renderSign = this.state.signin;
        console.log('cards:', this.state.cardsData)
//contentSize可以得到组件渲染后ScrollView里全部内容的高度，
// 从contentOffset里可以得到当前滑动距离的 x 和 y。x的值说明水平滑动的距离，y的值则是竖直方向的。
        if (renderSign) {
            return (
                <View style={cardStyle.cardsContainer}>


                    <Text>images</Text>
                    <ScrollView
                        style={{flex: 1, flexGrow: 10, padding: this.state.padding}}
                        onScroll={this.handleScroll}
                        scrollEventThrottle={16}
                        onContentSizeChange={ (contentWidth, contentHeight) => {
                            this.setState({listHeight: contentHeight})
                        }}

                        onLayout={ (e) => {
                            const height = e.nativeEvent.layout.height
                            this.setState({scrollViewHeight: height})
                        }}
                        ref={ (ref) => this.scrollView = ref }

                    >
                        <Masonry
                            sorted
                            bricks={this.state.cardsData}
                            columns={this.state.columns}
                            refreshControl={
                                <RefreshControl
                                    refreshing={this.state.refreshing}
                                    onRefresh={this.refresh}
                                />
                            }

                            customImageComponent={FastImage}/>
                    </ScrollView>

                </View>
            );

        } else {
            return (
                <View style={cardStyle.container}>
                    {this.renderSignCard()}
                </View>
            )
        }

    }
}




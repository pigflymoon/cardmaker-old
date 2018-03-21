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
var tempPages = [], cursorID = '', paidTempPages = [], padiCursorID = '', record;


export default class MasonryScreen2 extends Component {


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
        }
    }

    getFreeImages = (accumulator, cursor) => {

        // new Promise((resolve, reject) => {
        var peopleRef = db.ref('freeUploadImages');
        var pageLength = 4;
        var pages = accumulator || [];
        var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list
        console.log('cursor :', cursor)
        console.log('accumulator :', accumulator)
        if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor

            query = query.startAt(cursor);
            return query.once('value')
                .then(
                    snaps => new Promise((resolve, reject) => {
                        setTimeout(() => {
                            var page = [];
                            var extraRecord;
                            snaps.forEach(function (childSnap) {
                                page.push({
                                    id: childSnap.key,
                                    name: childSnap.val().Name,
                                    uri: childSnap.val().downloadUrl
                                });
                            });
                            console.log('page.length :', page)
                            // console.log('pageLength :', pageLength)

                            if (page.length > pageLength) {
                                extraRecord = page.pop();
                                console.log('extraRecord', extraRecord)
                                console.log('record', record)

                                if (record == undefined) {
                                    record = extraRecord;
                                    pages.concat(page);

                                    tempPages = pages;
                                    cursorID = extraRecord.id;


                                    resolve(pages);
                                }
                                else if ((record.id == extraRecord.id)) {
                                    resolve(pages);
                                } else {
                                    record = extraRecord
                                    pages.push(page);
                                    tempPages = pages;
                                    cursorID = extraRecord.id;
                                    resolve(pages);
                                }

                            } else {
                                console.log('add page ')
                                extraRecord = page.pop();
                                console.log('record.id is ,', record.id)
                                console.log('extraRecord.id is ,', extraRecord.id)
                                console.log('have cursor id same ?', record.id == extraRecord.id)
                                if ((record.id == extraRecord.id)) {
                                    resolve(pages);
                                } else {
                                    record = extraRecord
                                    pages.push(page);
                                    resolve(pages);
                                }
                            }

                        }, 5000);
                    })
                );

        } else {
            console.log('No cursor!!!!!!!!!!!')
            return query.once('value')
                .then(
                    snaps => new Promise((resolve, reject) => {
                        // setTimeout(() => {
                        var page = [];
                        var extraRecord;
                        snaps.forEach(function (childSnap) {
                            page.push({
                                id: childSnap.key,
                                name: childSnap.val().Name,
                                uri: childSnap.val().downloadUrl
                            });
                        });
                        console.log('page.length :', page)
                        // console.log('pageLength :', pageLength)

                        if (page.length > pageLength) {
                            extraRecord = page.pop();
                            console.log('extraRecord', extraRecord)
                            console.log('record', record)

                            if (record == undefined) {
                                record = extraRecord;
                                pages.push(page);

                                tempPages = pages;
                                cursorID = extraRecord.id;


                                resolve(pages);
                            }
                            else if ((record.id == extraRecord.id)) {
                                // pages.push(page);
                                // resolve(pages);
                                console.log('$$$$$$$$id same&&&&&&&&&&&&')
                                // reject('exist!')
                                resolve(pages);
                                // return false;
                            } else {
                                record = extraRecord
                                pages.push(page);
                                tempPages = pages;
                                cursorID = extraRecord.id;
                                resolve(pages);
                            }

                        } else {
                            console.log('add page ')
                            extraRecord = page.pop();
                            console.log('record.id is ,', record.id)
                            console.log('extraRecord.id is ,', extraRecord.id)
                            console.log('id same ?', record.id == extraRecord.id)
                            if ((record.id == extraRecord.id)) {
                                resolve(pages);
                            } else {
                                record = extraRecord
                                pages.push(page);
                                resolve(pages);
                            }
                        }

                        // }, 5000);
                    })
                );

        }
        // });
        // return promise;


    };
    // 注意这个方法前面有async关键字
    async getImagesFromDb(userrole, accumulator, cursor, paidAccumulator, padiCursor) {
        try {
            // 注意这里的await语句，其所在的函数必须有async关键字声明
            let response = await (
                this.getFreeImages(accumulator, cursor)
            )
            // let responseJson = await response.json();
            console.log('response', response)
            return response;
        } catch (error) {
            console.error(error);
        }
    }


    getUserImages = (accumulator, cursor, paidAccumulator, padiCursor) => {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {

                    // self.getImages(userrole, accumulator, cursor, paidAccumulator, padiCursor).then(function (data) {
                    // });
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    console.log('user role ?', userrole)
                    self.setState({signin: true, authUser, userrole: userrole});

                    self.getImagesFromDb(userrole, accumulator, cursor, paidAccumulator, padiCursor).then(function (pages) {
                        // console.log('data return is ', data)
                        var newArr = [];
                        var arrToConvert = pages;
                        console.log('pages is ',pages)
                        console.log('arrToConvert.length ',arrToConvert.length)
                        for (var i = 0; i < arrToConvert.length; i++) {
                            newArr = newArr.concat(pages[i]);
                        }
                        console.log('newArr.length ',newArr.length)

                        self.setState({cardsData: newArr})
                    });

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });
    }


    componentDidMount() {


        // var self = this;
        if (this.props.navigation.state.params) {
            var signin = this.props.navigation.state.params.signin;

            this.setState({
                signin: signin,

            })
        }
        this.getUserImages();


        //
    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }

    handleScroll = (event) => {
        var self = this;
        const bottomOfList = Math.floor(this.state.listHeight - this.state.scrollViewHeight);
        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        console.log('currentOffset', currentOffset)
        if (currentOffset > 100) {//currentOffset bottomOfList <= currentOffset
            this.getImagesFromDb(this.state.userrole, tempPages, cursorID, paidTempPages, padiCursorID).then(function (pages) {
                var newArr = [];
                var arrToConvert = pages;
                console.log('pages is ',pages)
                console.log('arrToConvert.length ',arrToConvert.length)
                for (var i = 0; i < arrToConvert.length; i++) {
                    // console.log('free page[i] is ', pages[i])
                    // console.log('new arr is ', newArr)
                    newArr = newArr.concat(pages[i]);
                }
                console.log('arrToConvert.length ',newArr.length)
                //
                // var filteredArr = newArr.filter(function (item, index) {
                //     console.log('item is ', item, 'index is, ', index)
                //
                //     if (newArr.indexOf(item) == index)
                //         return item;
                // });
                self.setState({cardsData: newArr})
                // self.setState({cardsData: data})
            });

            // this.getUserImages(tempPages, cursorID, paidTempPages, padiCursorID);


        }
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




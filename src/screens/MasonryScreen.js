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
var newArr = [];

export default class MasonryScreen extends Component {


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

    getPages = (accumulator, cursor) => {
        var self = this;
        var ref = db.ref();
        var peopleRef = ref.child('swapi/people');
// Calling ref.toString() outputs the ref's entire path: https://...firebaseio.com/some/ref/path
//         var peopleUrl = peopleRef.toString() + '.json?shallow=true';
        var pageLength = 2;
        var pages = accumulator || [];
        var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list
        if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor
            query = query.startAt(cursor);  // Don't forget to overwrite the query variable!
        }

        return query.once('value')
            .then(function (snaps) {
                console.log('snaps ', snaps)
                var page = [];
                var extraRecord;
                snaps.forEach(function (childSnap) {
                    console.log('childSnap.val()', childSnap.ref.getKey())
                    page.push({
                        id: childSnap.key,
                        name: childSnap.val().name
                    });
                });

                if (page.length > pageLength) {
                    extraRecord = page.pop();
                    pages.push(page);
                    console.log(pages, extraRecord.id);
                    return self.getPages(pages, extraRecord.id);
                } else {
                    pages.push(page);
                    return Promise.resolve(pages);
                }
            });
    };

    imagesQuery = (query, pageLength, pages) => {
        return query.once('value')
            .then(
                snaps => new Promise(resolve => {
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
                                pages.push(page);

                                tempPages = pages;
                                cursorID = extraRecord.id;


                                resolve(pages);
                            }
                            else if ((record.id == extraRecord.id)) {
                                // pages.push(page);
                                // resolve(pages);
                                return false;
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
                            if ((record.id == extraRecord.id)) {
                                pages.push(page);
                                resolve(pages);
                                // return false;
                            } else {
                                record = extraRecord
                                pages.push(page);
                                resolve(pages);
                            }
                        }

                    }, 500);
                })
            );
    }

    getFreeImagesPages = (accumulator, cursor) => {
        var peopleRef = db.ref('freeUploadImages');
        var pageLength = 4;
        var pages = accumulator || [];
        var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list


        if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor

            query = query.startAt(cursor);
            return this.imagesQuery(query, pageLength, pages);

        } else {
            console.log('No cursor!!!!!!!!!!!')
            return this.imagesQuery(query, pageLength, pages);

        }

    };

    getPaidImagePages = (accumulator, cursor) => {
        var peopleRef = db.ref('paidUploadImages');
        var pageLength = 4;
        var pages = accumulator || [];
        var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list


        if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor

            query = query.startAt(cursor);
            return this.imagesQuery(query, pageLength, pages);

        } else {
            console.log('No cursor!!!!!!!!!!!')
            return this.imagesQuery(query, pageLength, pages);

        }


    };


    getImages = (userrole, accumulator, cursor, paidAccumulator, padiCursor) => {
        var self = this;
        return ( new Promise(resolve => {
            setTimeout(() => {
                if (!userrole.paid_user) {
                    console.log('free user')

                    this.getFreeImagesPages(accumulator, cursor).then(function (pages) {
                        var arrToConvert = pages;


                        for (var i = 0; i < arrToConvert.length; i++) {
                            console.log('free page[i] is ', pages[i])
                            // console.log('new arr is ', newArr)
                            newArr = newArr.concat(pages[i]);
                        }
                        var filteredArr = newArr.filter(function (item, index) {
                            console.log('item is ', item, 'index is, ', index)

                            if (newArr.indexOf(item) == index)
                                return item;
                        });
                        console.log('filteredArr', filteredArr)
                        resolve(filteredArr);
                        // self.setState({images: pages, cardsData: filteredArr})
                    });

                } else {
                    console.log('paid user ???')
                    this.getPaidImagePages(paidAccumulator, padiCursor).then(function (paidImages) {
                        var arrToConvert = paidImages;


                        for (var i = 0; i < arrToConvert.length; i++) {
                            // console.log('page[i] is ', paidImages[i])
                            // console.log('new arr is ', newArr)
                            newArr = newArr.concat(paidImages[i]);
                        }
                        var filteredArr = newArr.filter(function (item, index) {
                            console.log('item is ', item, 'index is, ', index)

                            if (newArr.indexOf(item) == index)
                                return item;
                        });
                        newArr = filteredArr;

                        self.getFreeImagesPages(accumulator, cursor).then(function (freeImages) {

                            for (var i = 0; i < freeImages.length; i++) {
                                console.log('page[i] is ', freeImages[i])
                                // console.log('new arr is ', newArr)
                                newArr = newArr.concat(freeImages[i]);
                            }
                            var filteredArr = newArr.filter(function (item, index) {
                                console.log('item is ', item, 'index is, ', index)

                                if (newArr.indexOf(item) == index)
                                    return item;
                            });
                            resolve(filteredArr);
                            // self.setState({cardsData: filteredArr})
                        });
                    })

                }
            }, 1000)
        }));
        /*
         if (!userrole.paid_user) {
         console.log('free user')

         this.getFreeImagesPages(accumulator, cursor).then(function (pages) {
         var arrToConvert = pages;


         for (var i = 0; i < arrToConvert.length; i++) {
         console.log('free page[i] is ', pages[i])
         // console.log('new arr is ', newArr)
         newArr = newArr.concat(pages[i]);
         }
         var filteredArr = newArr.filter(function (item, index) {
         console.log('item is ', item, 'index is, ', index)

         if (newArr.indexOf(item) == index)
         return item;
         });
         console.log('filteredArr', filteredArr)
         self.setState({images: pages, cardsData: filteredArr})
         });

         } else {
         console.log('paid user ???')
         this.getPaidImagePages(paidAccumulator, padiCursor).then(function (paidImages) {
         var arrToConvert = paidImages;


         for (var i = 0; i < arrToConvert.length; i++) {
         // console.log('page[i] is ', paidImages[i])
         // console.log('new arr is ', newArr)
         newArr = newArr.concat(paidImages[i]);
         }
         var filteredArr = newArr.filter(function (item, index) {
         console.log('item is ', item, 'index is, ', index)

         if (newArr.indexOf(item) == index)
         return item;
         });
         newArr = filteredArr;

         self.getFreeImagesPages(accumulator, cursor).then(function (freeImages) {

         for (var i = 0; i < freeImages.length; i++) {
         console.log('page[i] is ', freeImages[i])
         // console.log('new arr is ', newArr)
         newArr = newArr.concat(freeImages[i]);
         }
         var filteredArr = newArr.filter(function (item, index) {
         console.log('item is ', item, 'index is, ', index)

         if (newArr.indexOf(item) == index)
         return item;
         });
         self.setState({cardsData: filteredArr})
         });
         })

         }
         */
    }


    getUserImages = (accumulator, cursor, paidAccumulator, padiCursor) => {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    console.log('user role ?', userrole)
                    self.getImages(userrole, accumulator, cursor, paidAccumulator, padiCursor).then(function (data) {
                        self.setState({cardsData: data})
                    });
                    self.setState({signin: true, authUser, userrole: userrole});

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
        console.log('scrollView height', this.state.scrollViewHeight)
        // if (bottomOfList <= currentOffset && this.state.scrollViewHeight >= 488) {
        if (currentOffset>100) {
            this.getImages(this.state.userrole, tempPages, cursorID, paidTempPages, padiCursorID).then(function (data) {
                console.log('return data ', data)
                self.setState({cardsData: data})
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




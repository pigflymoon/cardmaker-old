import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, ScrollView} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import axios from 'axios';
import {auth, db, firebaseApp} from '../config/FirebaseConfig';
import cardStyle from '../styles/card';
var tempPages = [], cursorID ='',preCursorID = '';

export default class TestScreen extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            pages: [],
            images: [],
            listHeight: 0,
            scrollViewHeight: 0
        }
    }

    getSwapiPerson = (i) => {
        return axios.get('https://swapi.co/api/people/' + i + '?format=json')
            .then(function (res) {
                return Promise.resolve({
                    id: i,
                    person: res.data
                });
            });
    };
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

    getImagePages = (accumulator, cursor) => {
        var self = this;


        var peopleRef = db.ref('freeUploadImages');
// Calling ref.toString() outputs the ref's entire path: https://...firebaseio.com/some/ref/path
//         var peopleUrl = peopleRef.toString() + '.json?shallow=true';
        var pageLength = 2;
        var pages = accumulator || [];
        var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list


        if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor
            console.log('########cursor is :', cursor)
            console.log('########cursorID is :', cursorID)
            console.log('########preCursorID :', preCursorID)
            if (cursor == preCursorID) {
                console.log('same cursor !!!!!!!!')
                console.log('%%%%%%%%%cursor == preCursorID******** :')
                console.log('########cursor is :', cursorID)
                console.log('########preCursorID :', preCursorID)
                return Promise.resolve(pages);
            } else {
                console.log('*****cursor != preCursorID******** :')
                console.log('########cursor is :', cursorID)
                console.log('########preCursorID :', preCursorID)
                query = query.startAt(cursor);  // Don't forget to overwrite the query variable!
                return query.once('value')
                    .then(function (snaps) {
                        if(snaps){
                            var page = [];
                            var extraRecord;
                            snaps.forEach(function (childSnap) {
                                page.push({
                                    id: childSnap.key,
                                    name: childSnap.val().Name,
                                    url: childSnap.val().downloadUrl
                                });
                            });
                            // console.log('**********page.length :', page.length)
                            // console.log('**********pageLength :', pageLength)

                            if (page.length > pageLength) {
                                extraRecord = page.pop();
                                pages.push(page);
                                // console.log('**********pages are', JSON.stringify(pages), '*******id is ', extraRecord.id);
                                // return self.getImagePages(pages, extraRecord.id);
                                tempPages = pages;
                                preCursorID = extraRecord.id;
                                console.log('*****update cursonId******** :',preCursorID)

                                // self.setState({pages, cursorID: extraRecord.id})
                                console.log('@@@@@@@@@got pages? ',pages);
                                return Promise.resolve(pages);
                            } else {
                                pages.push(page);
                                return Promise.resolve(pages);
                            }
                        }else{
                            console.log('##########got pages? ',pages);

                        }

                    });
            }

        } else {
            console.log('No cursor!!!!!!!!!!!')
            return query.once('value')
                .then(function (snaps) {
                    var page = [];
                    var extraRecord;
                    snaps.forEach(function (childSnap) {
                        page.push({
                            id: childSnap.key,
                            name: childSnap.val().Name,
                            url: childSnap.val().downloadUrl
                        });
                    });
                    // console.log('**********page.length :', page.length)
                    // console.log('**********pageLength :', pageLength)

                    if (page.length > pageLength) {
                        extraRecord = page.pop();
                        pages.push(page);
                        // console.log('**********pages are', JSON.stringify(pages), '*******id is ', extraRecord.id);
                        // return self.getImagePages(pages, extraRecord.id);
                        tempPages = pages;
                        cursorID = extraRecord.id;

                        // self.setState({pages, cursorID: extraRecord.id})
                        return Promise.resolve(pages);
                    } else {
                        pages.push(page);
                        return Promise.resolve(pages);
                    }
                });
        }

    };

    componentDidMount() {
        /*
         var ref = db.ref();
         var peopleRef = ref.child('/swapi/people');
         var promises = [];
         var i = 10;
         while (i--) {
         promises.push(this.getSwapiPerson(i + 1) // i will be 9…0, so add 1 to match the SWAPI api
         .then(function (res) {
         return peopleRef.child(res.id).set(res.person);
         }));
         }

         Promise.all(promises)
         .then(function () {
         console.log('Swapi data loaded');
         // process.exit();
         firebaseApp.delete();
         })
         .catch(function (err) {
         console.log('Swapi data load error', err);
         firebaseApp.delete();
         });
         */
        var self = this;//getPages
        // this.getPages()
        //     .then(function (pages) {
        //         self.setState({pages: pages})
        //         pages.map(page => {
        //             console.log('page is ', page)
        //             page.map(item => {
        //                 console.log('item is ', item)
        //             })
        //         });
        //         console.log('pages', JSON.stringify(pages));
        //     });
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                self.getImagePages()
                    .then(function (pages) {
                        self.setState({images: pages})
                        // pages.map(page => {
                        //     console.log('page is ', page)
                        //     page.map(item => {
                        //         console.log('item is ', item)
                        //     })
                        // });
                        // console.log('pages', JSON.stringify(pages));
                    });
            }
        });


        //
    }

    handleScroll = (event) => {
        var self = this;
        const bottomOfList = Math.floor(this.state.listHeight - this.state.scrollViewHeight);
        // console.log('listHeight', this.state.listHeight);
        // console.log('scrollViewHeight', this.state.scrollViewHeight);
        // console.log('bottomOfList', bottomOfList);

        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        // let viewHeight = event.nativeEvent.layout;
        if (bottomOfList <= currentOffset) {
            console.log('**************cursorID is*********', cursorID)
            this.getImagePages(tempPages, cursorID).then(function (pages) {
                console.log('return pages are ',pages)
                self.setState({images: pages})
            });
            // this.setState({pages, cursorID: extraRecord.id})
        }
    }

    render() {
        return (
            <View style={cardStyle.cardsContainer}>

                <Text>Test</Text>
                {(this.state.pages).length > 0 ?
                    <ScrollView>
                        {(this.state.pages).map((page, index) =>
                            <List containerStyle={{borderTopWidth: 0}} key={index}>
                                {page.map(item =>
                                    <ListItem
                                        rightIcon={{name: 'open-in-new'}}
                                        key={`index-${item.name}`}
                                        title={item.name}
                                        rightTitle={item.id}

                                    />,
                                )}
                            </List>
                        )}
                    </ScrollView> : null}
                <Text>images</Text>
                {(this.state.images).length > 0 ?
                    <ScrollView
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
                        {(this.state.images).map((page, index) =>
                            <List containerStyle={{borderTopWidth: 0}} key={index}>
                                {page.map(item =>
                                    <ListItem
                                        rightIcon={{name: 'open-in-new'}}
                                        key={`index-${item.name}`}
                                        title={item.name}
                                        rightTitle={item.id}

                                    />,
                                )}
                            </List>
                        )}
                    </ScrollView> : null}
            </View>
        );
    }
}




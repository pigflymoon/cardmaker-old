import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, ScrollView} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import axios from 'axios';
import {auth, db, firebaseApp} from '../config/FirebaseConfig';
import cardStyle from '../styles/card';
var tempPages = [], cursorID = '', preCursorID = '', record;

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
                                url: childSnap.val().downloadUrl
                            });
                        });
                        if (page.length > pageLength) {
                            extraRecord = page.pop();
                            if (record == undefined) {
                                record = extraRecord;
                                pages.push(page);

                                tempPages = pages;
                                cursorID = extraRecord.id;


                                resolve(pages);
                            }
                            else if ((record.id == extraRecord.id)) {
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
                                return false;
                            } else {
                                record = extraRecord
                                pages.push(page);
                                resolve(pages);
                            }
                        }

                    }, 1000);
                })
            );
    }
    getImagePages = (accumulator, cursor) => {
        var peopleRef = db.ref('freeUploadImages');
        var pageLength = 2;
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
        // this.setState({images: []})
        var self = this, images = [];
        const bottomOfList = Math.floor(this.state.listHeight - this.state.scrollViewHeight);
        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        if (bottomOfList <= currentOffset) {
            this.getImagePages(tempPages, cursorID).then(function (pages) {
                self.setState({images: pages})
            });

        }
    }

    render() {
        return (
            <View style={cardStyle.cardsContainer}>


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




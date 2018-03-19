/*
 React-Native-Masonry Demo
 https://github.com/brh55/react-native-masonry
 */

import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    ScrollView,
    View,
    TouchableHighlight,
    Image,
    Slider,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Masonry from 'react-native-masonry';
import axios from 'axios';
import {getFreeImages, getPaidImages, getPages} from '../utils/firebaseImages';
import {auth, db,firebaseApp} from '../config/FirebaseConfig';
import {CREDENTIAL} from '../config/credentialDB';
// list of images
// let data = [
//     {
//         data: {
//             caption: 'Summer Recipies',
//             user: {
//                 name: 'Henry'
//             },
//         },
//         uri: 'https://s-media-cache-ak0.pinimg.com/736x/32/7f/d9/327fd98ae0146623ca8954884029297b.jpg',
//         renderFooter: (data) => {
//             return (
//                 <View key='brick-header'
//                       style={{backgroundColor: 'white', padding: 5, paddingRight: 9, paddingLeft: 9}}>
//                     <Text style={{lineHeight: 20, fontSize: 14}}>{data.caption}</Text>
//                 </View>
//             )
//         },
//         renderHeader: (data) => {
//             return (
//                 <View key='brick-footer' style={styles.headerTop}>
//                     <Image
//                         source={{uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTsO3JMW5pmK-pq9g3T-1znMMK8IEELKnasQ6agJANePV7Z0nwp9w'}}
//                         style={styles.userPic}/>
//                     <Text style={styles.userName}>{data.user.name}</Text>
//                 </View>
//             )
//         }
//     },
//     // {
//     //     id: 1,
//     //     uri: 'https://s-media-cache-ak0.pinimg.com/736x/b1/21/df/b121df29b41b771d6610dba71834e512.jpg',
//     // },
//     // {
//     //     id: 2,
//     //     uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQpD8mz-2Wwix8hHbGgR-mCFQVFTF7TF7hU05BxwLVO1PS5j-rZA',
//     // },
//
//     // {
//     //     id: 2,
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2015-03/17/15/enhanced/webdr13/enhanced-6527-1426620797-18.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2014-12/1/15/enhanced/webdr02/enhanced-18393-1417466529-5.jpg'
//     // },
//     // {
//     //     uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXXTmdaGSOFK8iBeYqoA6_XiQGGWvu6KGnqAxXYyvJA-JKin8ImQ'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2015-04/3/15/enhanced/webdr06/enhanced-24427-1428089292-2.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2016-12/28/12/asset/buzzfeed-prod-web-09/sub-buzz-24236-1482944714-1.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2016-03/7/17/enhanced/webdr08/enhanced-buzz-8155-1457391039-5.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2017-03/30/12/asset/buzzfeed-prod-fastlane-01/sub-buzz-24597-1490890739-1.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2016-01/14/20/campaign_images/webdr15/which-delicious-mexican-food-item-are-you-based-o-2-20324-1452822970-1_dblbig.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2015-11/30/10/enhanced/webdr15/enhanced-18265-1448896942-17.jpg'
//     // },
//     // {
//     //     uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2015-12/30/16/enhanced/webdr04/enhanced-15965-1451509932-6.jpg'
//     // }
// ];

const addData = [
    {
        id: 2,
        uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2015-03/17/15/enhanced/webdr13/enhanced-6527-1426620797-18.jpg'
    },

    {
        id: 3,
        uri: 'https://s-media-cache-ak0.pinimg.com/736x/5a/15/0c/5a150cf9d5a825c8b5871eefbeda8d14.jpg'
    },
    {
        id: 4,
        uri: 'https://s-media-cache-ak0.pinimg.com/736x/04/63/3f/04633fcc08f9d405064391bd80cb0828.jpg'
    },
    {
        id: 5,
        uri: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQRWkuUMpLyu3QnFu5Xsi_7SpbabzRtSis-_QhKas6Oyj3neJoeug'
    },
    {
        id: 6,
        uri: 'https://s-media-cache-ak0.pinimg.com/736x/a5/c9/43/a5c943e02b1c43b5cf7d5a4b1efdcabb.jpg'
    },
    {
        id: 7,
        uri: 'https://i0.wp.com/www.youbodyhealth.com/wp-content/uploads/2016/08/Delicious-Foods-can-Harm-Your-Brain.jpg?'
    },
    {
        id: 8,
        uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2017-03/29/15/campaign_images/buzzfeed-prod-fastlane-03/26-delicious-korean-foods-you-need-in-your-life-2-30138-1490814365-13_dblbig.jpg',
    },
    {
        id: 9,
        uri: 'https://pbs.twimg.com/media/B59AOmICQAAiGGj.png',
    },
    {
        id: 10,
        uri: 'https://img.buzzfeed.com/buzzfeed-static/static/2013-12/enhanced/webdr05/17/17/enhanced-buzz-orig-2548-1387320822-8.jpg'
    },
    {
        id: 11,
        uri: 'https://i.pinimg.com/736x/48/ee/51/48ee519a1768245ce273363f5bf05f30--kaylaitsines-dipping-sauces.jpg'
    },
    {
        id: 12,
        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGYfU5N8lsJepQyoAigiijX8bcdpahei_XqRWBzZLbxcsuqtiH'
    },
    {
        id: 13,
        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPL2GTXDuOzwuX5X7Mgwc3Vc9ZIhiMmZUhp3s1wg0oHPzSP7qC'
    }
];

export default class MasonryScreen extends Component {
    constructor() {
        super();
        // console.log('data is ',data)
        this.state = {
            columns: 3,
            padding: 5,
            signin: false,
            cardsData: [],

            refreshing: false,
            waiting: false,
            listHeight: 0,
            scrollViewHeight: 0
        };
    }

    _addData = () => {

        // var arr = data.concat(addData).reduce(function (prev, current, index, array) {
        //
        //     if (!(current.id in prev.keys)) {
        //         prev.keys[current.id] = index;
        //         prev.result.push(current);
        //     }
        //     else {
        //         prev.result[prev.keys[current.id]] = current;
        //     }
        //
        //     return prev;
        // }, {result: [], keys: {}}).result;
        // var appendedData = arr;
        // const appendedData = [...data, ...addData];
        // console.log('appendData is ', appendedData)
        this.setState({
            cardsData: addData
        });
    }

    handleScroll = (event) => {
        const bottomOfList = Math.floor(this.state.listHeight - this.state.scrollViewHeight);
        console.log('listHeight', this.state.listHeight);
        console.log('scrollViewHeight', this.state.scrollViewHeight);
        console.log('bottomOfList', bottomOfList);

        let currentOffset = Math.floor(event.nativeEvent.contentOffset.y);
        // let viewHeight = event.nativeEvent.layout;
        console.log('currentOffset is :', currentOffset);
        if (bottomOfList <= currentOffset) {
            this._addData();
        }
    }

    getImages = (userrole) => {
        var self = this;
        if (!userrole.paid_user) {

            getFreeImages().then(function (images) {
                console.log('called???',images)
                self.setState({cardsData: images});
            });
        } else {
            getPaidImages().then(function (val) {
                console.log('val is,', val)
                //concat free images and paid images
                var cardsData = val;//self.state.cardsData;
                // cardsData = cardsData.concat((images));
                //

                getFreeImages().then(function (images) {
                    var freeImages = images;
                    cardsData = cardsData.concat((freeImages));
                    console.log('cardsData',cardsData)
                    self.setState({cardsData: cardsData});
                });
            })

        }
    }

    refreshImages = () => {
        this.setState({cardsData: []});
        var self = this;
        this.getUserImages();
    }

    getUserImages = () => {
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
                                firebaseApp.delete();
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
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true};
                    self.getImages(userrole);
                    self.setState({signin: true, authUser, userrole: userrole});

                });
            } else {
                self.setState({signin: false, cardsData: []})
            }
        });
    }

    componentDidMount() {

        this.getUserImages();
    }

    componentWillUnmount() {
        this.setState({cardsData: []});
    }


    render() {
        console.log('state data is ,', this.state.data)
        return (
            <View style={{flex: 1, backgroundColor: '#f4f4f4'}}>
                <View style={[styles.center, styles.header]}>
                    <Text style={{fontWeight: '800', fontSize: 20}}>Masonry Demo</Text>
                </View>
                <View
                    style={[styles.center, styles.slider, {marginTop: 10, marginBottom: 25, flexDirection: 'column'}]}>
                    <View style={{paddingLeft: 10}}>
                        <Text>Dynamically adjust padding: {this.state.padding}</Text>
                    </View>
                    <View style={{width: '100%'}}>
                        <Slider
                            style={{height: 10, margin: 10}}
                            maximumValue={40}
                            step={5}
                            value={20}
                            onValueChange={(value) => this.setState({padding: value})}/>
                    </View>
                </View>


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
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f4f4f4',
        flex: 1,
        flexBasis: '10%'
    },
    header: {
        flexGrow: 1
    },
    buttonGroup: {
        flexGrow: 1
    },
    slider: {
        flexGrow: 1
    },
    button: {
        backgroundColor: '#dbdcdb',
        padding: 10,
        marginRight: 4,
        borderRadius: 4,
        borderBottomColor: '#7b7b7b',
        borderBottomWidth: 5
    },
    buttonText: {
        color: '#404040'
    },
    center: {
        marginTop: 30,
        marginBottom: 20,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    headerTop: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    userPic: {
        height: 20,
        width: 20,
        borderRadius: 10,
        marginRight: 10
    },
    userName: {
        fontSize: 20
    }
});
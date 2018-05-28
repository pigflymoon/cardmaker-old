import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    FlatList,
    TouchableOpacity,
    Image,
} from 'react-native';
import {Card,} from 'react-native-elements';

import {db} from '../../config/FirebaseConfig';

import ImageTypeTab from '../../components/ImageTypeTab';
import layoutStyle from '../../styles/layout';
import exploreStyle from '../../styles/explore';

let paidReferenceToOldestKey = '', lastPaidKey = '';

let cardsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "forHer", "forHim"],
    thankyou: ["general", "birthday", "wedding"]
}


// let cardsType = [
//     ["christmas", "newYear", "easter"],
//     ["kids", "forHer", "forHim"],
//     ["general", "birthday", "wedding"]
// ];


let invitationsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "women", "men"],
    wedding: ["invitation", "saveTheDate", "rsvp"]
}

export default class ImagesGallery extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            loading: true,
            cardsData: [],
            lodingFinished: false,
            paidCards: [],
        }
    }

    getPaidImages = (imageType = 'cards') => {
        console.log('imageType is ********', imageType)

        if (!paidReferenceToOldestKey) {
            return db.ref().child(imageType)
                .orderByKey()
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                        // changing to reverse chronological order (latest first)
                        console.log('key is snapshot is ', snapshot.val())

                        if (snapshot.val()) {
                            let arrayOfKeys = Object.keys(snapshot.val())
                                .sort()
                                .reverse();
                            // transforming to array
                            let results = arrayOfKeys
                                .map((key) => {
                                    return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                                });
                            // storing reference

                            paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                            resolve(results);
                        }


                        // Do what you want to do with the data, i.e.
                        // append to page or dispatch({ … }) if using redux
                    }
                ))
                .catch((error) => {
                    console.log('error')
                })

        } else {
            console.log('imageType is ********', imageType)

            return db.ref().child(imageType)
                .orderByKey()
                .endAt(paidReferenceToOldestKey)
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                    // changing to reverse chronological order (latest first)
                    // & removing duplicate
                    console.log('snapshot is ', snapshot.val())
                    if (snapshot.val()) {
                        let arrayOfKeys = Object.keys(snapshot.val())
                            .sort()
                            .reverse()
                            .slice(1);
                        // transforming to array
                        let results = arrayOfKeys
                            .map((key) => {
                                return {id: key, name: snapshot.val()[key].name, uri: snapshot.val()[key].downloadUrl}
                            });
                        // updating reference

                        paidReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                        resolve(results);
                    }


                    // Do what you want to do with the data, i.e.
                    // append to page or dispatch({ … }) if using redux
                }))
                .catch((error) => {
                    console.log('error')
                });
            // }


        }
        // }


    }
    fetchData = async(type) => {
        var self = this, imageType;
        console.log('fetch type  is ********', type)
        switch (type) {
            case 'cards':
                imageType = 'updatedcards';
                break;
            case 'invitations':
                imageType = 'updatedinvitations';
                break;
            case 'christmas' :
            case 'newYear' :
            case 'easter' :
            case 'kids' :
            case 'forHer' :
            case 'forHim' :
            case 'general' :
            case 'birthday' :
            case 'wedding' :
                imageType = `cards/${type}`;
                break;

        }
        console.log('*******cardType is ', imageType)
        var paidPages = await (new Promise(function (resolve, reject) {
            setTimeout(() => {
                self.getPaidImages(imageType).then(function (paidPages) {
                    var newPaidArr = [];
                    var images = self.state.paidCards;
                    if (paidPages.length > 0) {
                        var arrToConvert = paidPages;
                        lastPaidKey = paidPages[paidPages.length - 1].id;
                        if (lastPaidKey == self.state.lastPaidKey) {
                            resolve(images)
                        } else {
                            for (var i = 0; i < arrToConvert.length; i++) {
                                newPaidArr = newPaidArr.concat(paidPages[i]);
                            }

                            images = [...images, ...newPaidArr]
                            self.setState({lastPaidKey: lastPaidKey})
                            resolve(images);
                        }
                    } else {
                        self.setState({lodingFinished: true})
                        resolve(images)
                    }


                }), 2000
            });
        }));
        return paidPages;
    }
    handleScrollToEnd = (cardType) => {
        var self = this;
        if (this.state.lodingFinished) {
            return false
        } else {


            this.fetchData(cardType).then(function (pages) {
                var images = self.state.cardsData;
                images = [...images, ...pages]
                self.setState({cardsData: images, loading: false})

            })
        }
    };
    //
    onHandleSelect = (selectedName, selectedValue, type) => {
        var self = this;
        paidReferenceToOldestKey = '', lastPaidKey = '';
        this.fetchData(type).then(function (pages) {
            // var images = self.state.cardsData;
            // images = [...images, ...pages]
            console.log('type is *********:', type)

            console.log('pages are', pages.length)
            self.setState({
                selectedName: selectedName,
                selectedValue: selectedValue,
                type: type,
                cardsData: pages, loading: false
            })

        })


    }
    //

    renderTabs = (imageType) => {
        let imagesTypes = (imageType == 'cards') ? cardsType : invitationsType;
        return (
            Object.keys(imagesTypes).map((imagesType, key) => {
                return (
                    <View style={{flex: 1,}} key={key}>
                        <Text style={{
                            justifyContent: 'center',
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                        }}>{imagesType}</Text>
                        {imagesTypes[imagesType].map((type, index) => {
                            return (
                                <ImageTypeTab key={index}
                                              imageType={type}
                                              selectedName={this.state.selectedName}
                                              selectedValue={this.state.selectedValue}
                                              handleSelect={this.onHandleSelect}/>
                            )
                        })}
                    </View>
                )

            })
        )

    }

    componentWillMount() {
        const {imageType} = this.props.navigation.state.params;

        var self = this;
        db.ref().child('cards/christmas')
            .orderByKey()
            .limitToLast(5)
            .once('value')
            .then((snapshot) => {
                console.log('return cards is ', snapshot.val())
            })
        this.fetchData(imageType).then(function (pages) {
            self.setState({cardsData: pages, loading: false})
        })

    }

    componentWillUnmount() {
        paidReferenceToOldestKey = '';
        this.setState({cardsData: []});
    }

    render() {
        const {imageType} = this.props.navigation.state.params;
        return (
            <View style={layoutStyle.container}>
                <View style={{flex: 1, flexDirection: 'row',}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                        {this.renderTabs(imageType)}
                    </View>
                </View>
                {
                    this.state.cardsData.length > 0
                        ? <FlatList
                            style={{flex: 1, flexGrow: 2,}}
                            data={this.state.cardsData}
                            keyExtractor={(item, index) => `${index}-image`}
                            onEndReached={() => this.handleScrollToEnd(imageType)}
                            onEndReachedThreshold={0}
                            shouldItemUpdate={(props, nextProps) => {
                                return props.item !== nextProps.item

                            }  }
                            ListFooterComponent={() =>
                                this.state.loading
                                    ? <ActivityIndicator size="large" animating/>
                                    : null}
                            renderItem={({item}) =>
                                <Card
                                    key={`${item.id}`}
                                    image={{uri: item.uri}}
                                    featuredTitle={item.name}
                                    imageStyle={exploreStyle.cardImage}
                                    containerStyle={exploreStyle.cardContainer}
                                />

                            }

                        /> : <View><Text>No images</Text></View>
                }


            </View>
        );
    }
}


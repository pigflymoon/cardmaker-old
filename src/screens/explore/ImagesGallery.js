import React, {Component} from 'react';
import {
    Text,
    View,
    ActivityIndicator,
    FlatList,
    ImageBackground,
    ScrollView
} from 'react-native';
import {Card, ButtonGroup} from 'react-native-elements';
import ScrollTabs from '../../components/ScrollTabs';

import {db} from '../../config/FirebaseConfig';

import layoutStyle from '../../styles/layout';

import exploreStyle from '../../styles/explore';
import bg1 from '../../assets/images/bg.jpg';
import showInfo from '../../styles/showInfo';
import colors from '../../styles/colors';


let imageReferenceToOldestKey = '', lastImageKey = '';

export default class ImagesGallery extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            loading: true,
            cardsData: [],
            sampleGalleryData: [],
            lodingFinished: false,
            allImages: [],
            selectedName: 'christmas',//default
            selectedValue: true,
            selectedIndex: 0,


        }
    }

    getImagesPaginationByKey = (category = 'cards') => {
        if (!imageReferenceToOldestKey) {
            return db.ref().child(category)
                .orderByKey()
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                        // changing to reverse chronological order (latest first)
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

                            imageReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                            resolve(results);
                        } else {
                            let results = [];
                            resolve(results);
                        }
                    }
                ))
                .catch((error) => {
                    console.log('error')
                })

        } else {
            return db.ref().child(category)
                .orderByKey()
                .endAt(imageReferenceToOldestKey)
                .limitToLast(5)
                .once('value')
                .then((snapshot) => new Promise((resolve) => {
                    // changing to reverse chronological order (latest first)
                    // & removing duplicate
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
                        imageReferenceToOldestKey = arrayOfKeys[arrayOfKeys.length - 1];
                        resolve(results);
                    } else {
                        let results = [];
                        resolve(results);
                    }
                }))
                .catch((error) => {
                    console.log('error')
                });
        }

    }

    fetchData = async(category) => {
        var self = this;
        var allPages = await (new Promise(function (resolve, reject) {
            setTimeout(() => {
                self.getImagesPaginationByKey(category).then(function (allPages) {
                    console.log('allpages are :', allPages);
                    var newPaidArr = [];
                    var images = self.state.allImages;

                    if (allPages.length > 0) {
                        var arrToConvert = allPages;
                        lastImageKey = allPages[allPages.length - 1].id;
                        if (lastImageKey == self.state.lastImageKey) {
                            resolve(images)
                        } else {
                            for (var i = 0; i < arrToConvert.length; i++) {
                                newPaidArr = newPaidArr.concat(allPages[i]);
                            }
                            images = [...images, ...newPaidArr]
                            self.setState({lastImageKey: lastImageKey})
                            resolve(images);
                        }
                    } else {
                        self.setState({lodingFinished: true})
                        resolve(images)
                    }


                }), 2000
            });
        }));
        return allPages;
    }

    handleScrollToEnd = (cardType) => (e) => {
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

    onSelectedTab = (selectedName, selectedValue, type, loading, imageType) => {
        var self = this;

        imageReferenceToOldestKey = '',
            this.fetchData(imageType).then(function (pages) {
                self.setState({
                    selectedName: selectedName,
                    selectedValue: selectedValue,
                    type: type,
                    allImages: [],
                    cardsData: pages,
                    loading: loading,
                    lodingFinished: false,
                    imageType: imageType,//save imageTpe category/type
                });
            })

    }
    //
    updateCategory = (selectedIndex) => {
        let imagesTypes = (selectedIndex == 0) ? 'gallery/cards' : 'gallery/invitations';
        var self = this;

        imageReferenceToOldestKey = '',
            this.fetchData(imagesTypes).then(function (pages) {
                self.setState({
                    selectedIndex: selectedIndex,
                    imageType: imagesTypes,
                    selectedName: '',//default
                    selectedValue: false,
                    allImages: [],
                    sampleGalleryData: pages,
                    loading: false,
                    lodingFinished: false,
                });
            })
    }

    componentWillMount() {
        const {category, showSample} = this.props.navigation.state.params;
        let type = (category == 'cards') ? 'cards/christmas' : 'invitations/christmas';
        var self = this;
        if (showSample) {
            this.fetchData('gallery/cards').then(function (pages) {
                console.log('@@@@@@pages are :', pages);
                self.setState({sampleGalleryData: pages, loading: false})
            });

        } else {
            this.fetchData(type).then(function (pages) {
                self.setState({cardsData: pages, loading: false})
            });
        }


    }

    componentWillUnmount() {
        imageReferenceToOldestKey = '';
        this.setState({cardsData: [], sampleGalleryData: []});
    }

    keyExtractor = (item) => item.id

    renderImageGallery = () => {
        const {category} = this.props.navigation.state.params;
        const {
            cardsData,
            imageType
        } = this.state;
        return (
            <View style={layoutStyle.container}>
                <ScrollTabs category={category} selectedTab={this.onSelectedTab}/>
                {
                    cardsData.length > 0
                        ? <FlatList
                            style={{flex: 1, flexGrow: 2,}}
                            data={cardsData}
                            keyExtractor={this.keyExtractor}
                            onEndReached={this.handleScrollToEnd(imageType)}
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

                        /> : <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}>
                            <ImageBackground
                                source={bg1}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: 325,
                                }}
                            >
                                <View style={showInfo.container}><Text
                                    style={showInfo.text}>Meow. Coming soon! </Text></View>
                            </ImageBackground >
                        </View>
                }
            </View>

        )

    }
    renderSampleGallery = () => {
        const {
            sampleGalleryData,
            imageType,
            selectedIndex
        } = this.state;
        const buttons = ['Cards', 'Invitations'];
        console.log('****sampleGalleryData are: ', sampleGalleryData);
        return (
            <View style={layoutStyle.container}>
                <View style={{flex: 1, flexDirection: 'column',flexGrow:1}}>
                    <ButtonGroup
                        onPress={this.updateCategory}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                        containerStyle={{height: 30}}
                        selectedButtonStyle={{backgroundColor: colors.secondary2}}
                        selectedTextStyle={{color: colors.white}}
                    />
                </View>
                {
                    sampleGalleryData.length > 0
                        ? <FlatList
                            style={{flex: 1,flexGrow:4}}
                            data={sampleGalleryData}
                            keyExtractor={this.keyExtractor}
                            onEndReached={this.handleScrollToEnd(imageType)}
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

                                    imageStyle={exploreStyle.cardImage}
                                    containerStyle={exploreStyle.cardContainer}
                                />
                            }

                        /> : <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center',}}>
                            <ImageBackground
                                source={bg1}
                                style={{
                                    flex: 1,
                                    width: null,
                                    height: 325,
                                }}
                            >
                                <View style={showInfo.container}><Text
                                    style={showInfo.text}>Meow. Coming soon! </Text></View>
                            </ImageBackground >
                        </View>
                }
            </View>
        )
    }

    render() {
        const {showSample} = this.props.navigation.state.params;
        console.log('showSample', showSample);
        return (
            <View style={layoutStyle.container}>
                {showSample ? this.renderSampleGallery() : this.renderImageGallery()}

            </View>
        );
    }
}


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
    ImageBackground,
    ScrollView
} from 'react-native';
import {Card,} from 'react-native-elements';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';

import {db} from '../../config/FirebaseConfig';

import ImageTypeTab from '../../components/ImageTypeTab';
import layoutStyle from '../../styles/layout';
import colors from '../../styles/colors';

import exploreStyle from '../../styles/explore';
import bg1 from '../../assets/images/bg.jpg';
import showInfo from '../../styles/showInfo';
import sliderTabStyle from '../../styles/slideTab';

import CategoryConfig from '../../config/CategoryConfig';
let imageReferenceToOldestKey = '', lastImageKey = '';

export default class ImagesGallery extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            data: [],
            page: 0,
            loading: true,
            cardsData: [],
            lodingFinished: false,
            allImages: [],
            selectedName: 'christmas',//default
            selectedValue: true,
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
    //
    onHandleSelect = (selectedName, selectedValue, type, category) => {
        var self = this;
        var imageType;
        if (category == 'cards') {
            switch (type) {
                case 'cards':
                    imageType = 'updatedcards';
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
        } else {//
            switch (type) {
                case 'invitations':
                    imageType = 'updatedinvitations';
                    break;
                case 'christmas' :
                case 'newYear' :
                case 'easter' :
                case 'kids' :
                case 'women' :
                case 'men' :
                case 'invitation' :
                case 'saveTheDate' :
                case 'rsvp' :
                    imageType = `invitations/${type}`;
                    break;
            }
        }


        this.setState((prevState) => {
            if (prevState.type != type) {
                imageReferenceToOldestKey = '',
                    this.fetchData(imageType).then(function (pages) {
                        self.setState({
                            selectedName: selectedName,
                            selectedValue: selectedValue,
                            type: type,
                            allImages: [],
                            cardsData: pages,
                            loading: false,
                            lodingFinished: false,
                            imageType: imageType,//save imageTpe category/type
                        });
                    })
            }
        })
    }
    //

    renderScrollTabs = (category) => {
        let imagesTypes = (category == 'cards') ? CategoryConfig.cards : CategoryConfig.invitations;
        console.log('imagesTypes', imagesTypes)
        return(
            <ScrollableTabView
                initialPage={0}
                tabBarInactiveTextColor={colors.secondary2}
                tabBarActiveTextColor={colors.primary3}
                tabBarUnderlineStyle={{backgroundColor:colors.primary3}}
                renderTabBar={() => <ScrollableTabBar />}
            >
                {Object.keys(imagesTypes).map((imagesType, key) => {
                    return (
                        <ScrollView tabLabel={imagesType}  key={key} style={sliderTabStyle.tabView}>
                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                                {this.renderTypeTabs(category, imagesTypes, imagesType)}
                            </View>
                        </ScrollView>
                    )

                })}
            </ScrollableTabView>

        )
    }
    renderTypeTabs = (category, imagesTypes, imagesType) => {
        console.log('imagesTypes', imagesTypes);
        return (
            imagesTypes[imagesType].map((type, index) => {
                console.log('type is ', type);
                return (
                    <ImageTypeTab key={index}
                                  category={category}
                                  imageType={type}
                                  selectedName={this.state.selectedName}
                                  selectedValue={this.state.selectedValue}
                                  handleSelect={this.onHandleSelect}/>
                )


            })
        )


    }
    renderTabs = (category) => {
        let imagesTypes = (category == 'cards') ? CategoryConfig.cards : CategoryConfig.invitations;
        return (
            Object.keys(imagesTypes).map((imagesType, key) => {
                return (
                    <View style={{flex: 1,}} key={key}>
                        <Text style={{
                            justifyContent: 'center',
                            textAlign: 'center',
                            paddingVertical: 10,
                        }}>{imagesType}</Text>

                        {imagesTypes[imagesType].map((type, index) => {
                            return (
                                <ImageTypeTab key={index}
                                              category={category}
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
        const {category} = this.props.navigation.state.params;
        let type = (category == 'cards') ? 'cards/christmas' : 'invitations/christmas';
        var self = this;

        this.fetchData(type).then(function (pages) {
            self.setState({cardsData: pages, loading: false})
        })

    }

    componentWillUnmount() {
        imageReferenceToOldestKey = '';
        this.setState({cardsData: []});
    }

    keyExtractor = (item) => item.id

    render() {
        const {category} = this.props.navigation.state.params;
        return (
            <View style={layoutStyle.container}>
                {this.renderScrollTabs(category)}

                {
                    this.state.cardsData.length > 0
                        ? <FlatList
                            style={{flex: 1, flexGrow: 2,}}
                            data={this.state.cardsData}
                            keyExtractor={this.keyExtractor}
                            onEndReached={this.handleScrollToEnd(this.state.imageType)}
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
                                    height: 400,
                                }}
                            >
                                <View style={showInfo.container}><Text style={showInfo.text}>Meow. Coming soon! </Text></View>
                            </ImageBackground >

                        </View>
                }

            </View>
        );
    }
}


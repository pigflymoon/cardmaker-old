import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
    ScrollView,
    Dimensions,
    Linking,
    Alert,
    Animated,
} from 'react-native';
import {
    Icon,
    Avatar,
    ButtonGroup
} from 'react-native-elements';
import VersionCheck from 'react-native-version-check';

import Loader from 'react-native-mask-loader';

import layoutStyle from '../../styles/layout';
import carouselStyle from '../../styles/carousel';
import exploreStyle from '../../styles/explore';

import colors from '../../styles/colors';

import {HEADER_SCROLL_DISTANCE, HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT} from '../../styles/explore';

import  logo from '../../assets/images/logo.png';

import {
    getFreeImages,
    getUpdatedImages
} from '../../utils/FetchImagesByApi';
import {
    upDateRole
} from '../../utils/AppPay';

import  Utils from '../../utils/utils';
import CarouselImages from '../../components/CarouselImages';

import AutoResponsive from 'autoresponsive-react-native';
const downloadUrl = 'https://itunes.apple.com/us/app/cardmaker-app/id1318023993?mt=8';
const SCREEN_WIDTH = Dimensions.get('window').width;
const component1 = () => <Text>Cards</Text>
const component2 = () => <Text>Invitations</Text>
const showImagesNumber = 9;
const showLatestImagesNumber = 4;
let cardsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "forHer", "forHim"],
    thankyou: ["general", "birthday", "wedding"]
}
let invitationsType = {
    holiday: ["christmas", "newYear", "easter"],
    birthday: ["kids", "women", "men"],
    wedding: ["invitation", "saveTheDate", "rsvp"]
}

export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            latestImages: [],
            updatedcards: [],
            appReady: false,
            rootKey: Math.random(),
            connectionInfo: this.props.screenProps.connectionInfo,
            scrollY: new Animated.Value(0),
            imageCategory: 'cards',
            imageType: cardsType,
            array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        };
        this.maskImage = logo;

    }


    fetchUpdatedImages = (catergory, showImagesNumber) => {
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value
                getUpdatedImages(catergory, showImagesNumber).then(function (images) {
                    resolve(images)

                });


            }, 500);
        });
    }

    navigateToShowAll = (cardType) => {
        this.props.navigation.navigate('CardsGallery', {
            cardType: cardType,
        });
    }

    // 点击立即下载只是跳转到商店,本地不做处理,如果没有更新,下次进入依然提醒
    // 点击稍后下载,本地记录时间,10天后再次提醒
    showAlert = () => {
        Alert.alert(
            'Update to the latest version',
            'Cardmaker App?',
            [
                {text: 'OK', onPress: () => Linking.openURL(downloadUrl)}, // open store if update is needed.
                {text: 'Download next time', onPress: () => console.log('update later')}
            ])
    }

    componentWillMount() {
        const {imageCategory} = this.state

        var self = this;
        VersionCheck.needUpdate()
            .then(async res => {
                if (res.isNeeded) {
                    this.showAlert();
                }
            });

        // Promise.all([this.fetchImages(imageCategory, cardsType.holiday), this.fetchImages(imageCategory, cardsType.birthday), this.fetchImages(imageCategory, cardsType.thankyou)])
        //     .then(function (results) {
        //         console.log('results are ', results)
        //         let latestChristmasCardsImages = results[0][0];
        //         let latestnewYearCardsImages = results[1][0];
        //         let latesteasterCardsImages = results[2][0];
        //         // let latestotherImages = results[3][0];
        //         console.log('latesteasterCardsImages are ',latesteasterCardsImages)
        //         /*
        //          let latestbirthDayImages = results[0][0];
        //          let latestholidayImages = results[1][0];
        //          let latestweddingImages = results[2][0];
        //          let latestotherImages = results[3][0];
        //          let latestImages = [];
        //          latestImages.push(latestbirthDayImages, latestholidayImages, latestweddingImages, latestotherImages);
        //
        //          self.setState(
        //          {
        //          birthdayImages: results[0],
        //          holidayImages: results[1],
        //          weddingImages: results[2],
        //          otherImages: results[3],
        //          latestImages: latestImages
        //
        //          });
        //
        //          */
        //         // do something with result1 and result2
        //         // available as results[0] and results[1] respectively
        //     })
        //     .catch(function (err) { /* ... */
        //     });

        this.fetchUpdatedImages(imageCategory, showImagesNumber).then(function (results) {
            console.log('results', results)
            let latestImages = results.slice(0, showLatestImagesNumber);
            self.setState({updatedcards: results, latestImages: latestImages});
        })


        this.setState({
            contentIsLoading: true
        });

        setTimeout(() => {
            this.setState({contentIsLoading: false});
        }, 4000);
    }

    componentDidMount() {
        this.resetAnimation();

    }

    componentWillUnmount() {
        this.setState({
            updatedcards: []
        })


    }

    resetAnimation() {
        this.setState({
            appReady: false,
            rootKey: Math.random()
        });

        setTimeout(() => {
            this.setState({
                appReady: true,
            });
        }, 1000);
    }

    onUnlock = data => {
        var unlock = data.unLock;
        if (unlock === true) {
            upDateRole();
        }
    };

    navigateToUnLock = () => {
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});

    }

    updateIndex = (selectedIndex) => {
        let showCategory = ['Cards', 'Invitations'];
        var self = this;

        this.setState({selectedIndex: selectedIndex}, function () {
            for (let type of showCategory) {
                let index = showCategory.indexOf(type);

                if (this.state.selectedIndex === index) {

                    // let imageType = (type == 'Cards') ? cardsType : invitationsType;
                    console.log('category is :', type)
                    self.fetchUpdatedImages(type.toLocaleLowerCase(), showImagesNumber).then(function (results) {
                        console.log('updated results#######', results)
                        let latestImages = results.slice(0, showLatestImagesNumber);
                        self.setState({imageCategory: type, updatedcards: results, latestImages: latestImages});
                    })
                    // this.setState({});
                }
            }
        })

    }

    renderBanner = (data) => {
        return (
            <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: 10,}}>

                {data.map((image, index) => (
                    <View
                        key={index}
                        style={{
                            flex: 1, marginHorizontal: 5,
                            justifyContent: 'center',
                        }}>
                        <Avatar
                            large
                            rounded
                            source={{uri: image.illustration}}
                            activeOpacity={0.7}
                        />

                    </View>))}
            </View>
        );
    }

    renderImageList = () => {
        console.log(this.state.updatedcards)
        const {imageCategory, updatedcards, contentIsLoading} = this.state;
        console.log('image list updatedcards########', updatedcards)

        return (
            <View>
                <View style={[layoutStyle.container]}>

                    <View style={carouselStyle.container}>
                        <Text style={carouselStyle.title}>{imageCategory}</Text>
                        <TouchableOpacity
                            onPress={() => this.navigateToShowAll(imageCategory)}>
                            <View style={carouselStyle.subtitleContainer}>
                                <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                <Icon
                                    name='chevron-right'
                                    color={colors.secondary2}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <CarouselImages cards={updatedcards} category={imageCategory}
                                    rightTitle="Browse All" contentIsLoading={(!contentIsLoading)}/>

                </View>

            </View>
        )
    }

//
    getChildrenStyle() {
        return {
            width: (SCREEN_WIDTH - 28) / 2,
            height: (SCREEN_WIDTH - 28) / 2 * 1.2,//parseInt(Math.random() * 20 + 12) * 10,
            backgroundColor: colors.secondary2,
            paddingTop: 20,
            borderRadius: 8,

        };
    }

    getAutoResponsiveProps() {
        return {
            itemMargin: 8,
        };
    }

    renderChildren() {
        const {updatedcards} = this.state

        return updatedcards.map((image, key) => {
            console.log('image.illustration', image.illustration)
            return (
                <View style={this.getChildrenStyle()} key={key}>
                    <Text>{image.title}</Text>
                    <ImageBackground
                        source={{uri: image.illustration}}
                        style={this.getChildrenStyle()}

                    />
                </View>
            );
        }, this);
    }

    onPressTitle = () => {
        this.setState({
            array: [...this.state.array, parseInt(Math.random() * 30)],
        });
    }
    //
    componentWillReceiveProps(nextProps) {
        var isConnected = nextProps.screenProps.isConnected;//update netinfo
        if (this.props.screenProps.isConnected == false && isConnected == true) {
            this.resetAnimation();
        }

    }


    render() {
        var isConnected = this.props.screenProps.isConnected;

        if (!isConnected) {
            return Utils.renderOffline();
        }
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });


        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -50],
            extrapolate: 'clamp',
        });

        const bannerOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp',
        });
        const buttons = [{element: component1}, {element: component2}]
        const {selectedIndex, imageCategory} = this.state
        return (
            <View style={[layoutStyle.container, layoutStyle.maskLoader]} key={this.state.rootKey}>
                <Loader
                    isLoaded={this.state.appReady}
                    imageSource={this.maskImage}
                    backgroundStyle={layoutStyle.loadingBackgroundStyle}
                >
                    <ScrollView
                        style={carouselStyle.scrollView}

                        directionalLockEnabled={true}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{nativeEvent: {contentOffset: {y: this.state.scrollY}}}]
                        )}
                    >

                        <View style={exploreStyle.scrollViewContent}>
                            <ButtonGroup
                                onPress={this.updateIndex}
                                selectedIndex={selectedIndex}
                                buttons={buttons}
                                containerStyle={{height: 40}}/>
                            <View style={{paddingHorizontal: 10,}}>
                                <AutoResponsive {...this.getAutoResponsiveProps()} >
                                    {this.renderChildren()}
                                </AutoResponsive>
                                {/*{this.renderImageList()}*/}
                            </View>
                        </View>

                    </ScrollView>


                    <Animated.View style={[exploreStyle.header, {height: headerHeight}]}>
                        <Animated.View
                            style={[
                                exploreStyle.backgroundImage,
                                {opacity: imageOpacity, transform: [{translateY: imageTranslate}]},
                            ]}
                        >
                            <Text style={{
                                color: colors.white,
                                fontSize: 18,
                                paddingHorizontal: 10
                            }}>New</Text>
                            {this.renderBanner(this.state.latestImages)}

                        </Animated.View>
                        <Animated.View>
                            <View style={exploreStyle.bar}>
                                <Animated.View style={[exploreStyle.showBanner, {opacity: bannerOpacity,}]}>
                                    <Text style={[exploreStyle.title]}>
                                        It's Ok to want them all!</Text>
                                    <Icon
                                        raised
                                        name='key'
                                        type='font-awesome'
                                        color={colors.primary3}
                                        size={22}
                                        onPress={this.navigateToUnLock}/>
                                </Animated.View>


                            </View>

                        </Animated.View>
                    </Animated.View>

                </Loader>
            </View>
        );
    }
}

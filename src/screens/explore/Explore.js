import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ImageBackground,
    ScrollView,
    Linking,
    Alert,
    Animated,
    ActivityIndicator
} from 'react-native';
import {
    Icon,
    Avatar,
} from 'react-native-elements';
import VersionCheck from 'react-native-version-check';

import Carousel from 'react-native-snap-carousel';
import Loader from 'react-native-mask-loader';
import Placeholder from 'rn-placeholder';
import {I18n} from '../../config/language/I18n';

import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';
import carouselStyle from '../../styles/carousel';
import exploreStyle from '../../styles/explore';

import {sliderWidth, itemWidth} from '../../styles/sliderEntry';
import {HEADER_SCROLL_DISTANCE, HEADER_MIN_HEIGHT, HEADER_MAX_HEIGHT} from '../../styles/explore';

import SliderEntry from '../../components/SliderEntry';
import  logo from '../../assets/images/logo.png';

import {
    getUpdatedImages
} from '../../utils/FetchImagesByApi';
import {
    upDateRole
} from '../../utils/AppPay';

import  Utils from '../../utils/utils';
import CategoryConfig from '../../config/CategoryConfig';

const downloadUrl = 'https://itunes.apple.com/us/app/cardmaker-app/id1318023993?mt=8';
const words = [
    {
        width: '60%',
    },
    {
        width: '40%',
    },
];


export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            appReady: false,
            rootKey: Math.random(),
            connectionInfo: this.props.screenProps.connectionInfo,
            scrollY: new Animated.Value(0),
            latestImages: [],
            updatedcards: [],
            updatedinvitations: [],
            updatedgallery: [],
            loading: false,
            contentIsLoading: true,
        };
        this.maskImage = logo;
    }


    fetchUpdatedImages = (catergory, showImagesNumber) => {
        return new Promise(function (resolve, reject) {
            // some async operation here
            setTimeout(function () {
                // resolve the promise with some value
                getUpdatedImages(catergory, showImagesNumber).then(function (images) {
                    resolve(images);
                });
            }, 500);
        });
    }

    navigateToShowAll = (category, showSample) => (e) => {
        this.props.navigation.navigate('ImagesGallery', {
            category: category,
            showSample: showSample,
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
    onScrollLoad = (e) => {
        var offsetY = e.nativeEvent.contentOffset.y, self = this;
        if (offsetY <= -HEADER_MAX_HEIGHT) {
            this.setState({loading: true});

            Promise.all([
                this.fetchUpdatedImages('cards', CategoryConfig.showImagesNumber),
                this.fetchUpdatedImages('invitations', CategoryConfig.showImagesNumber),
                this.fetchUpdatedImages('gallery', CategoryConfig.showImagesNumber)
            ]).then(function ([data1, data2, data3]) {
                let latestCardImages = data1.slice(0, CategoryConfig.showLatestImagesNumber);
                let latestInvitationImages = data2.slice(0, CategoryConfig.showLatestImagesNumber);
                let latestImages = latestCardImages.concat(latestInvitationImages);
                self.setState({
                    latestImages: latestImages,
                    updatedcards: data1,
                    updatedinvitations: data2,
                    updatedgallery: data3,
                    loading: false
                })

            });
        }
    }


    componentWillMount() {
        VersionCheck.needUpdate()
            .then(async res => {
                if (res.isNeeded) {
                    this.showAlert();
                }
            });

    }

    componentDidMount() {
        var self = this;

        //promise all
        Promise.all([
            this.fetchUpdatedImages('cards', CategoryConfig.showImagesNumber),
            this.fetchUpdatedImages('invitations', CategoryConfig.showImagesNumber),
            this.fetchUpdatedImages('gallery', CategoryConfig.showImagesNumber)
        ]).then(function ([data1, data2, data3]) {
            let latestCardImages = data1.slice(0, CategoryConfig.showLatestImagesNumber);
            let latestInvitationImages = data2.slice(0, CategoryConfig.showLatestImagesNumber);
            let latestImages = latestCardImages.concat(latestInvitationImages)

            self.setState({
                latestImages: latestImages,
                updatedcards: data1,
                updatedinvitations: data2,
                updatedgallery: data3,
            })

        });

        this.setState({
            contentIsLoading: true
        });

        setTimeout(() => {
            this.setState({contentIsLoading: false});
        }, 3000);
        this.resetAnimation();
    }

    componentWillUnmount() {
        this.setState({
            updatedcards: [],
            updatedinvitations: [],
            updatedgallery: []
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

    onUnLock = () => {
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});

    }

    renderItem = (resizeMode) => ({item, index}) => {
        return <SliderEntry resizeStyle={resizeMode} data={item} even={(index + 1) % 2 === 0}/>;
    }

    renderCarousel = (data, isLoaded, resizeStyle) => {
        const heightStyle = {height: 340};

        return (
            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>
                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <Carousel
                        data={data}
                        renderItem={this.renderItem(resizeStyle)}
                        sliderWidth={sliderWidth}
                        itemWidth={itemWidth}
                        inactiveSlideScale={0.95}
                        inactiveSlideOpacity={1}
                        enableMomentum={true}
                        activeSlideAlignment={'start'}
                        containerCustomStyle={carouselStyle.slider}
                        contentContainerCustomStyle={carouselStyle.sliderContentContainer}
                        activeAnimationType={'spring'}
                        activeAnimationOptions={{
                            friction: 4,
                            tension: 40
                        }}
                    />
                </Placeholder.MultiWords>
            </View>
        );
    }

    renderBanner = (data, isLoaded) => {
        const heightStyle = {height: 50};

        return (
            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>

                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <View style={{flexDirection: 'row', alignItems: 'flex-end',}}>
                        {data.map((image, index) => (
                            <View
                                key={index}
                                style={{
                                    flex: 1, marginHorizontal: 5,
                                    justifyContent: 'center',
                                    borderWidth:4, borderColor: colors.grey0,
                                    backgroundColor:colors.white
                                }}>
                                <Avatar
                                    overlayContainerStyle={{backgroundColor:colors.white  }}
                                    imageProps={{"resizeMode":'contain'}}
                                    large
                                    source={{uri: image.illustration}}
                                    activeOpacity={0.7}
                                />
                            </View>))}
                    </View>
                </Placeholder.MultiWords>
            </View>

        );
    }

    componentWillReceiveProps(nextProps) {
        var isConnected = nextProps.screenProps.isConnected;//update netinfo
        if (this.props.screenProps.isConnected == false && isConnected == true) {
            this.resetAnimation();
        }

    }


    render() {
        var isConnected = this.props.screenProps.isConnected;
        const {updatedcards, updatedinvitations, updatedgallery, contentIsLoading} = this.state;

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
          [{ nativeEvent: { contentOffset: {y: this.state.scrollY }, }, }, ],
          { listener: this.onScrollLoad, }
        )}
                    >
                        {this.state.loading ?
                            <View style={[layoutStyle.container,{ alignSelf: 'center',
                        justifyContent: 'center',}]}>
                                <ActivityIndicator size="large" color={colors.secondary2}/>
                            </View>
                            : null}
                        <View style={[layoutStyle.container, exploreStyle.scrollViewContent]}>
                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{I18n.t('exploreTab.cardsTitleTranslation')}
                                </Text>
                                <TouchableOpacity onPress={this.navigateToShowAll('cards',false)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text
                                            style={carouselStyle.subtitle}>{I18n.t('exploreTab.browseAllTranslation')}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(updatedcards, (!contentIsLoading), false)}
                        </View>
                        <View style={layoutStyle.container}>
                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{I18n.t('exploreTab.invitationsTranslation')}</Text>
                                <TouchableOpacity onPress={this.navigateToShowAll('invitations',false)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text
                                            style={carouselStyle.subtitle}>{I18n.t('exploreTab.browseAllTranslation')}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(updatedinvitations, (!contentIsLoading), true)}
                        </View>
                        <View style={layoutStyle.container}>
                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{I18n.t('exploreTab.samplegalleryTranslation')}</Text>
                                <TouchableOpacity onPress={this.navigateToShowAll('',true)}>
                                    <View style={carouselStyle.subtitleContainer}>
                                        <Text
                                            style={carouselStyle.subtitle}>{I18n.t('exploreTab.browseAllTranslation')}</Text>
                                        <Icon
                                            name='chevron-right'
                                            color={colors.secondary2}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(updatedgallery, (!contentIsLoading), true)}
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
                            }}>{I18n.t('exploreTab.newTitleTranslation')}</Text>
                            {this.renderBanner(this.state.latestImages, (!this.state.contentIsLoading))}
                        </Animated.View>
                        <Animated.View>
                            <View style={exploreStyle.bar}>
                                <Animated.View style={[exploreStyle.showBanner, {opacity: bannerOpacity,}]}>
                                    <Text style={[exploreStyle.title]}>
                                        {I18n.t('exploreTab.tipTranslation')}
                                    </Text>
                                    <Icon
                                        raised
                                        name='key'
                                        type='font-awesome'
                                        color={colors.primary3}
                                        size={22}
                                        onPress={this.onUnLock}/>
                                </Animated.View>
                            </View>
                        </Animated.View>
                    </Animated.View>
                </Loader>
            </View>
        );
    }
}
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
    Dimensions
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Loader from 'react-native-mask-loader';
import Placeholder from 'rn-placeholder';

import layoutStyle from '../styles/layout';
import carouselStyle from '../styles/carousel';
import {sliderWidth, itemWidth} from '../styles/sliderEntry';

import SliderEntry from '../components/SliderEntry';
import  logo from '../assets/images/logo.png';
import {
    getFreeBirthdayImages,
    getFreeHolidayImages,
    getFreeWeddingImages,
    getFreeOtherImages,
    getAllBirthdayImages,

} from '../utils/FetchImagesByApi';

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
            birthdayImages: [],
            holidayImages: [],
            weddingImages: [],
            otherImages: [],
            appReady: false,
            rootKey: Math.random(),
        };
        this.maskImage = logo;
    }

    _renderItem({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
    }

    renderCarousel = (data, title, subtitle, isLoaded) => {
        const heightStyle = {height: 150};

        return (

            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>
                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <Carousel
                        data={data}
                        renderItem={this._renderItem}
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
    fetchBirthdayImages = () => {
        var self = this;
        getAllBirthdayImages().then(function (images) {
            self.setState({birthdayImages: images});
        });
    }

    fetchHolidayImages = () => {
        var self = this;
        getFreeHolidayImages().then(function (images) {
            self.setState({holidayImages: images});
        });
    }
    fetchWeddingImages = () => {
        var self = this;
        getFreeWeddingImages().then(function (images) {
            self.setState({weddingImages: images});
        });
    }
    fetchOtherImages = () => {
        var self = this;
        getFreeOtherImages().then(function (images) {
            self.setState({otherImages: images});
        });
    }

    componentWillMount() {
        this.fetchBirthdayImages();
        this.fetchHolidayImages();
        this.fetchWeddingImages();
        this.fetchOtherImages();
        this.setState({
            contentIsLoading: true
        });

        setTimeout(() => {
            this.setState({contentIsLoading: false});
        }, 4000);
    }

    componentDidMount() {

        // this.fetchPaidImages();
        this.resetAnimation();


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

    navigateToShowAll = (cardType) => {
        this.props.navigation.navigate('CardsDeck', {cardType: cardType, editing: false});
    }

    render() {

        return (
            <View style={[layoutStyle.container, layoutStyle.maskLoader]} key={this.state.rootKey}>
                <Loader
                    isLoaded={this.state.appReady}
                    imageSource={this.maskImage}
                    backgroundStyle={layoutStyle.loadingBackgroundStyle}
                >
                    <ScrollView
                        style={carouselStyle.scrollView}
                        scrollEventThrottle={200}
                        directionalLockEnabled={true}>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Birthday'}</Text>
                                <TouchableOpacity onPress={() => this.navigateToShowAll('birthday')}>
                                    <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                                </TouchableOpacity>
                            </View>
                            {this.renderCarousel(this.state.birthdayImages, 'Birthday', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Holidays'}</Text>
                                <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                            </View>
                            {this.renderCarousel(this.state.holidayImages, 'Holidays', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Wedding'}</Text>
                                <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                            </View>
                            {this.renderCarousel(this.state.weddingImages, 'Wedding', 'Browse All', (!this.state.contentIsLoading))}
                        </View>

                        <View style={layoutStyle.container}>

                            <View style={carouselStyle.container}>
                                <Text style={carouselStyle.title}>{'Others'}</Text>
                                <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                            </View>
                            {this.renderCarousel(this.state.otherImages, 'Others', 'Browse All', (!this.state.contentIsLoading))}
                        </View>
                    </ScrollView>
                </Loader>
            </View>


        );
    }
}

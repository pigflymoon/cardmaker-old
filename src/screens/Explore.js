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

import layoutStyle from '../styles/layout';
import carouselStyle from '../styles/carousel';
import {sliderWidth, itemWidth} from '../styles/sliderEntry';

import SliderEntry from '../components/SliderEntry';

import {getFreeBirthdayImages, getFreeHolidayImages, getFreeWeddingImages,getFreeOtherImages} from '../utils/FetchImagesByApi';


export const ENTRIES1 = [
    {
        title: 'Beautiful and dramatic Antelope Canyon',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/UYiroysl.jpg'
    },
    {
        title: 'Earlier this morning, NYC',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
    },
    {
        title: 'White Pocket Sunset',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
        illustration: 'https://i.imgur.com/MABUbpDl.jpg'
    },
    {
        title: 'Acrocorinth, Greece',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
    },
    {
        title: 'The lone tree, majestic landscape of New Zealand',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
    },
    {
        title: 'Middle Earth, Germany',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/lceHsT6l.jpg'
    }
];
export const ENTRIES2 = [
    {
        title: 'Favourites landscapes 1',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
    },
    {
        title: 'Favourites landscapes 2',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
    },
    {
        title: 'Favourites landscapes 3',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat',
        illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
    },
    {
        title: 'Favourites landscapes 4',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/cA8zoGel.jpg'
    },
    {
        title: 'Favourites landscapes 5',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/pewusMzl.jpg'
    },
    {
        title: 'Favourites landscapes 6',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat',
        illustration: 'https://i.imgur.com/l49aYS3l.jpg'
    }
];
export const ENTRIES3 = [
    {
        title: 'Favourites landscapes 1',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/SsJmZ9jl.jpg'
    },
    {
        title: 'Favourites landscapes 2',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/5tj6S7Ol.jpg'
    },
    {
        title: 'Favourites landscapes 3',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat',
        illustration: 'https://i.imgur.com/pmSqIFZl.jpg'
    },
    {
        title: 'Favourites landscapes 4',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
        illustration: 'https://i.imgur.com/cA8zoGel.jpg'
    },
    {
        title: 'Favourites landscapes 5',
        subtitle: 'Lorem ipsum dolor sit amet',
        illustration: 'https://i.imgur.com/pewusMzl.jpg'
    },
    {
        title: 'Favourites landscapes 6',
        subtitle: 'Lorem ipsum dolor sit amet et nuncat',
        illustration: 'https://i.imgur.com/l49aYS3l.jpg'
    }
];
const {width, height} = Dimensions.get('window');
export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            birthdayImages: [],
            holidayImages: [],
            weddingImages: [],
            otherImages:[],
        }
    }

    _renderItem({item, index}) {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
    }

    renderCarousel = (data, title, subtitle) => {
        return (
            <View style={[carouselStyle.carouselContainer]}>
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
            </View>
        );
    }
    fetchBirthdayImages = () => {
        var self = this;
        getFreeBirthdayImages().then(function (images) {
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

    componentDidMount() {
        this.fetchBirthdayImages();
        this.fetchHolidayImages();
        this.fetchWeddingImages();
        this.fetchOtherImages();
        // this.fetchPaidImages();

    }

    render() {

        return (
            <View style={layoutStyle.container}>
                <ScrollView
                    style={carouselStyle.scrollview}
                    scrollEventThrottle={200}
                    directionalLockEnabled={true}>
                    <View style={layoutStyle.container}>

                        <View style={carouselStyle.container}>
                            <Text style={carouselStyle.title}>{'Birthday'}</Text>
                            <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                        </View>
                        {this.renderCarousel(this.state.birthdayImages, 'Birthday', 'Browse All')}
                    </View>
                    <View style={layoutStyle.container}>

                        <View style={carouselStyle.container}>
                            <Text style={carouselStyle.title}>{'Holidays'}</Text>
                            <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                        </View>
                        {this.renderCarousel(this.state.holidayImages, 'Holidays', 'Browse All')}
                    </View>
                    <View style={layoutStyle.container}>

                        <View style={carouselStyle.container}>
                            <Text style={carouselStyle.title}>{'Wedding'}</Text>
                            <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                        </View>
                        {this.renderCarousel(this.state.weddingImages, 'Wedding', 'Browse All')}
                    </View>

                    <View style={layoutStyle.container}>

                        <View style={carouselStyle.container}>
                            <Text style={carouselStyle.title}>{'Others'}</Text>
                            <Text style={carouselStyle.subtitle}>{'Browse All'}</Text>
                        </View>
                        {this.renderCarousel(this.state.otherImages, 'Others', 'Browse All')}
                    </View>
                </ScrollView>
            </View>


        );
    }
}

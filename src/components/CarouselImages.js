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


import Carousel from 'react-native-snap-carousel';
import Placeholder from 'rn-placeholder';
import SliderEntry from '../components/SliderEntry';

import carouselStyle from '../styles/carousel';

import {sliderWidth, itemWidth} from '../styles/sliderEntry';
const words = [

    {
        width: '60%',
    },
    {
        width: '40%',
    },
];

export default class CarouselImages extends Component {
    constructor(props, context) {
        super(props, context);
        console.log('this.props.cards',this.props.cards)
        this.state = {
            updatedCards: this.props.cards,
            category: this.props.category,
            words: this.props.rightTitle,
            isLoaded: this.props.contentIsLoading
        }
    }

    componentWillReceiveProps(nextProps) {
        console.log('nextPropscards',nextProps.cards);
        this.setState({updatedCards: nextProps.cards, isLoaded: nextProps.contentIsLoading});
    }

    renderItem = ({item, index}) => {
        return <SliderEntry data={item} even={(index + 1) % 2 === 0}/>;
    }

    render() {
        const {updatedCards, isLoaded} = this.state
        console.log('updatedcards :',updatedCards)

        const heightStyle = {height: 150};

        return (
            <View style={[carouselStyle.carouselContainer, !isLoaded && heightStyle]}>
                <Placeholder.MultiWords onReady={isLoaded} words={words} animate="fade">
                    <Carousel
                        data={updatedCards}
                        renderItem={this.renderItem}
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
}
import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, TouchableOpacity} from 'react-native';

import {Button, Card, Icon, ButtonGroup} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';
import {
    getAllImages,
    getFreeImages,
} from '../utils/FetchImagesByApi';

import colors from '../styles/colors';
import layoutStyle from '../styles/layout';
import cardStyle from '../styles/card';

const component1 = () => <Text>Hello</Text>
const component2 = () => <Text>World</Text>
const component3 = () => <Text>ButtonGroup</Text>

export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            selectedIndex: 2,
            index: 0,

            // likedCards: [],
            // dislikedCards: [],
        }
    }

    // updateIndex = (selectedIndex) => {
    //     console.log('selectedIndex', selectedIndex)
    //     // this.setState({selectedIndex})
    // }

    updateIndex = (selectedIndex) => {
        console.log('selectedIndex', selectedIndex)

        this.setState({selectedIndex:selectedIndex})
    }

    render() {
        const buttons = [{element: component1}, {element: component2}, {element: component3}]
        const {selectedIndex} = this.state
        return (
            <View style={layoutStyle.container}>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 100}}/>
            </View>
        );
    }
}


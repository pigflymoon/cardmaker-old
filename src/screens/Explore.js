import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
} from 'react-native';

import layoutStyle from '../styles/layout';

export default class Explore extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {}
    }


    renderCards() {
        return (
            <View><Text>Explore</Text></View>
        );
    }

    render() {
        return (
            <View style={layoutStyle.container}>
                {this.renderCards()}

            </View>
        );
    }
}

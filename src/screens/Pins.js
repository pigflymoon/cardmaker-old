import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';



import layoutStyle from '../styles/layout';

export default class Pins extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {


        }
    }



    render() {
        return (
            <View style={layoutStyle.container}>
               <Text>Pins</Text>

            </View>
        );
    }
}

import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';



import layoutStyle from '../styles/layout';

export default class Boards extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {


        }
    }



    render() {
        return (
            <View style={layoutStyle.container}>
               <Text>Boards</Text>

            </View>
        );
    }
}

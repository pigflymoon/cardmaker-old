import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements'

import layoutStyle from '../styles/layout';
import colors from '../styles/colors';

export default class MakeCards extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            likedCards: [],
        }
    }

    componentWillMount() {
        navigator = this.props.navigator;
    }

    componentDidMount() {
        console.log('*************likedCards*********', this.props)
        //

        if (this.props.likedCards && this.props.likedCards.length > 0) {
            console.log('likedCards ', this.props.likedCards)
            this.setState({likedCards: this.props.likedCards});
        }
    }

    render() {
        if (this.state.likedCards.length < 1) {
            return (
                <View style={layoutStyle.container}>
                    <Text>Please Choose your cards</Text>
                </View>
            );
        }
        return (
            <View style={layoutStyle.container}>
                <Text>Card Maker</Text>
                {this.state.likedCards.map((card, index) => (
                    <View key={`card-${index}`}>

                        <Image
                            style={{width: 200, height: 150}}
                            source={{uri:card.uri}}/>
                    </View>
                ))}

            </View>
        );
    }
}

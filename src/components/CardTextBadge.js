import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,

} from 'react-native';
import {
    Badge,
} from 'react-native-elements';

import colors from '../styles/colors';


export default class CardTextBadge extends Component {


    constructor(props) {
        super(props)
    }

    render() {
        console.log('selected is ,', this.props.selected)
        return (
            <Badge containerStyle={{backgroundColor: 'violet'}}
                   textStyle={{color: this.props.selected ? colors.white : colors.grey0}}
                   value={this.props.label}
                   onPress={this.props.onPress}
            >

            </Badge>


        );
    }


}
import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements'

import layoutStyle from '../styles/layout';
import colors from '../styles/colors';

export default class Settings extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {


        }
    }

    componentWillMount() {
        navigator = this.props.navigator;
    }


    render() {

        return (
            <View style={layoutStyle.container}>
                <List>
                    <ListItem
                        leftIcon={{name: 'chat', color: colors.grey2}}
                        title={`Tell a friend`}

                    />
                    <ListItem
                        leftIcon={{name: 'chat', color: colors.grey2}}
                        title={`Tell a friend`}

                    />
                </List>
            </View>
        );
    }
}

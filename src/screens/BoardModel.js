import React, {Component} from 'react';
import {StyleSheet, View,ScrollView, Platform, TouchableOpacity,} from 'react-native';
import {List, ListItem,} from 'react-native-elements';

import listStyle from '../styles/list';
import bg1 from '../assets/images/bg1.jpg';

export default class BoardModel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',

        };
    }


    render() {
        return (
            <ScrollView>

                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        avatar={bg1}
                        title={`Board1`}
                        hideChevron
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        avatar={bg1}
                        title={`Board2`}
                        hideChevron
                    />

                </List>

            </ScrollView>
        );
    }
}



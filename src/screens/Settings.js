import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    AppState,
    Picker,
    Platform,
    AsyncStorage,
    Item,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    Image,
} from 'react-native';
import {List, ListItem, Card, Tile, Icon, Button} from 'react-native-elements';

import {NativeModules} from 'react-native';


import colors from '../styles/colors';
import listStyle from '../styles/list';

export default class Settings extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            version: '1.0',
            isPro: 'DISABLED',
            showUsgs: false,//remove in-purchase

        };

    }


    onAbout = () => {
        this.props.navigation.navigate('About', {});
    };
    onProversion = () => {
        this.props.navigation.navigate('Proversion', {});
    };

    onResources = () => {
        this.props.navigation.navigate('Resources', {});
    };

    titleStyle = () => {
        const {showUsgs} = this.state;
        if (showUsgs) {
            return {
                color: colors.green
            }
        } else {
            return {
                color: colors.red
            }
        }

    }

    render() {
        return (
            <ScrollView>
                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.grey2}}
                        title={`PRO Version`}
                        titleStyle={this.titleStyle()}
                        rightTitle={this.state.isPro}
                        rightTitleStyle={this.titleStyle()}
                        hideChevron
                        onPress={() => {
                            this.onPay()
                        }}
                    />

                </List>
                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'description', color: colors.grey2}}
                        title={`Resources`}
                        onPress={() => this.onResources()}
                    />

                </List>

                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'chat', color: colors.grey2}}
                        title={`Tell a friend`}
                        onPress={() => this.onShare()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.grey2}}
                        title={`Rate us`}
                        onPress={() => this.onRate()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'info', color: colors.grey2}}
                        title={`About`}
                        onPress={() => this.onAbout()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'perm-device-information', color: colors.grey2}}
                        title={`Version`}
                        subtitle={this.state.version}
                    />
                </List>

            </ScrollView>
        )
    }

}

import React, {Component} from 'react';

import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';

import MainTabs from './src/MainTabs';

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            signin: false,

        };

    }
    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        if (route.routes) {
            return this.getCurrentRouteName(route);
        }
        return route.routeName;
    }


    render() {
        return (<MainTabs
                screenProps={{
                    signin: this.state.signin,
                    currentScreen: this.state.currentScreen,

                }}
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = this.getCurrentRouteName(currentState);
                    const prevScreen = this.getCurrentRouteName(prevState);
                    if (prevScreen !== currentScreen) {
                        this.setState({currentScreen: currentScreen})
                    }
                }}
            />

        )
    }
}
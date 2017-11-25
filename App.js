import React,{Component} from 'react';

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


    render() {
        return (<MainTabs
                screenProps={{
                    signin: this.state.signin,

                }}


            />

        )
    }
}
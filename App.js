/* @flow */

import React from 'react';

import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
} from 'react-native';
import { StackNavigator } from 'react-navigation';


import MainTabs from './js/MainTabs';



const AppNavigator = StackNavigator(
    {
        Index: {
            screen: MainTabs,
        },
    },
    {
        initialRouteName: 'Index',
        headerMode: 'none',

        /*
         * Use modal on iOS because the card mode comes from the right,
         * which conflicts with the drawer example gesture
         */
        mode: Platform.OS === 'ios' ? 'modal' : 'card',
    }
);

export default () => <AppNavigator />;

const styles = StyleSheet.create({
    item: {
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#ddd',
    },
    image: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 20,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#444',
    },
    description: {
        fontSize: 13,
        color: '#999',
    },
});

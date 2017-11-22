import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Linking,
    Share,
} from 'react-native';
export default class Utils {

    static shareText = (message, url) => {
        var shareText = {
            title: 'QuakeChat-Chat,share and help',
            message: message,
            url: url,

        };
        Share.share(shareText, {
            // Android only:
            dialogTitle: 'CardMaker',
            // iOS only:

        })
    }

}
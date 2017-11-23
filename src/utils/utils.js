import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Linking,
} from 'react-native';
import Share, {ShareSheet, Button} from 'react-native-share';
export default class Utils {

    static shareText = (message, url, imageUrl) => {
        var shareText = {
            title: 'QuakeChat-Chat,share and help',
            message: message,
            url: url,
            image: imageUrl,


        };
        Share.share(shareText, {
            // Android only:
            dialogTitle: 'CardMaker',
            // iOS only:

        })
    }

    static shareImage = (imageUrl,message,caption) => {
        if (imageUrl) {
            let shareImageBase64 = {
                title: caption,
                message: message,
                url: imageUrl,//"http://facebook.github.io/react-native/",
                // url: imageUrl,
                subject: caption //  for email
            };
            Share.open(shareImageBase64).catch(err => console.log(err));
        }

    }

}
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Linking,
    Share as NativeShare,
} from 'react-native';
import Share  from 'react-native-share';

export default class Utils {
    static goToURL = (url) => {
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Alert.alert(
                    'Network unavailable',
                    'Don\'t know how to open URI:  ${ url}',
                    [
                        {text: 'OK'},
                    ],
                    {cancelable: false}
                )

            }
        });
    }
    static shareText = (message, url) => {
        var shareText = {
            title: 'Cardmaker App,love and share!',
            message: message,
            url: url,
            // image: imageUrl,


        };
        NativeShare.share(shareText, {
            // Android only:
            dialogTitle: 'Cardmaker App',
            // iOS only:

        })
    }

    static shareImage = (imageUrl, message, caption) => {
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

    static getRandomColor = () => {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    static reverseObject = (object) => {
        var newObject = {};
        var keys = [];

        for (var key in object) {
            keys.push(key);
        }

        for (var i = keys.length - 1; i >= 0; i--) {
            var value = object[keys[i]];
            newObject[keys[i]] = value;
        }

        return newObject;
    }

}
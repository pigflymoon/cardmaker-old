import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    Linking,
    Share as NativeShare,
    ImageBackground
} from 'react-native';
import Share  from 'react-native-share';
import showInfo from '../styles/showInfo';
import bg from '../assets/images/noWifiBg.png';

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

    static shareImage = (catergory, imageUrl, message, caption) => {
        if (imageUrl) {
            let shareImageBase64 = {
                title: caption,//string
                message: message,//string
                url:imageUrl,// ['http://img.gemejo.com/product/8c/099/cf53b3a6008136ef0882197d5f5.jpg', imageUrl],
                subject: caption // string  for email
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

    static netWorkError = () => {
        Alert.alert(
            'Network unavailable',
            `The Internet connection appears to be offline!!!`,
            [
                {text: 'OK'},
            ],
            {cancelable: false}
        )
    }

    static validateEmail = (email) => {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
    }

    static isEmptyObject = (obj) => Object.keys(obj).length === 0 && (obj).constructor === Object

    static renderOffline = () => {
        return (
            <ImageBackground
                source={bg}
                style={{
                    flex: 1,
                    width: null,
                    height: 400,
                }}
            >
                <View style={showInfo.container}><Text style={showInfo.text}>Offline: Cannot Connect to
                    App.</Text></View>
            </ImageBackground >

        )
    }
}
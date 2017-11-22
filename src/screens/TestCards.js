import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, Image,} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';

import {Button, Card, Icon,} from 'react-native-elements';


import colors from '../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

// test data
const DATA = [
    {id: 1, text: 'Emma', age: 29, uri: 'https://i.imgur.com/FHxVpN4.jpg'},
    {
        id: 2,
        text: 'Jennifer',
        age: 24,
        uri: 'https://2.bp.blogspot.com/-Vy0NVWhQfKo/Ubma2Mx2YTI/AAAAAAAAH3s/LC_u8LRfm8o/s1600/aimee-teegarden-04.jpg',
    },
    {
        id: 3,
        text: 'Sarah',
        age: 28,
        uri: 'https://s-media-cache-ak0.pinimg.com/736x/41/75/26/4175268906d97492e4a3175eab95c0f5.jpg',
    },
];

export default class TestCards extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            showSignCard: false,

        }
    }

    convertImage = () => {
        var self = this;
        const image = 'https://s-media-cache-ak0.pinimg.com/736x/41/75/26/4175268906d97492e4a3175eab95c0f5.jpg';
        let imagePath = null;
        let mimeBase64 = 'data:image/png;base64,'
        const fs = RNFetchBlob.fs;

        RNFetchBlob.config({
            fileCache: true
        }).fetch('GET', image)
        // the image is now dowloaded to device's storage
            .then((resp) => {
                // the image path you can use it directly with Image component
                imagePath = resp.path();


                return resp.readFile('base64')
            })
            .then((base64Data) => {
                // here's base64 encoded image
                console.log(`data:image/png;base64,` + base64Data)
                self.setState({image: mimeBase64 + base64Data})

                // remove the file from storage
                return fs.unlink(imagePath)
            })
    }


    componentDidMount() {
        //

    }


    renderHeader() {
        return (
            <View style={styles.header}>
                {this.state.showSignCard ?
                    <View style={styles.headerLeftIcon}>
                        <Icon name="user" type="font-awesome" color="#ccc" size={35}/>
                    </View> : null}
                <View style={styles.headerCenter}>
                    <Text>Test cards</Text>
                </View>
                <View style={styles.headerRightIcon}>
                    <Icon name="shopping-bag" type="font-awesome" color={colors.primary1} size={35}
                          onPress={this.convertImage}
                    />
                    <Image style={{height: 50, width: 200}}

                           source={{uri: this.state.image}}

                           resizeMode='cover'/>
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.deck}>
                    <Text></Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    header: {
        height: 64,
        paddingTop: 35,
        flexDirection: 'row',
    },
    headerLeftIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 15,
    },
    headerCenter: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerCenterToggleContainer: {
        flexDirection: 'row',
        width: 160,
        height: 45,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    headerCenterToggleLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        borderRadius: 30,
    },
    headerCenterToggleRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    deck: {
        flex: 1,
    },
    footer: {
        height: 64,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    footerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 10,
    },
});



import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, Image,} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
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
            image: 'https://i.imgur.com/FHxVpN4.jpg'

        }
    }



    componentDidMount() {
        //

    }





    handleImageRect(canvas, text) {
        const image = new CanvasImage(canvas);
        canvas.width = SCREEN_WIDTH;
        canvas.height = 400;

        const context = canvas.getContext('2d');

        image.src = 'https://image.freepik.com/free-vector/unicorn-background-design_1324-79.jpg';
        // image.src = 'https://s-media-cache-ak0.pinimg.com/736x/41/75/26/4175268906d97492e4a3175eab95c0f5.jpg';

        image.addEventListener('load', () => {
            console.log('image is loaded');

            var originalWidth = image.width;
            var originalHeight = image.height;
            var newWidth = canvas.width;
            var newHeight = (newWidth / originalWidth) * originalHeight;
            console.log('originalWidth,  originalHeight', originalWidth, originalHeight)
            console.log('newWidth,  newHeight', newWidth, newHeight)

            context.drawImage(image, 0, 0, newWidth, newHeight)


            context.font = "30px Arial";
            context.strokeText(text, canvas.width - 160, canvas.height - 50);
            canvas.toDataURL().then((dataUrl) => {
                return dataUrl;
            }).catch((error) => {
                console.error(error);
            }).done();

        });
    }

    drawCanvas = () => {
        var canvas = this.refs.canvasImage;
        var text = 'Hello,duck';
        this.handleImageRect(canvas, text)

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
                    <Icon name="download" type="font-awesome" color={colors.primary1} size={35}
                          onPress={this.drawCanvas}
                    />
                    <View>
                        <Canvas ref="canvasImage"/>
                    </View>
                    <View>
                        <Canvas ref='canvas'/>
                    </View>
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



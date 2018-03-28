import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    TouchableHighlight,
    ImageBackground,
} from 'react-native';
import GridView from 'react-native-super-grid';


import boardStyle from '../styles/board';

import layoutStyle from '../styles/layout';
import bg1 from '../assets/images/bg12.jpg';

var boardsTest = [

    {
        id: "-L8-8d7Uxr9jKi0XGeI4_image",
        uri: "http://fakeimg.pl/360x360/222/?text=3",
        name: "catus_poster.jpeg"
    },
    {
        id: "-L8-8d7pQL-t6AMS1Gak_image",
        uri: "http://fakeimg.pl/360x360/222/?text=3",
        name: "lotus_poster.jpeg"
    }
]

export default class Boards extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {

            myBoards: [{
                id: "-L8-8d7Uxr9jKi0XGeI4_image",
                uri: "http://fakeimg.pl/360x360/222/?text=3",
                name: "catus_poster.jpeg"
            },
                {
                    id: "-L8-8d7pQL-t6AMS1Gak_image",
                    uri: "http://fakeimg.pl/360x360/222/?text=3",
                    name: "lotus_poster.jpeg"
                }]
        }
    }


    renderCards() {
        return (
            <GridView
                itemWidth={260}
                items={this.state.myBoards}
                style={boardStyle.gridView}
                renderItem={(item) => (
                    <View style={boardStyle.itemContainer}>
                        <TouchableHighlight onPress={() => this.chooseCard(item)}
                                            underlayColor='#99d9f4'>
                            <View style={boardStyle.boardsContainer}>
                                <View style={[boardStyle.boardContainer, boardStyle.boardContainerLeft]}>
                                    <Image source={bg1} style={boardStyle.leftImage}>

                                    </Image>
                                </View>
                                <View style={[boardStyle.boardContainer, boardStyle.boardContainerRight]}>
                                    <View style={boardStyle.boardRightTopContainer}>
                                        <Image source={bg1} style={boardStyle.rightImage}>
                                        </Image>
                                    </View>
                                    <View style={boardStyle.boardRightBottomContainer}>
                                        <Image source={bg1} style={boardStyle.rightImage}>

                                        </Image>
                                    </View>

                                </View>


                            </View>
                        </TouchableHighlight>
                        <Text style={boardStyle.itemName}>{item.name}</Text>
                    </View>



                )}
            />
        );
    }

    render() {
        return (
            <View style={layoutStyle.container}>
                {this.renderCards()}

            </View>
        );
    }
}

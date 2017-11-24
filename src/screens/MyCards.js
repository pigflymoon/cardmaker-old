import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Image,
    FlatList,
    ScrollView,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';

import SwipeDeck from '../components/SwipeDeck';

import colors from '../styles/colors';
import cardStyle from '../styles/card';
import SuperGrid from 'react-native-super-grid';
var chooseCards = [], makeCards = [];
const items = [
    {
        id: 1,
        uri: 'https://i.imgur.com/FHxVpN4.jpg',
        name: 'TURQUOISE',
        code: '#1abc9c'
    },


];
export default class MyCards extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            showSignCard: false,
            cardsData: chooseCards,
            makeCards: null,
            chooseCards: items,


        }

    }


    componentDidMount() {
        //

    }

    componentWillReceiveProps(nextProps) {
        chooseCards = nextProps.navigation.state.params.likedCards;
        console.log('pass liked cards', chooseCards)
        this.setState({chooseCards: chooseCards});
    }

    chooseCard = (item) => {
        console.log('choose the ', item)
        this.setState({
            makeCards: item,
        })
    }

    gotoMakeCards = () => {
        console.log('this.state.makecards',this.state.makeCards)
        if (this.state.makeCards) {
            this.props.navigation.navigate('MakeCardsTab', {chooseCards: this.state.makeCards});

        } else {
            Alert.alert('Please choose a picture');
        }

    }

    renderHeader() {
        return (
            <View style={cardStyle.header}>
                <View style={cardStyle.headerCenter}>
                    <Text style={cardStyle.title}>Make My Cards</Text>
                </View>
                <View style={cardStyle.headerRightIcon}>
                    <Icon name="card-giftcard" color={colors.primary1} size={35}
                          onPress={this.gotoMakeCards}
                    />
                </View>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <SuperGrid
                    itemWidth={130}
                    items={this.state.chooseCards}
                    style={styles.gridView}
                    renderItem={item => (

                        <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
                            <TouchableHighlight onPress={() => this.chooseCard(item)}>
                                <ImageBackground source={{uri: item.uri}} style={styles.imageContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemCode}>{item.code}</Text>
                                </ImageBackground>
                            </TouchableHighlight>
                        </View>


                    )}
                />
            </View>
        );

    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    imageContainer: {
        height: 130,
        // width: 150,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});



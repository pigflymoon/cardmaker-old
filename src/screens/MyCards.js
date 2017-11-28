import React, {Component} from 'react';
import {
    Text,
    View,
    Alert,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

import GridView from 'react-native-super-grid';
import firebaseApp from '../config/FirebaseConfig';
import {Icon, Card, Button} from 'react-native-elements';

import colors from '../styles/colors';
import cardStyle from '../styles/card';


export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            makeCards: null,
            chooseCards: [],
            signin: false
        }

    }

    componentDidMount() {
        var self = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                self.setState({signin: true})
            } else {
                self.setState({signin: false, chooseCards: []})
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        var chooseCards = nextProps.navigation.state.params.likedCards;
        // var signin = nextProps.navigation.state.params.signin;

        console.log('pass chooseCards cards', chooseCards)


        this.setState({chooseCards: chooseCards});

    }

    chooseCard = (item) => {
        this.setState({
            makeCards: item,
        })
    }

    gotoMakeCards = () => {
        if (this.state.makeCards) {
            this.props.navigation.navigate('MakeCardsTab', {
                chooseCards: this.state.makeCards,
                signin: this.state.signin
            });

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
        var renderCard = ((this.state.chooseCards.length > 0) && this.state.signin);

        return (
            <View style={cardStyle.container}>
                {this.renderHeader()}
                {renderCard ?
                    <GridView
                        itemWidth={130}
                        items={this.state.chooseCards}
                        style={cardStyle.gridView}
                        renderItem={item => (
                            <View style={[cardStyle.itemContainer, {backgroundColor: item.code}]}>
                                <TouchableHighlight onPress={() => this.chooseCard(item)} underlayColor='#99d9f4'>
                                    <ImageBackground source={{uri: item.uri}} style={cardStyle.imageContainer}>
                                        <Text style={cardStyle.itemName}>{item.name}</Text>
                                        <Text style={cardStyle.itemCode}>{item.code}</Text>
                                    </ImageBackground>
                                </TouchableHighlight>
                            </View>


                        )}
                    /> : null}

            </View>
        );

    }
}




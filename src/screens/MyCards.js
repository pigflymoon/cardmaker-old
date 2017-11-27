import React, {Component} from 'react';
import {
    Text,
    View,
    Alert,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

import GridView from 'react-native-super-grid';
import {Icon, Card, Button} from 'react-native-elements';
import firebaseApp from '../config/FirebaseConfig';

import colors from '../styles/colors';
import cardStyle from '../styles/card';
import buttonStyle from '../styles/button';
var chooseCards = [];

export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            makeCards: null,
            chooseCards: null,
            signin: false
        }

    }

    componentDidMount() {
        var self = this;

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                console.log('#########sign in -- My Cards #########', user)
                self.setState({signin: true})
            } else {
                console.log('no user?')
                self.setState({signin: false})
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        chooseCards = nextProps.navigation.state.params.likedCards;
        var signin = nextProps.navigation.state.params.signin;

        // var user = firebaseApp.auth().currentUser;
        var self = this;
        console.log('my cards nextprops,', nextProps)
        console.log('my cards chooseCards,', chooseCards)

        console.log('my cards signin,', signin)

        this.setState({chooseCards: chooseCards, signin: signin});
        console.log('pass chooseCards cards', chooseCards)
    }

    chooseCard = (item) => {
        console.log('choose the ', item)
        this.setState({
            makeCards: item,
        })
    }

    gotoMakeCards = () => {
        console.log('this.state.makecards', this.state.makeCards)
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
        const {params} = this.props.navigation.state;
        console.log('My cards **********(this.state.chooseCards && this.state.signin)********', (this.state.chooseCards && this.state.signin))
        var renderCard = (this.state.chooseCards && this.state.signin);
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




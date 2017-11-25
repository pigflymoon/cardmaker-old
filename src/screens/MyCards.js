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

    navigateToSignin = () => {
        console.log('this.props.navigation', this.props.navigation)
        this.props.navigation.navigate('Signin', {});

    }


    componentWillReceiveProps(nextProps) {
        chooseCards = nextProps.navigation.state.params.likedCards;
        var user = firebaseApp.auth().currentUser;
        var self = this;
        console.log('my cards nextprops,',nextProps)
        if (user) {
            self.setState({chooseCards: chooseCards, signin: true});
        }
        console.log('pass liked cards', chooseCards)
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
            this.props.navigation.navigate('MakeCardsTab', {chooseCards: this.state.makeCards});

        } else {
            Alert.alert('Please choose a picture');
        }

    }

    renderHeader() {
        return ((this.state.signin) ?

                <View style={cardStyle.header}>
                    <View style={cardStyle.headerCenter}>
                        <Text style={cardStyle.title}>Make My Cards</Text>
                    </View>
                    <View style={cardStyle.headerRightIcon}>
                        <Icon name="card-giftcard" color={colors.primary1} size={35}
                              onPress={this.gotoMakeCards}
                        />
                    </View>
                </View> :
                <Card title='Welcome to cardmaker'>
                    <Text style={{marginBottom: 10}}>
                        Please sign in to make your lovely card. Have fun!
                    </Text>
                    <Button
                        icon={{name: 'perm-identity'}}
                        buttonStyle={buttonStyle.submitButton}
                        title='Sign in /Sign up'
                        onPress={this.navigateToSignin}
                    />
                </Card>
        );
    }

    render() {
        return (
            <View style={cardStyle.container}>
                {this.renderHeader()}
                {this.state.chooseCards ?
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




import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements';
import firebaseApp from '../config/FirebaseConfig';

import bg1 from '../assets/images/bg1.jpg';
import layoutStyle from '../styles/layout';
import buttonStyle from '../styles/button';
import colors from '../styles/colors';

export default class MySettings extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSignCard: true,
            mycard: false,
            username: '',
            title:'',

        }
    }

    navigateToSignin = () => {
        console.log('this.props.navigation', this.props.navigation)
        this.props.navigation.navigate('Signin', {});

    }
    handleSignout = () => {
        var self = this;
        firebaseApp.auth().signOut().then(function () {
            // Sign-out successful.
            console.log('Sign out successfully')
            self.setState({showSignCard: true})
        }).catch(function (error) {
            // An error happened.
            console.log('error', error)
        });
    }


    componentDidMount() {
        console.log(' Sign in props', this.props)
        const {state} = this.props.navigation;
        console.log('Mount Sign in passed state', state)
        if (state.params != undefined) {
            this.setState({title:`Welcome ${state.params.user.displayName} to cardmaker`,showSignCard: false, username: state.params.user.displayName});
        }
    }

    render() {
        return (
            <View style={layoutStyle.container}>
                {this.state.showSignCard ?
                    <Card
                        title='Welcome to cardmaker'
                        image={bg1}>
                        <Text style={{marginBottom: 10}}>
                            Please sign in to make your card, have fun!
                        </Text>
                        <Button
                            icon={{name: 'perm-identity'}}
                            buttonStyle={buttonStyle.submitButton}
                            title='Sign in /Sign up'
                            onPress={this.navigateToSignin}
                        />
                    </Card> :
                    <Card
                        title={this.state.title}
                        image={bg1}>
                        <Text style={{marginBottom: 10}}>
                            Please pick your picture from libaray to make your card, have fun!
                        </Text>
                        <Button
                            icon={{name: 'perm-identity'}}
                            buttonStyle={buttonStyle.submitButton}
                            title='Sign out'
                            onPress={this.handleSignout}
                        />
                    </Card>
                }

            </View>
        );
    }
}

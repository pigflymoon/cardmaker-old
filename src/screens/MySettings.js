import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements';

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

        }
    }

    navigateToSignin = () => {
        console.log('this.props.navigation',this.props.navigation)
        this.props.navigation.navigate('Signin',{});

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
                    </Card> : null}
            </View>
        );
    }
}

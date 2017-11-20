import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements';

import bg1 from '../assets/images/bg1.jpg';
import layoutStyle from '../styles/layout';
import buttonStyle from '../styles/button';
import colors from '../styles/colors';

export default class Settingss extends Component {
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
                        title='HELLO WORLD'
                        image={bg1}>
                        <Text style={{marginBottom: 10}}>
                            The idea with React Native Elements is more about component structure than actual design.
                        </Text>
                        <Button
                            icon={{name: 'perm-identity'}}
                            buttonStyle={buttonStyle.submitButton}
                            title='Sign in /Sign up'
                            onPress={this.navigateToSignin}
                        />
                    </Card> : null}
                {this.state.mycard ?
                    <List>
                        <View>
                            <Text>Test</Text>
                        </View>
                        <ListItem
                            leftIcon={{name: 'chat', color: colors.grey2}}
                            title={`Tell a friend`}

                        />

                    </List> : null}
            </View>
        );
    }
}

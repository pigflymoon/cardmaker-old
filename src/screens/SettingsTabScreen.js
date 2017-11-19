import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements'
import {Navigation} from 'react-native-navigation';

import bg1 from '../images/bg1.jpg';
import layoutStyle from '../styles/layout';
import buttonStyle from '../styles/button';
import colors from '../styles/colors';
let navigator;


const CustomButton = ({text}) =>
    <Icon
        name="settings"
        size={30}
        style={{paddingLeft: 10}}
        onPress={() => navigator.pop()}
    />;

Navigation.registerComponent('CustomButton', () => CustomButton);
export default class SettingsTabScreen extends Component {
    static navigatorButtons = {
        rightButtons: [
            {
                id: 'custom-button',
                component: 'CustomButton',
                passProps: {
                    text: 'Hi!'
                }
            }
        ]
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            showSignCard: true,
            mycard: false,

        }
    }

    componentWillMount() {
        navigator = this.props.navigator;
    }

    componentDidMount() {
        console.log('this.props', this.props)
        this.setState({showSignCard: !this.props.signin, mycard: this.props.signin})
    }

    showModal = () => {
        this.props.navigator.showModal({
            screen: 'cardmaker.SignInScreen',
            title: 'Welcome to CardMaker',
        });
    }
    pushSignInScreen = () => {
        this.props.navigator.push({
            screen: 'cardmaker.SignInScreen',
            title: 'Sign in',
        });
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
                            onPress={this.pushSignInScreen}
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

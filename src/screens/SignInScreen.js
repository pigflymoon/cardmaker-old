import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity,} from 'react-native';
import {Navigation} from 'react-native-navigation';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
} from 'react-native-elements';
import colors from '../styles/colors';
import modalStyle from '../styles/modalLayout';
import buttonStyle from '../styles/button';

const CloseModalButton = ({text}) =>
    <TouchableOpacity
        style={[buttonStyle.buttonContainer]}
        onPress={() => navigator.dismissModal()}
    >
        <View style={[buttonStyle.closeButton]}>
            <Text style={buttonStyle.buttonText}>{text}</Text>
        </View>
    </TouchableOpacity>;
Navigation.registerComponent('CloseModalButton', () => CloseModalButton);

export default class SignInScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',

        };
    }

    static navigatorButtons = {
        rightButtons: [
            {
                id: 'close-modal-button',
                component: Platform.OS === 'ios' ? 'CloseModalButton' : null,
                passProps: {
                    text: 'Close'
                }
            }
        ]
    };

    componentWillMount() {
        navigator = this.props.navigator;
    }

    setEmail = (text) => {
        this.setState({email: text});

    }

    setPassword = (text) => {
        this.setState({password: text});

    }

    handleSignin = () => {
        // e.preventDefault();
        // this.props.navigator.push({
        //     screen: 'cardmaker.',
        //     title: `Screen ${this.props.count || 1}`,
        //     passProps: {
        //         count: this.props.count ? this.props.count + 1 : 2
        //     }
        // });
    }

    navigateToSignup = () => {
        // e.preventDefault();
        this.props.navigator.push({
            screen: 'cardmaker.SignUpScreen',
            title: `Screen ${this.props.count || 1}`,
            passProps: {
                count: this.props.count ? this.props.count + 1 : 2
            }
        });
    }

    render() {
        return (
            <View style={modalStyle.container}>
                <View style={modalStyle.container}>
                    <FormLabel containerStyle={modalStyle.labelContainerStyle}>
                        Email
                    </FormLabel>
                    <FormInput
                        ref="email"
                        containerRef="emailcontainerRef"
                        textInputRef="emailInputRef"
                        placeholder="Please enter your email..."
                        onChangeText={(text) => this.setEmail(text)}
                    />

                    <FormLabel
                        textInputRef="passwordInputRef"
                        containerStyle={modalStyle.labelContainerStyle}
                    >
                        Password
                    </FormLabel>
                    <FormInput
                        textInputRef="textInputRef"
                        secureTextEntry
                        ref="password"
                        placeholder="Please enter your password..."
                        onChangeText={(text) => this.setPassword(text)}


                    />

                    <Button
                        onPress={this.handleSignin}
                        icon={{name: 'done'}}
                        buttonStyle={buttonStyle.submitButton}
                        title="Sign in"
                    />
                </View>
                <View style={[modalStyle.textContainer, modalStyle.containerMarginHorizontal]}>
                    <TouchableOpacity activeOpacity={.5} onPress={this.handleSignin}>
                        <Text style={modalStyle.textLink}>Forgot Password?</Text>
                    </TouchableOpacity>
                    <View style={modalStyle.paddingHorizontal10 }><Text style={modalStyle.plainText}>or</Text></View>
                    <TouchableOpacity activeOpacity={.5} onPress={this.navigateToSignup}>
                        <Text style={modalStyle.textLink}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}



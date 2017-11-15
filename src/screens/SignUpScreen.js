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

const CloseModalButton = ({text}) =>
    <TouchableOpacity
        style={[styles.buttonContainer]}
        onPress={() => navigator.dismissModal()}
    >
        <View style={styles.closeModalButton}>
            <Text style={styles.buttonText}>{text}</Text>
        </View>
    </TouchableOpacity>;
Navigation.registerComponent('CloseModalButton', () => CloseModalButton);

export default class SignUpScreen extends Component {
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

    handleSignup = () => {
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
            <View style={styles.container}>
                <FormLabel containerStyle={styles.labelContainerStyle}>
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
                    containerStyle={styles.labelContainerStyle}
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
                    buttonStyle={{marginTop: 15}}
                    title="SUBMIT"
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
    button: {
        marginTop: 16
    },
    buttonContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    closeModalButton: {
        backgroundColor: 'tomato',
        width: 50,
        height: 25,
        borderRadius: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white'
    },
    //form
    headingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: colors.secondary2,
    },
    heading: {
        color: 'white',
        marginTop: 10,
        fontSize: 22,
    },
    labelContainerStyle: {
        marginTop: 8,
    },
});


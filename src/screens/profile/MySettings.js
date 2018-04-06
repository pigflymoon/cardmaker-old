import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {
    Card, List, ListItem, Icon,
    Button,
    FormInput,
    FormLabel,
    FormValidationMessage,

} from 'react-native-elements';
import {auth,} from '../../config/FirebaseConfig';

import formStyle from '../../styles/form';
import buttonStyle from '../../styles/button';
import bg1 from '../../assets/images/bg1.jpg';
import layoutStyle from '../../styles/layout';

export default class MySettings extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showSignCard: true,
            welcomeCard: false,
            showSignBox: false,
            mycard: false,
            username: '',
            title: '',
            email: '',
            password: '',
            name: '',
            errorMessage: ''

        }
    }

    navigateToSignin = () => {
        this.setState({showSignBox: true, showSignCard: false, welcomeCard: false,})
    }
    handleSignout = () => {
        var self = this;
        auth.signOut().then(function () {
            // Sign-out successful.
            console.log('Sign out successfully')

            self.setState({showSignBox: false, showSignCard: true, welcomeCard: false,})
        }).catch(function (error) {
            // An error happened.
            console.log('error', error)
        });
    }
//sign in box
    setEmail = (text) => {
        this.setState({errorMessage: '', email: text});
    }

    setPassword = (text) => {
        this.setState({errorMessage: '', password: text});
    }

    handleSignin = (e) => {
        var self = this;
        e.preventDefault();
        auth.signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(function (signuser) {
                auth.onAuthStateChanged(function (user) {
                    if (user) {
                        var displayName = user.displayName ? user.displayName : (user.email).split("@")[0];
                        self.setState({
                            user: user,
                            signin: true,
                            welcomeCard: true,
                            showSignCard: false,
                            showSignBox: false,
                            title: `Hi ${displayName}, Welcome to cardmaker!`,
                            //
                        })

                    } else {
                        console.log('error', user)
                    }
                })
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log('errorCode', errorCode)
                switch (errorCode) {
                    case 'auth/invalid-email':
                    case 'auth/user-disabled':
                    case 'auth/operation-not-allowed':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        self.setState({
                            errorMessage: errorMessage
                        });
                        break;
                    default:
                        self.setState({
                            errorMessage: 'Error'
                        });
                }
            });


    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Signup', {});
    }

    navigateToResetPassword = () => {
        this.props.navigation.navigate('ResetPassword', {});
    }
//end

    renderSignBox = () => {
        return (
            <View style={formStyle.container}>

                <View style={formStyle.inputsContainer}>

                    <View style={formStyle.inputContainer}>

                        <FormLabel containerStyle={formStyle.labelContainerStyle}>
                            Email
                        </FormLabel>
                        <FormInput
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            placeholder="Please enter your email..."
                            onChangeText={(text) => this.setEmail(text)}
                        />
                    </View>

                    <View style={formStyle.inputContainer}>

                        <FormLabel containerStyle={formStyle.labelContainerStyle}>
                            Password
                        </FormLabel>
                        <FormInput
                            ref="password"
                            secureTextEntry
                            containerRef="passwordcontainerRef"
                            textInputRef="passwordInputRef"
                            placeholder="Please enter your password..."
                            onChangeText={(text) => this.setPassword(text)}
                        />
                    </View>

                    {this.state.errorMessage ?
                        <FormValidationMessage containerStyle={formStyle.validateContainer}
                                               labelStyle={formStyle.validateLabel}>
                            {this.state.errorMessage}
                        </FormValidationMessage>
                        : null
                    }
                </View>

                <View style={[formStyle.largerFooterContainer]}>
                    <Button
                        onPress={this.handleSignin}
                        icon={{name: 'done'}}
                        buttonStyle={buttonStyle.submitButton}
                        title="Sign in"
                    />
                    <View style={formStyle.textInfoContainer}>
                        <TouchableOpacity activeOpacity={.5} onPress={this.navigateToResetPassword}>
                            <View><Text style={formStyle.textLink}>Forgot Password? </Text></View>
                        </TouchableOpacity>
                        <View>
                            <Text style={formStyle.plainText}> or </Text>
                        </View>
                        <TouchableOpacity activeOpacity={.5} onPress={this.navigateToSignup}>
                            <View><Text style={formStyle.textLink}>Sign up.</Text></View>
                        </TouchableOpacity>
                    </View>

                </View>

            </View>
        );
    }

    componentDidMount() {
        var self = this;

        auth.onAuthStateChanged(function (user) {
            if (user) {
                var displayName = user.displayName ? user.displayName : (user.email).split("@")[0];

                self.setState({
                    user: user,
                    signin: true,
                    welcomeCard: true,
                    showSignCard: false,
                    showSignBox: false,
                    title: `Hi ${displayName}, Welcome to cardmaker!`,
                    //
                })

            } else {
                // this.setState({errorMessage: user})
                console.log('error', user)
            }
        })
    }

    render() {
        return (
            <View style={layoutStyle.container}>
                {this.state.showSignCard && <Card
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
                </Card>}
                {this.state.welcomeCard && <Card
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

                {this.state.showSignBox && this.renderSignBox()}

            </View>
        );
    }
}
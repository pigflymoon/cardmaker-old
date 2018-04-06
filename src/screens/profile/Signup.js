import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity,} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {auth} from '../../config/FirebaseConfig';
import {doCreateUser} from '../../config/db';
import formStyle from '../../styles/form';
import buttonStyle from '../../styles/button';

const byPropKey = (properTyName, value) => ({
    [properTyName]: value,
});

export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            password: '',
        };
    }

    setEmail = (text) => {
        this.setState({email: text});
    }

    setName = (text) => {
        this.setState({name: text});
    }
    setPassword = (text) => {
        this.setState({password: text});
    }

    navigateToSignin = () => {
        this.props.navigation.navigate('MySettings', {});
    }

    registerUserAndWaitEmailVerification(email, password) {
        var self = this;
        return new Promise(function (resolve, reject) {
            auth.createUserWithEmailAndPassword(email, password).then(function (user) {
                if (user) {
                    // Create a user in your own accessible Firebase Database too
                    doCreateUser(user.uid, self.state.name, email)
                        .then(() => {
                            user.updateProfile({displayName: self.state.name});
                            console.log('email', email)
                            self.props.navigation.navigate('VerifyEmail', {user: user, email: email});
                        })
                        .catch(error => {
                            this.setState(byPropKey('error', error));
                        });
                    //
                }
            })
             .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log('errorCode', errorCode)
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                        case 'auth/invalid-email':
                        case 'auth/operation-not-allowed':
                        case 'auth/weak-password':
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

        });
    }

    handleSignup = (e) => {
        e.preventDefault();
        console.log('emial is ', this.state.email)
        this.registerUserAndWaitEmailVerification(this.state.email, this.state.password);


    }

    render() {
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
                            Name
                        </FormLabel>
                        <FormInput
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            placeholder="Please enter your email..."
                            onChangeText={(text) => this.setName(text)}
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

                <View style={formStyle.footerContainer}>
                    <Button
                        onPress={this.handleSignup}
                        icon={{name: 'done'}}
                        buttonStyle={buttonStyle.submitButton}
                        title="Sign up"
                    />

                    <View style={formStyle.textInfoContainer}>
                        <View>
                            <Text style={formStyle.plainText}>By signing up, you agree to our </Text>
                        </View>
                        <TouchableOpacity>
                            <View>
                                <Text style={formStyle.textLink}>Terms</Text>
                            </View>
                        </TouchableOpacity>
                        <View>
                            <Text style={formStyle.plainText}> & </Text>
                        </View>
                        <TouchableOpacity>
                            <View>
                                <Text style={formStyle.textLink}>Privacy Policy.</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={formStyle.textInfoContainer}>
                        <View>
                            <Text style={formStyle.plainText}>Already have an account? </Text>
                        </View>
                        <TouchableOpacity onPress={this.navigateToSignin}>
                            <View>
                                <Text style={formStyle.textLink}>Sign In</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }
}



import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity,} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
} from 'react-native-elements';
import firebaseApp from '../config/FirebaseConfig';

import formStyle from '../styles/form';
import buttonStyle from '../styles/button';


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
        console.log('this.props.navigation', this.props.navigation)
        this.props.navigation.navigate('Signin', {});

    }

    registerUserAndWaitEmailVerification(email, password) {
        var self = this;
        return new Promise(function (resolve, reject) {
            firebaseApp.auth().createUserWithEmailAndPassword(email, password).then(function (user) {
                if (user) {
                    user.updateProfile({displayName: self.state.name});
                    console.log('email',email)
                    self.props.navigation.navigate('VerifyEmail', {user: user, email: email});
                }
            }).catch(function (error) {
                var errorMessage = error.message + ' (' + error.code + ')';
                console.log('errorMessage', errorMessage)
                // self.setState({showErrorInfo: true, errorInfo: errorMessage});
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
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            placeholder="Please enter your email..."
                            onChangeText={(text) => this.setPassword(text)}
                        />
                    </View>


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



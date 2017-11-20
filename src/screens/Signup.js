import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity,} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
} from 'react-native-elements';
import formStyle from '../styles/form';
import buttonStyle from '../styles/button';


export default class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',

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
                            onChangeText={(text) => this.setEmail(text)}
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
                            onChangeText={(text) => this.setEmail(text)}
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
                        <TouchableOpacity  onPress={this.navigateToSignin}>
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



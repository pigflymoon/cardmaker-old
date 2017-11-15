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


export default class SignUpScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',

        };
    }


    componentWillMount() {
        navigator = this.props.navigator;
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

    handleSignup = () => {
        // e.preventDefault();
        // this.props.navigator.push({
        //     screen: 'cardmaker.',
        //     title: `Screen ${this.props.count || 1}`,
        //     passProps: {
        //         count: this.props.count ? this.props.count + 1 : 2
        //     }
        // });
    }


    render() {
        return (
            <View style={modalStyle.formContainer}>
                <View style={modalStyle.lineContainer}>
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
                    <FormLabel containerStyle={modalStyle.labelContainerStyle}>
                        Name
                    </FormLabel>
                    <FormInput
                        ref="name"
                        containerRef="namecontainerRef"
                        textInputRef="nameInputRef"
                        placeholder="Please enter your name..."
                        onChangeText={(text) => this.setName(text)}
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
                        onPress={this.handleSignup}
                        icon={{name: 'done'}}
                        buttonStyle={buttonStyle.submitButton}
                        title="Signup"
                    />
                </View>

                <View style={modalStyle.paragraphContainer}>


                    <View>
                        <Text style={modalStyle.plainText}>By signing up, you agree to our </Text>
                    </View>
                    <TouchableOpacity activeOpacity={.5} onPress={this.handleSignin}>
                        <View><Text style={modalStyle.textLink}>Terms </Text></View>
                    </TouchableOpacity>
                    <View><Text style={modalStyle.plainText}>&</Text></View>
                    <TouchableOpacity activeOpacity={.5}>
                        <View><Text style={modalStyle.textLink}> Privacy Policy.</Text>
                        </View>
                    </TouchableOpacity>

                </View>


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


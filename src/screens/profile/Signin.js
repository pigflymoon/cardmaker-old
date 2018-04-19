import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity,AsyncStorage} from 'react-native';
import {
    Card,
    Button,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {auth,} from '../../config/FirebaseConfig';
import {onSignIn,USER_KEY} from "../../auth";
import formStyle from '../../styles/form';
import buttonStyle from '../../styles/button';
import bg1 from '../../assets/images/bg1.jpg';
import layoutStyle from '../../styles/layout';
import colors from '../../styles/colors';

export default class Signin extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            welcomeCard: false,
            showSignBox: true,
            mycard: false,
            username: '',
            title: '',
            email: '',
            password: '',
            name: '',
            errorMessage: ''

        }
    }

//sign in box
    setEmail = (text) => {
        this.setState({errorMessage: '', email: text});
    }

    setPassword = (text) => {
        this.setState({errorMessage: '', password: text});
    }

    handleSignin = (e) => {
        ///
        var self = this;
        onSignIn(this.state.email, this.state.password).then(() => {
            AsyncStorage.getItem(USER_KEY)
                .then(userDataJson => {
                    if (userDataJson !== null) {
                       console.log('user is ',userDataJson)
                        self.props.navigation.navigate("MyCardsDeck");
                    } else {
                        console.log('not sign in')
                    }
                })
                .catch(err => reject(err));


        });
        //

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
                        icon={{name: 'done', color: colors.secondary2}}
                        color={colors.secondary2}
                        buttonStyle={buttonStyle.submitButton}
                        title="Sign in"
                        underlayColor={colors.grey6}
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
                {this.renderSignBox()}
            </View>
        );
    }
}

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    KeyboardAvoidingView,
    TextInput,
    ScrollView
} from 'react-native';
import {
    Button,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';

import {auth,} from '../../config/FirebaseConfig';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';
import layoutStyle from '../../styles/layout';

// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
&& UIManager.setLayoutAnimationEnabledExperimental(true);

let interval = null;
export default class ConfirmEmail extends Component {

    constructor(props) {
        super(props);
        const {user} = this.props.navigation.state.params;
        this.state = {
            email: '',
            user: user,
        };

    }

    navigateToResetPassword = () => {
        this.props.navigation.navigate('ResetPassword', {});
    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Auth', {selectedCategory: 1,});
    }

    handleConfirmEmail = (e) => {
        var self = this;
        var user = this.state.user;
        this.setState({isLoading: true});

        e.preventDefault();

        user.sendEmailVerification().then(
            function () {
                interval = setInterval(() => {
                    user.reload().then(
                        function () {
                            if (interval && user.emailVerified) {
                                clearInterval(interval);
                                interval = null;

                                auth.onAuthStateChanged((user) => {
                                    self.setState({
                                        isLoading: false
                                    });
                                    clearInterval(interval);
                                    if (user && user.emailVerified) {
                                        self.props.navigation.navigate('Auth', {name: self.state.name});
                                        clearInterval(interval);
                                        interval = null;
                                    } else {
                                        self.setState({
                                            isLoading: false
                                        });
                                    }
                                });

                            } else {
                                self.setState({
                                    isLoading: false,
                                    errorMessage: 'Error',
                                });
                            }
                        }).catch(function (error) {
                        self.setState({
                            isLoading: false,
                            errorMessage: 'Error',
                        });
                        // var errorMessage = error.message + ' (' + error.code + ')';
                        // self.setState({showErrorInfo: true, errorInfo: errorMessage});
                    });
                }, 1000 * 30);
            }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            self.setState({
                errorMessage: errorMessage,
                isLoading: false,
            });
        });


    }
    renderConfirmBox = () => {
        const {
            isLoading,
        } = this.state;
        const {email} = this.props.navigation.state.params;

        return (
            <ScrollView style={authStyle.container} showsHorizontalScrollIndicator={false}>
                <KeyboardAvoidingView contentContainerStyle={authStyle.loginContainer} behavior='position'>
                    <View style={authStyle.titleContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={authStyle.titleText}>Cardmaker App</Text>
                        </View>

                    </View>

                    <View style={authStyle.formContainer}>

                        <FormInput
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            autoCapitalize = "none"
                            value={email}
                            inputStyle={authStyle.inputText}
                            containerStyle={authStyle.inputContainer}
                        />
                        {this.state.errorMessage ?
                            <FormValidationMessage containerStyle={authStyle.validateContainer}
                                                   labelStyle={authStyle.validateErrorLabel}>
                                {this.state.errorMessage}
                            </FormValidationMessage>
                            : null
                        }

                        <Button
                            buttonStyle={authStyle.loginButton}
                            containerViewStyle={{marginTop: 32, flex: 0}}
                            activeOpacity={0.8}
                            title={'CONFIRM'}
                            onPress={ this.handleConfirmEmail}
                            textStyle={authStyle.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={authStyle.helpContainer}>
                    <Button
                        title={'Forgot password?'}
                        textStyle={authStyle.noButtonText}
                        buttonStyle={authStyle.noButtonContainer}
                        underlayColor='transparent'
                        onPress={this.navigateToResetPassword}
                    />
                    <Button
                        title={'Sign up'}
                        textStyle={authStyle.noButtonText}
                        buttonStyle={authStyle.noButtonContainer}
                        underlayColor='transparent'
                        onPress={this.navigateToSignup}
                    />
                </View>
            </ScrollView>
        )
    }


    render() {

        return (
            <View style={authStyle.container}>
                <ImageBackground
                    source={BG_IMAGE}
                    style={layoutStyle.bgImage}
                >
                    { this.renderConfirmBox()}

                </ImageBackground>
            </View>
        );
    }
}



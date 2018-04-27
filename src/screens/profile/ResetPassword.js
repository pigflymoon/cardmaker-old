import React, {Component} from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    KeyboardAvoidingView,
    ScrollView
} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormValidationMessage,
} from 'react-native-elements';
import {auth} from '../../config/FirebaseConfig';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';
import layoutStyle from '../../styles/layout';

export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
        };
    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Auth', {selectedCategory: 1,});
    }

    setEmail = (text) => {
        this.setState({email: text});
    }


    handleResetPassword = () => {
        var self = this;

        console.log('this.state.email', this.state.email)
        if (!this.state.email) {
            this.setState({
                errorMessage: 'Please enter a valid email address'
            });
        } else {
            var emailAddress = this.state.email;
            this.setState({isLoading: true});
            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
                self.setState({
                    isLoading: false,
                    infoMessage: `Reset password sent to the emailAddress,please check your email ${emailAddress}`
                });
                self.props.navigation.navigate('Auth');
            }, function (error) {
                self.setState({
                    errorMessage: 'Error: ' + error,
                    isLoading: false,
                });

            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    self.setState({
                        errorMessage: errorMessage,
                        isLoading: false,
                    });
                });
            ;
        }
    }

    renderResetPasswordBox = () => {
        const {
            isLoading,
        } = this.state;

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
                            placeholder="Please enter your email..."
                            onChangeText={(text) => this.setEmail(text)}
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
                            title={'RESET PASSWORD'}
                            onPress={ this.handleResetPassword}
                            textStyle={authStyle.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={authStyle.helpContainer}>
                    <Button
                        title={'Do not have an account?'}
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
                    {this.renderResetPasswordBox()}
                </ImageBackground>
            </View>


        );
    }
}



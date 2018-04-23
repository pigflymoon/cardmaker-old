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
} from 'react-native';
import {
    Button,
    Text,
    FormInput,
} from 'react-native-elements';
import {auth} from '../../config/FirebaseConfig';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';

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
        this.setState({isLoading: true});

        if (!this.state.email) {
            this.setState({
                showInfo: true
            });
        } else {
            var emailAddress = this.state.email;
            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
                self.setState({
                    isLoading: false,
                    infoMessage: `Reset password sent to the emailAddress,please check your email ${emailAddress}`
                });
                self.props.navigation.navigate('Signin');
            }, function (error) {
                self.setState({
                    errorMessage: 'Error' + error
                });

            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    self.setState({
                        errorMessage: errorMessage
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
            <View style={{flex: 1}}>
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
                            inputStyle={{marginLeft: 20}}
                            containerStyle={authStyle.inputContainer}
                        />

                        <Button
                            buttonStyle={authStyle.loginButton}
                            containerViewStyle={{marginTop: 32, flex: 0}}
                            activeOpacity={0.8}
                            title={'RESET PASSWORD'}
                            onPress={ this.handleResetPassword}
                            titleStyle={authStyle.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={authStyle.helpContainer}>
                    <Button
                        title={'Do not have an account?'}
                        titleStyle={{color: 'white'}}
                        buttonStyle={{backgroundColor: 'transparent', marginBottom: 10,}}
                        underlayColor='transparent'
                        onPress={this.navigateToSignup}
                    />

                </View>
            </View>
        )
    }

    render() {

        return (
            <View style={authStyle.container}>
                <ImageBackground
                    source={BG_IMAGE}
                    style={authStyle.bgImage}
                >
                    {this.renderResetPasswordBox()}

                </ImageBackground>
            </View>


        );
    }
}



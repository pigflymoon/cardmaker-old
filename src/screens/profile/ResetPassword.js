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
import  Utils from '../../utils/utils';
import {I18n} from '../../config/language/I18n';

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
                }, () => {
                    Utils.infoAlert(`${I18n.t('profileTab.emailsentTranslation')}`, `${I18n.t('profileTab.emailsentInfoTranslation')} ${emailAddress}`);
                    self.props.navigation.navigate('Auth');
                });

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
                    <View style={authStyle.resetPasswordTitleContainer}>
                        <Text style={authStyle.subtitleText}>{I18n.t('profileTab.resetpasswordSubTitle1Translation')}</Text>
                        <Text style={authStyle.subtitleText}>{I18n.t('profileTab.resetpasswordSubTitle2Translation')}</Text>
                    </View>
                    <View style={authStyle.formContainer}>
                        <FormInput
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            placeholder={I18n.t('profileTab.enterEmailTranranslation')}
                            autoCapitalize="none"
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
                            title={I18n.t('profileTab.resetpasswordTranslation')}
                            onPress={ this.handleResetPassword}
                            textStyle={authStyle.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={authStyle.helpContainer}>
                    <Button
                        title={I18n.t('profileTab.haveaccountTranslation')}
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



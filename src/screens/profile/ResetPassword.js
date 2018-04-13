import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Platform,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import {auth} from '../../config/FirebaseConfig';

import formStyle from '../../styles/form';
import buttonStyle from '../../styles/button';
import colors from '../../styles/colors';


export default class ResetPassword extends Component {
    constructor(props) {
        super(props);

        const {user} = this.props.navigation.state.params;
        this.state = {
            signin: false,
            isLoading: false,
            user: user,
        };
    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Signup', {});
    }

    setEmail = (text) => {
        this.setState({email: text});
    }


    handleResetPassword = () => {
        var self = this;

        if (!this.state.email) {
            this.setState({
                showInfo: true
            });
        } else {
            var emailAddress = this.state.email;
            auth.sendPasswordResetEmail(emailAddress).then(function () {
                // Email sent.
                self.setState({
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

    render() {

        return (
            <View style={formStyle.container}>
                {this.state.isLoading ? (
                        <View style={formStyle.loading}>
                            <ActivityIndicator size='large'/>
                        </View>
                    ) : (
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
                                {this.state.infoMessage ?
                                    <FormValidationMessage containerStyle={formStyle.validateContainer}>
                                        {this.state.infoMessage}
                                    </FormValidationMessage>
                                    : null
                                }

                                {this.state.errorMessage ?
                                    <FormValidationMessage containerStyle={formStyle.validateContainer}>
                                        {this.state.errorMessage}
                                    </FormValidationMessage>
                                    : null
                                }
                            </View>

                            <View style={[formStyle.largerFooterContainer]}>
                                <Button
                                    onPress={this.handleResetPassword}
                                    icon={{name: 'done', color: colors.secondary2}}
                                    color={colors.secondary2}
                                    buttonStyle={buttonStyle.submitButton}
                                    title="Rest Password"
                                    underlayColor={colors.grey6}
                                />
                                <View style={formStyle.textInfoContainer}>
                                    <View>
                                        <Text style={formStyle.plainText}>Don't have an account? </Text>
                                    </View>
                                    <TouchableOpacity activeOpacity={.5} onPress={this.navigateToSignup}>
                                        <View><Text style={formStyle.textLink}>Sign up.</Text></View>
                                    </TouchableOpacity>
                                </View>

                            </View>
                        </View>
                    )}
            </View>


        );
    }
}



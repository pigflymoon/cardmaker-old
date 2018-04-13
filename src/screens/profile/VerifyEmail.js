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

let interval = null;

export default class VerifyEmail extends Component {
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

    handleVerifyEmail = (e) => {
        var self = this;
        var user = this.state.user;

        e.preventDefault();

        user.sendEmailVerification().then(
            function () {
                self.setState({
                    isLoading: true
                });

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
                                        self.props.navigation.navigate('MyCardsDeck', {name: self.state.name});
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
                                    isLoading: false
                                });
                            }
                        }).catch(function (error) {
                        // var errorMessage = error.message + ' (' + error.code + ')';
                        // self.setState({showErrorInfo: true, errorInfo: errorMessage});
                    });
                }, 1000 * 30);
            }).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            self.setState({
                errorMessage: errorMessage
            });
        });


    }

    render() {
        const {email} = this.props.navigation.state.params;

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
                                        value={email}
                                    />
                                </View>
                                {this.state.errorMessage ?
                                    <FormValidationMessage containerStyle={formStyle.validateContainer}>
                                        {this.state.errorMessage}
                                    </FormValidationMessage>
                                    : null
                                }
                            </View>

                            <View style={[formStyle.largerFooterContainer]}>
                                <Button
                                    onPress={this.handleVerifyEmail}
                                    icon={{name: 'done', color: colors.secondary2}}
                                    color={colors.secondary2}
                                    buttonStyle={buttonStyle.submitButton}
                                    title="Confirm"
                                    underlayColor={colors.grey6}
                                />
                                <View style={formStyle.textInfoContainer}>
                                    <TouchableOpacity>
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
                    )}
            </View>
        );
    }
}



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
    TextInput
} from 'react-native';
import {
    Card,
    Button,
    FormInput,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import {auth,} from '../../config/FirebaseConfig';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';
import colors from '../../styles/colors';


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
            showConfirmBox: true,
            user: user,
        };

    }

    navigateToResetPassword = () => {
        this.props.navigation.navigate('ResetPassword', {});
    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Signup', {});
    }

    handleConfirmEmail = (e) => {
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
    renderConfirmBox = () => {
        const {
            isLoading,
        } = this.state;
        const {email} = this.props.navigation.state.params;

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
                            value={email}
                            inputStyle={{marginLeft: 20}}
                            containerStyle={authStyle.inputContainer}
                        />

                        <Button
                            buttonStyle={authStyle.loginButton}
                            containerViewStyle={{marginTop: 32, flex: 0}}
                            activeOpacity={0.8}
                            title={'CONFIRM'}
                            onPress={ this.handleConfirmEmail}
                            titleStyle={authStyle.loginTextButton}
                            loading={isLoading}
                            disabled={isLoading}
                        />
                    </View>
                </KeyboardAvoidingView>
                <View style={authStyle.helpContainer}>
                    <Button
                        title={'Forgot password?'}
                        titleStyle={{color: 'white'}}
                        buttonStyle={{backgroundColor: 'transparent', marginBottom: 10,}}
                        underlayColor='transparent'
                        onPress={this.navigateToResetPassword}
                    />
                    <Button
                        title={'Sign up'}
                        titleStyle={{color: 'white'}}
                        buttonStyle={{backgroundColor: 'transparent'}}
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
                    {this.state.showConfirmBox && this.renderConfirmBox()}

                </ImageBackground>
            </View>
        );
    }
}



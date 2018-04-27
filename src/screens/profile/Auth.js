import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    LayoutAnimation,
    UIManager,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import {
    Card,
    Button,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';

import {auth,} from '../../config/FirebaseConfig';
import {doCreateUser} from '../../config/db';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';
import layoutStyle from '../../styles/layout';


import bg1 from '../../assets/images/bg1.jpg';
import  Utils from '../../utils/utils';


// Enable LayoutAnimation on Android
UIManager.setLayoutAnimationEnabledExperimental
&& UIManager.setLayoutAnimationEnabledExperimental(true);


const TabSelector = ({selected}) => {
    return (
        <View style={authStyle.selectorContainer}>
            <View style={selected && authStyle.selected}/>
        </View>
    );
};

TabSelector.propTypes = {
    selected: PropTypes.bool.isRequired,
};

export default class Auth extends Component {

    constructor(props) {
        super(props);
        const params = this.props.navigation.state.params || {};
        let selectedCategory = 0;
        if (params.selectedCategory) {
            selectedCategory = params.selectedCategory
        }
        this.state = {
            email: '',
            password: '',
            selectedCategory: selectedCategory,
            isLoading: false,
            welcomeCard: false,
            showSignBox: true,
            errorMessage: false,
            validateEmailMessage: 'Please enter a valid email address',
            validatePasswordMessage: 'Please enter at least 6 characters',
            validateNameMessage: 'Please enter a valid name',

        };

    }


    selectCategory = (selectedCategory) => {
        LayoutAnimation.easeInEaseOut();

        this.setState({
            selectedCategory,
            isLoading: false,
            errorMessage: '',
            email: '',
        });


    }

    navigateToResetPassword = () => {
        this.props.navigation.navigate('ResetPassword', {});
    }
    handleSignin = (e) => {
        var self = this;
        e.preventDefault();
        const {
            email,
            password,
        } = this.state;
        if (!Utils.validateEmail(email)) {
            this.setState({
                errorMessage: this.state.validateEmailMessage,
            });
            return false;

        }
        this.setState({isLoading: true});

        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            //
            auth.signInWithEmailAndPassword(email, password)
                .then(function () {
                    auth.onAuthStateChanged(function (user) {
                        if (user) {
                            var displayName = user.displayName ? user.displayName : (user.email).split("@")[0];
                            self.setState({
                                isLoading: false,
                                user: user,
                                signin: true,
                                welcomeCard: true,
                                showSignBox: false,
                                title: `Hi ${displayName}, Welcome to cardmaker!`,
                                //
                            })

                        } else {
                            self.setState({isLoading: false});
                        }
                    })
                })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    switch (errorCode) {
                        case 'auth/invalid-email':
                        case 'auth/user-disabled':
                        case 'auth/operation-not-allowed':
                        case 'auth/user-not-found':
                        case 'auth/wrong-password':
                            self.setState({
                                errorMessage: errorMessage,
                                isLoading: false
                            });
                            break;
                        default:
                            self.setState({
                                errorMessage: 'Error',
                                isLoading: false,
                            });
                    }
                });
            //

        }, 1500);


    }

    registerUserAndWaitEmailVerification(email, password) {
        var self = this;
        return new Promise(function (resolve, reject) {
            auth.createUserWithEmailAndPassword(email, password).then(function (user) {
                if (user) {
                    // Create a user in your own accessible Firebase Database too
                    doCreateUser(user.uid, self.state.name, email)
                        .then(() => {
                            user.updateProfile({displayName: self.state.name});
                            self.props.navigation.navigate('ConfirmEmail', {user: user, email: email});
                        })
                        .catch(error => {
                            this.setState({
                                errorMessage: 'Error',
                                isLoading: false,
                            });
                        });
                    //
                }
            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                        case 'auth/invalid-email':
                        case 'auth/operation-not-allowed':
                        case 'auth/weak-password':
                            self.setState({
                                errorMessage: errorMessage,
                                isLoading: false,
                            });
                            break;
                        default:
                            self.setState({
                                errorMessage: 'Error',
                                isLoading: false,
                            });
                    }
                });

        });
    }

    handleSignup = (e) => {
        e.preventDefault();
        //
        const {
            email,
            password,
            name,
        } = this.state;

        if (!Utils.validateEmail(email)) {
            this.setState({
                errorMessage: this.state.validateEmailMessage,
            });
            return false;

        }
        if (!(password.length >= 6)) {
            this.setState({
                errorMessage: this.state.validatePasswordMessage,
            });
            return false;
        }
        if (name == null || name == '') {
            this.setState({
                errorMessage: this.state.validateNameMessage,
            });
            return false;
        }

        this.setState({isLoading: true});

        var self = this;

        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            self.registerUserAndWaitEmailVerification(email, password);

        }, 1500);
        //

    }


    handleSignout = () => {
        var self = this;
        this.setState({isLoading: true});
        // Simulate an API call
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            auth.signOut().then(function () {
                // Sign-out successful.
                self.setState({
                    isLoading: false,
                    showSignBox: true,
                    welcomeCard: false,
                })
            }).catch(function (error) {
                // An error happened.
                var errorMessage = error.message;
                self.setState({
                    errorMessage: errorMessage,
                });
            });

        }, 1500);

    }
    //sign in box
    setEmail = (text) => {
        this.setState({errorMessage: '', email: text});
    }

    setPassword = (text) => {
        this.setState({errorMessage: '', password: text});
    }

    setName = (text) => {
        this.setState({name: text});
    }

    componentDidMount() {
        var self = this;
        var user = auth.currentUser;

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

            }
        })
    }

    renderSignBox = () => {
        const {
            selectedCategory,
            isLoading,
        } = this.state;
        const isLoginPage = selectedCategory === 0;
        const isSignUpPage = selectedCategory === 1;
        return (
            <ScrollView style={authStyle.container} showsHorizontalScrollIndicator={false}>
                <KeyboardAvoidingView contentContainerStyle={authStyle.loginContainer} behavior='position'>
                    <View style={authStyle.titleContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={authStyle.titleText}>Cardmaker App</Text>
                        </View>
                    </View>
                    <View style={authStyle.tabButtonGroup}>
                        <Button
                            onPress={() => this.selectCategory(0)}
                            buttonStyle={authStyle.tabButton}
                            title="Login"
                            textStyle={[authStyle.categoryText, isLoginPage && authStyle.selectedCategoryText]}
                        />
                        <Button
                            onPress={() => this.selectCategory(1)}
                            buttonStyle={authStyle.tabButton}
                            title="Sign up"
                            textStyle={[authStyle.categoryText, isSignUpPage && authStyle.selectedCategoryText]}
                        />
                    </View>
                    <View style={authStyle.rowSelector}>
                        <TabSelector selected={isLoginPage}/>
                        <TabSelector selected={isSignUpPage}/>
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
                        <FormValidationMessage containerStyle={authStyle.validateContainer}
                                               labelStyle={authStyle.validateLabel}>
                            {this.state.validateEmailMessage}
                        </FormValidationMessage>

                        <FormInput
                            ref="password"
                            secureTextEntry
                            containerRef="passwordcontainerRef"
                            textInputRef="passwordInputRef"
                            placeholder="Please enter your password..."
                            onChangeText={(text) => this.setPassword(text)}
                            inputStyle={authStyle.inputText}
                            containerStyle={authStyle.inputContainer}
                        />

                        <FormValidationMessage containerStyle={authStyle.validateContainer}
                                               labelStyle={authStyle.validateLabel}>
                            {this.state.validatePasswordMessage}
                        </FormValidationMessage>
                        {isSignUpPage &&
                        <FormInput
                            ref="name"
                            containerRef="namecontainerRef"
                            textInputRef="nameInputRef"
                            placeholder="Please enter your name..."
                            onChangeText={(text) => this.setName(text)}
                            inputStyle={authStyle.inputText}
                            containerStyle={authStyle.inputContainer}
                        />
                        }
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
                            title={isLoginPage ? 'SIGN IN' : 'SIGN UP'}
                            onPress={isLoginPage ? this.handleSignin : this.handleSignup}
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
                </View>
            </ScrollView>
        )
    }
    renderWelcomeBox = () => {
        const {
            isLoading,
        } = this.state;
        return (
            <Card
                containerStyle={[authStyle.formContainer]}
                title={this.state.title}
                image={bg1}>
                <Text style={{marginBottom: 10}}>
                    Please pick your picture from libaray to make your card, have fun!
                </Text>
                <Button
                    buttonStyle={authStyle.loginButton}
                    containerViewStyle={authStyle.authButtonContainer}
                    activeOpacity={0.8}
                    title={'SIGN OUT'}
                    onPress={ this.handleSignout}
                    textStyle={authStyle.loginTextButton}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </Card>
        )

    }

    render() {
        return (
            <View style={authStyle.container}>
                <ImageBackground
                    source={BG_IMAGE}
                    style={layoutStyle.bgImage}
                >
                    {this.state.showSignBox && this.renderSignBox()}
                    {this.state.welcomeCard && this.renderWelcomeBox()}

                </ImageBackground>
            </View>
        );
    }
}



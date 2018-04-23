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
    TextInput
} from 'react-native';
import {
    Card,
    Button,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons';
import {auth,} from '../../config/FirebaseConfig';
import {doCreateUser} from '../../config/db';

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';
import colors from '../../styles/colors';
import bg1 from '../../assets/images/bg1.jpg';


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
const byPropKey = (properTyName, value) => ({
    [properTyName]: value,
});

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
            fontLoaded: false,
            selectedCategory: selectedCategory,
            isLoading: false,
            isEmailValid: true,
            isPasswordValid: true,
            isConfirmationValid: true,
            welcomeCard: false,
            showSignBox: true,
        };

    }


    selectCategory = (selectedCategory) => {
        LayoutAnimation.easeInEaseOut();
        this.setState({
            selectedCategory,
            isLoading: false,
        });
    }

    validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return re.test(email);
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
        this.setState({isLoading: true});

        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            //
            auth.signInWithEmailAndPassword(email, password)
                .then(function () {
                    auth.onAuthStateChanged(function (user) {
                        if (user) {
                            var displayName = user.displayName ? user.displayName : (user.email).split("@")[0];
                            console.log('login true')
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
                            console.log('error', user)
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
                                errorMessage: errorMessage
                            });
                            break;
                        default:
                            self.setState({
                                errorMessage: 'Error'
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
                            this.setState(byPropKey('error', error));
                        });
                    //
                }
            })
                .catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    console.log('errorCode', errorCode)
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                        case 'auth/invalid-email':
                        case 'auth/operation-not-allowed':
                        case 'auth/weak-password':
                            self.setState({
                                errorMessage: errorMessage
                            });
                            break;
                        default:
                            self.setState({
                                errorMessage: 'Error'
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
            confirmPassword,
        } = this.state;
        // Simulate an API call
        var errorEmail = '', errorPassword = '';
        this.setState({isLoading: true});
        var self = this;
        // Simulate an API call
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            /*
             if (!this.validateEmail(email)) {
             errorEmail = 'Please enter a valid email address';
             this.setState({

             errorEmail: errorEmail,
             errorPassword: errorPassword,
             });

             }
             if (!password.length >= 8) {
             errorPassword = 'Please enter at least 8 characters';
             this.setState({

             errorEmail: errorEmail,
             errorPassword: errorPassword,
             });
             }
             if (!password == confirmPassword) {
             errorPassword = 'Please enter same password';
             this.setState({

             errorEmail: errorEmail,
             errorPassword: errorPassword,
             });
             }
             */

            this.setState({
                isLoading: false,

            }, function () {
                self.registerUserAndWaitEmailVerification(email, password);
            });

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
                console.log('error', error)
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

    renderSignBox = () => {
        const {
            selectedCategory,
            isLoading,
        } = this.state;
        const isLoginPage = selectedCategory === 0;
        const isSignUpPage = selectedCategory === 1;
        return (
            <View style={{flex: 1}}>
                <KeyboardAvoidingView contentContainerStyle={authStyle.loginContainer} behavior='position'>
                    <View style={authStyle.titleContainer}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={authStyle.titleText}>Cardmaker App</Text>
                        </View>

                    </View>
                    <View style={{flexDirection: 'row'}}>

                        <Button
                            onPress={() => this.selectCategory(0)}
                            buttonStyle={authStyle.tabButton}
                            containerStyle={{flex: 1,}}
                            title="Login"
                            titleStyle={[authStyle.categoryText, isLoginPage && authStyle.selectedCategoryText]}

                        />
                        <Button
                            onPress={() => this.selectCategory(1)}
                            buttonStyle={authStyle.tabButton}
                            containerStyle={{flex: 1,}}
                            title="Sign up"
                            titleStyle={[authStyle.categoryText, isSignUpPage && authStyle.selectedCategoryText]}

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
                            inputStyle={{marginLeft: 20}}
                            containerStyle={authStyle.inputContainer}
                        />

                        {this.state.errorMessage ?
                            <FormValidationMessage containerStyle={authStyle.validateContainer}
                                                   labelStyle={authStyle.validateLabel}>
                                {this.state.errorMessage}
                            </FormValidationMessage>
                            : null
                        }

                        <FormInput
                            ref="password"
                            secureTextEntry
                            containerRef="passwordcontainerRef"
                            textInputRef="passwordInputRef"
                            placeholder="Please enter your password..."
                            onChangeText={(text) => this.setPassword(text)}
                            inputStyle={{marginLeft: 20}}
                            containerStyle={authStyle.inputContainer}
                        />
                        {isSignUpPage &&
                        <FormInput
                            ref="name"
                            containerRef="namecontainerRef"
                            textInputRef="nameInputRef"
                            placeholder="Please enter your name..."
                            onChangeText={(text) => this.setName(text)}
                            inputStyle={{marginLeft: 20}}
                            containerStyle={authStyle.inputContainer}
                        />

                        }

                        <Button
                            buttonStyle={authStyle.loginButton}
                            containerViewStyle={{marginTop: 32, flex: 0}}
                            activeOpacity={0.8}
                            title={isLoginPage ? 'SIGN IN' : 'SIGN UP'}
                            onPress={isLoginPage ? this.handleSignin : this.handleSignup}
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
                        buttonStyle={{backgroundColor: 'transparent'}}
                        underlayColor='transparent'
                        onPress={this.navigateToResetPassword}

                    />
                </View>
            </View>
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
                    titleStyle={authStyle.loginTextButton}
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
                    style={authStyle.bgImage}
                >
                    {this.state.showSignBox && this.renderSignBox()}
                    {this.state.welcomeCard && this.renderWelcomeBox()}

                </ImageBackground>
            </View>
        );
    }
}



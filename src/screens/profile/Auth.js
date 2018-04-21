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

import BG_IMAGE from '../../assets/images/gradient-bg.png';
import authStyle from '../../styles/authLayout';


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

        this.state = {
            email: '',
            password: '',
            fontLoaded: false,
            selectedCategory: 0,
            isLoading: false,
            isEmailValid: true,
            isPasswordValid: true,
            isConfirmationValid: true,
        };

        this.selectCategory = this.selectCategory.bind(this);
        this.login = this.login.bind(this);
        this.signUp = this.signUp.bind(this);
    }


    selectCategory(selectedCategory) {
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

    login() {
        const {
            email,
            password,
        } = this.state;
        this.setState({isLoading: true});
        // Simulate an API call
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                isLoading: false,
                isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
                isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
            });
        }, 1500);
    }

    signUp() {
        const {
            email,
            password,
            passwordConfirmation,
        } = this.state;
        this.setState({isLoading: true});
        // Simulate an API call
        setTimeout(() => {
            LayoutAnimation.easeInEaseOut();
            this.setState({
                isLoading: false,
                isEmailValid: this.validateEmail(email) || this.emailInput.shake(),
                isPasswordValid: password.length >= 8 || this.passwordInput.shake(),
                isConfirmationValid: password == passwordConfirmation || this.confirmationInput.shake(),
            });
        }, 1500);
    }

    render() {
        const {
            selectedCategory,
            isLoading,
            isEmailValid,
            isPasswordValid,
            isConfirmationValid,
            email,
            password,
            passwordConfirmation,
        } = this.state;
        const isLoginPage = selectedCategory === 0;
        const isSignUpPage = selectedCategory === 1;
        return (
            <View style={authStyle.container}>
                <ImageBackground
                    source={BG_IMAGE}
                    style={authStyle.bgImage}
                >

                    <View style={{flex: 1}}>
                        <KeyboardAvoidingView contentContainerStyle={authStyle.loginContainer} behavior='position'>
                            <View style={authStyle.titleContainer}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={authStyle.titleText}>BEAUX</Text>
                                </View>
                                <View style={{marginTop: -10, marginLeft: 10}}>
                                    <Text style={authStyle.titleText}>VOYAGES</Text>
                                </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>

                                <Button
                                    onPress={() => this.selectCategory(0)}
                                    buttonStyle={authStyle.tabButton}
                                    containerStyle={{flex: 1, }}
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
                                    ref="password"
                                    secureTextEntry
                                    containerRef="passwordcontainerRef"
                                    textInputRef="passwordInputRef"
                                    placeholder="Please enter your password..."
                                    onChangeText={(text) => this.setPassword(text)}
                                    inputStyle={{marginLeft: 20}}
                                    containerStyle={authStyle.inputContainer}
                                />}
                                <Button
                                    buttonStyle={authStyle.loginButton}
                                    containerViewStyle={{marginTop: 32, flex: 0}}
                                    activeOpacity={0.8}
                                    title={isLoginPage ? 'LOGIN' : 'SIGN UP'}
                                    onPress={isLoginPage ? this.login : this.signUp}
                                    titleStyle={authStyle.loginTextButton}
                                    loading={isLoading}
                                    disabled={isLoading}
                                />
                            </View>
                        </KeyboardAvoidingView>
                        <View style={authStyle.helpContainer}>
                            <Button
                                title={'Need help ?'}
                                titleStyle={{color: 'white'}}
                                buttonStyle={{backgroundColor: 'transparent'}}
                                underlayColor='transparent'
                                onPress={() => console.log('Account created')}
                            />
                        </View>
                    </View>

                    }
                </ImageBackground>
            </View>
        );
    }
}



import React, {Component} from 'react';
import {StyleSheet, View, Platform, TouchableOpacity,} from 'react-native';
import {
    Button,
    Text,
    FormInput,
    FormLabel,
    FormValidationMessage,
} from 'react-native-elements';

import formStyle from '../styles/form';
import buttonStyle from '../styles/button';


export default class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            errorMessage: ''

        };
    }


    setEmail = (text) => {
        this.setState({email: text});

    }

    setPassword = (text) => {
        this.setState({password: text});

    }

    handleSignin = (e) => {
        var self = this;
        // e.preventDefault();
//after sign in update in settings screen
        var username = 'Duck';
        this.props.navigation.navigate('CardsTab', {
            payload: {
                signin: true,
                cards: JSON.stringify([{
                    id: 4,
                    text: 'Scarlett',
                    age: 25,
                    uri: 'https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg',
                },
                    {
                        id: 5,
                        text: 'Ashley',
                        age: 30,
                        uri: 'https://s-media-cache-ak0.pinimg.com/736x/4c/89/67/4c8967fac1822eeddf09670565430fd5.jpg',
                    }])


            }
        });

        /*
         console.log('sign in to deep link',this.props.navigator)
         this.props.navigator.handleDeepLink({
         link: 'tab2/cardmaker.SwipeCardsScreen',
         payload: {
         signin: true,
         cards: JSON.stringify([{
         id: 4,
         text: 'Scarlett',
         age: 25,
         uri: 'https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg',
         },
         {
         id: 5,
         text: 'Ashley',
         age: 30,
         uri: 'https://s-media-cache-ak0.pinimg.com/736x/4c/89/67/4c8967fac1822eeddf09670565430fd5.jpg',
         }])


         }
         });
         */

        // this.props.navigator.resetTo({
        //     title: `Welcome, ` + username,
        //     screen: 'cardmaker.SwipeCardsScreen',
        //     passProps: {
        //         signin: true,
        //         cards: JSON.stringify([{
        //             id: 4,
        //             text: 'Scarlett',
        //             age: 25,
        //             uri: 'https://i.ytimg.com/vi/GOJZ5TIlc3M/maxresdefault.jpg',
        //         },
        //             {
        //                 id: 5,
        //                 text: 'Ashley',
        //                 age: 30,
        //                 uri: 'https://s-media-cache-ak0.pinimg.com/736x/4c/89/67/4c8967fac1822eeddf09670565430fd5.jpg',
        //             }])
        //
        //
        //     }
        // })
        // this.props.navigator.switchToTab({
        //     tabIndex: 1, // (optional) if missing, this screen's tab will become selected
        //     title: `Welcome, ` + username,
        //     username: username,
        //     passProps: {
        //         count: this.props.count ? this.props.count + 1 : 2,
        //         username: username,
        //     }
        // });

        // this.props.navigator.push({
        //     screen: 'cardmaker.SettingsTabScreen',
        //     title: `Welcome, ` + username,
        //     passProps: {
        //         count: this.props.count ? this.props.count + 1 : 2,
        //         username: username,
        //         signin: true,
        //     }
        // });
        /*
         firebaseApp.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
         .then(function (user) {
         firebaseApp.auth().onAuthStateChanged(function (user) {
         if (user) {
         console.log('Update the card')
         } else {
         this.setState({errorMessage: user})
         console.log('error', user)
         }
         })
         })
         .catch(function (error) {
         // Handle Errors here.
         var errorCode = error.code;
         var errorMessage = error.message;
         console.log('errorCode', errorCode)
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

         */


    }

    navigateToSignup = () => {
        this.props.navigation.navigate('Signup', {});


    }

    render() {
        return (
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

                    <View style={formStyle.inputContainer}>

                        <FormLabel containerStyle={formStyle.labelContainerStyle}>
                            Password
                        </FormLabel>
                        <FormInput
                            ref="email"
                            containerRef="emailcontainerRef"
                            textInputRef="emailInputRef"
                            placeholder="Please enter your email..."
                            onChangeText={(text) => this.setPassword(text)}
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
                        onPress={this.handleSignin}
                        icon={{name: 'done'}}
                        buttonStyle={buttonStyle.submitButton}
                        title="Sign in"
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
        );
    }
}



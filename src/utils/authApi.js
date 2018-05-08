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
    ScrollView,
} from 'react-native';
import {
    Button,
} from 'react-native-elements';
import layoutStyle from '../styles/layout';
import BG_IMAGE from '../assets/images/gradient-bg.png';
import authStyle from '../styles/authLayout';


export function navigateToAuth(navigation) {
    navigation.navigate('Auth', {});
}
export function renderAuthBox(isLoading = false, navigation) {
console.log('auth box is called')
    return (
        <View style={authStyle.container}>
            <ImageBackground
                source={BG_IMAGE}
                style={layoutStyle.bgImage}
            >
                <ScrollView style={authStyle.container} showsHorizontalScrollIndicator={false}>
                    <KeyboardAvoidingView contentContainerStyle={authStyle.loginContainer} behavior='position'>
                        <View style={authStyle.titleContainer}>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={authStyle.titleText}>Welcome to Cardmaker App</Text>
                            </View>
                        </View>
                        <View style={authStyle.formContainer}>
                            <Text style={authStyle.infoText}>
                                Please sign in then choose picture to make card
                            </Text>

                            <Button
                                buttonStyle={authStyle.loginButton}
                                containerViewStyle={{marginTop: 32, flex: 0}}
                                activeOpacity={0.8}
                                title={'SIGN IN / SIGN UP'}
                                onPress={() => navigateToAuth(navigation)}
                                textStyle={authStyle.loginTextButton}
                                loading={isLoading}
                                disabled={isLoading}
                            />
                        </View>
                    </KeyboardAvoidingView>

                </ScrollView>
            </ImageBackground>
        </View>
    )
}

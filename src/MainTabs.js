/**
 * @flow
 */

import React from 'react';
import {ScrollView, Alert} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

//Explore
import ExploreScreen from './screens/explore/Explore';
import CardsGalleryScreen from './screens/explore/CardsGallery';
//Make card
import MyCardsDeckScreen from './screens/makeCard/MyCardsDeck';
import MyCardsScreen from './screens/makeCard/MyCards';
import MakeCardScreen from './screens/makeCard/MakeCard';
//Profile
import AuthScreen from './screens/profile/Auth';

import SigninScreen from './screens/profile/Signin';
import SignupScreen from './screens/profile/Signup';
import VerifiEmailScreen from './screens/profile/VerifyEmail';
import ResetPasswordScreen from './screens/profile/ResetPassword';
import TermsScreen from './screens/profile/TermOfUse';
import PolicyScreen from './screens/profile/PrivacyPolicy';
//Settings
import SettingsScreen from './screens/settings/Settings';
import AboutScreen from './screens/settings/About';
import ProversionScreen from './screens/settings/Proversion';

import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './styles/colors';


const ExploreTab = StackNavigator({
    Explore: {
        screen: ExploreScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Explore',
        }),
    },
    CardsGallery: {
        screen: CardsGalleryScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Cards Gallery',
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
            // headerBackTitleStyle: {color: colors.secondary2},
        }),
    },

})
const MakeCardTab = StackNavigator({
    MyCardsDeck: {
        screen: MyCardsDeckScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Cards'
        }),
    },
    MyCards: {
        screen: MyCardsScreen,
        navigationOptions: {
            title: 'My Cards',
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        }

    },
    MakeCard: {
        screen: MakeCardScreen,
        navigationOptions: {
            title: 'Make Card',
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        }

    },

})
const ProfileTab = StackNavigator({
        Auth: {
            screen: AuthScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Welcome',
                // headerBackTitle: 'Back',
                headerLeft: null,
            }),
        },
        Signin: {
            screen: SigninScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Sign in',
                // headerBackTitle: 'Back',
                headerLeft: null,
            }),
        },
        Signup: {
            screen: SignupScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Sign up',
                headerLeft: null,
            }),
        },
        VerifyEmail: {
            screen: VerifiEmailScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Verify email',
                // headerLeft: null,
            }),
        },
        ResetPassword: {
            screen: ResetPasswordScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Reset password',
                // headerLeft: null,
            }),
        },
        Terms: {
            screen: TermsScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Terms of Use',
                headerTintColor: colors.secondary2,
                headerTitleStyle: {color: colors.black},

            }),
        },
        Policy: {
            screen: PolicyScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Privacy Policy',
                headerTintColor: colors.secondary2,
                headerTitleStyle: {color: colors.black},
            }),
        },

    },
    // {
    //     headerMode: 'none',
    //     mode: 'modal',
    // }
)
const SettingsTab = StackNavigator({
    Settings: {
        screen: SettingsScreen,
        navigationOptions: {
            title: 'Settings',
        },
    },
    About: {
        screen: AboutScreen,
        navigationOptions: {
            title: 'About',
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        }
    },
    Proversion: {
        screen: ProversionScreen,
        navigationOptions: {
            title: 'PRO Version',
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        },
    },
});

const StacksInTabs = TabNavigator(
    {
        ExploreTab: {
            screen: ExploreTab,
            navigationOptions: {
                tabBarLabel: 'Explore',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
            }

        },
        MakeCardTab: {
            screen: MakeCardTab,
            navigationOptions: {
                tabBarLabel: 'Make Card',
                headerTintColor: colors.secondary2,
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-star' : 'ios-star-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            }

        },
        ProfileTab: {
            screen: ProfileTab,
            navigationOptions: {
                tabBarLabel: 'Profile',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-person' : 'ios-person-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
            }

        },
        SettingsTab: {
            screen: SettingsTab,
            navigationOptions: {
                tabBarLabel: 'Settings',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-settings' : 'ios-settings-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            },
        },

    },
    {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {activeTintColor: colors.secondary2}

    },
);

export default StacksInTabs;
console.disableYellowBox = true
console.ignoredYellowBox = ['Remote debugger'];

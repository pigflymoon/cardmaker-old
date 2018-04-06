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
import MySettingsScreen from './screens/profile/MySettings';
import SignupScreen from './screens/profile/Signup';
import VerifiEmailScreen from './screens/profile/VerifyEmail';
import ResetPasswordScreen from './screens/profile/ResetPassword';
//Settings
import SettingsScreen from './screens/settings/Settings';
import AboutScreen from './screens/settings/About';
import ProversionScreen from './screens/settings/Proversion';

import Ionicons from 'react-native-vector-icons/Ionicons';
const MySettingsStack = StackNavigator({
        MySettings: {
            screen: MySettingsScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Sign in',
                // headerLeft: null,
            }),
        },
        Signup: {
            screen: SignupScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Sign up',
                // headerLeft: null,
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

    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);
const ExploreTab = StackNavigator({
    Explore: {
        screen: ExploreScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Explore'
        }),
    },
    CardsGallery: {
        screen: CardsGalleryScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Cards Gallery'
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
        }

    },
    MakeCard: {
        screen: MakeCardScreen,
        navigationOptions: {
            title: 'Make Card',
        }

    },
})
const ProfileTab = StackNavigator({
    MySettingsTab: {
        screen: MySettingsStack,
        navigationOptions: {
            // title: 'Profile',

        },
    },
})
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
            title: 'About'
        }
    },
    Proversion: {
        screen: ProversionScreen,
        navigationOptions: {
            title: 'PRO Version'
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
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-star' : 'ios-star-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
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
    }
);

export default StacksInTabs;
console.disableYellowBox = true
console.ignoredYellowBox = ['Remote debugger'];

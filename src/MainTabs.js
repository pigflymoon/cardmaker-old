/**
 * @flow
 */

import React from 'react';
import {ScrollView, Alert} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import MySettingsScreen from './screens/MySettings';
import SignupScreen from './screens/Signup';
import VerifiEmailScreen from './screens/VerifyEmail';
import ResetPasswordScreen from './screens/ResetPassword';
// import CardsScreen from './screens/Cards';
import CardsScreen from './screens/Cards';
import MyCardsScreen from './screens/MyCards';

import MakeCardsScreen from './screens/MakeCards';

import CardsListScreen from './screens/CardsList';

import ExploreScreen from './screens/Explore';
import CardsGalleryScreen from './screens/CardsGallery';

import ProfileScreen from './screens/Profile';

import CardsDeckScreen from './screens/CardsDeck';


import SettingsScreen from './screens/Settings';
import AboutScreen from './screens/About';
import ProversionScreen from './screens/Proversion';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {Icon} from 'react-native-elements'
const MySettingsStack = StackNavigator({
        MySettings: {
            screen: MySettingsScreen,
            navigationOptions: ({navigation}) => ({
                // title: 'My Settings',
                headerLeft: null,
            }),
        },
        Signup: {
            screen: SignupScreen,
            navigationOptions: ({navigation}) => ({
                // title: 'Sign up',
                headerLeft: null,
            }),
        },
        VerifyEmail: {
            screen: VerifiEmailScreen,
            navigationOptions: ({navigation}) => ({
                // title: 'Verify Email',
                headerLeft: null,
            }),
        },
        ResetPassword: {
            screen: ResetPasswordScreen,
            navigationOptions: ({navigation}) => ({
                // title: 'Verify Email',
                headerLeft: null,
            }),
        },

    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);


//Cards Tab: cards library and my cards
const CardsListStack = StackNavigator({
        MySettings: {
            screen: CardsListScreen,
            navigationOptions: ({navigation}) => ({
                // title: 'My Settings',
                headerLeft: null,
            }),
        },

    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);


const MyCardsTabs = TabNavigator(
    {
        CardsDeck: {
            screen: CardsDeckScreen,
            navigationOptions: ({navigation}) => ({
                title: 'Cards',
                tabBarLabel: 'Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }),
        },
        MyCard: {
            screen: MyCardsScreen,
            navigationOptions: {
                title: 'My Cards',
                tabBarLabel: 'Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }

        },
        MakeCard: {
            screen: MakeCardsScreen,
            navigationOptions: {
                title: 'Make Card',
                tabBarLabel: 'Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }

        },
        MySettingsTab: {
            screen: MySettingsStack,
            navigationOptions: {
                tabBarLabel: 'Me',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            },
        },
        CardsListTab: {
            screen: CardsListStack,
            navigationOptions: {
                tabBarLabel: 'Cards List',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            },
        },
        // CardsLibraryTab: {
        //     screen: CardsScreen,
        //     navigationOptions: {
        //         tabBarLabel: 'Cards Library',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Ionicons
        //                 name={focused ? 'ios-images' : 'ios-images-outline'}
        //                 size={26}
        //                 style={{color: tintColor}}
        //             />
        //         ),
        //
        //     },
        // },
        // MyCardTab: {
        //     screen: MyCardsScreen,
        //     navigationOptions: {
        //         tabBarLabel: 'My Cards',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Ionicons
        //                 name={focused ? 'ios-star' : 'ios-star-outline'}
        //                 size={26}
        //                 style={{color: tintColor}}
        //             />
        //         ),
        //     }
        //
        // },

        // MakeCardsTab: {
        //     screen: MakeCardsScreen,
        //     navigationOptions: {
        //         tabBarLabel: 'Make Cards',
        //         tabBarIcon: ({tintColor, focused}) => (
        //             <Ionicons
        //                 name={focused ? 'ios-image' : 'ios-image-outline'}
        //                 size={26}
        //                 style={{color: tintColor}}
        //             />
        //         ),
        //     }
        //
        // },
    },
    {
        tabBarPosition: 'top',
        animationEnabled: false,
        swipeEnabled: false,
        // tabBarOptions: {
        //     tabStyle: {
        //         borderBottomWidth: 1,
        //         borderBottomColor: colors.greyOutline,
        //
        //     },
        // },
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
    MyCards: {
        screen: CardsScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Cards'
        }),
    },
    CardsDeck: {
        screen: CardsDeckScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Cards Deck'
        }),
    },
    MyCard: {
        screen: MyCardsScreen,
        navigationOptions: {
            title: 'My Cards',
        }

    },
    MakeCard: {
        screen: MakeCardsScreen,
        navigationOptions: {
            title: 'Make Card',
        }

    },
})

/*
const MyCardsTab = StackNavigator({
    Cards: {
        screen: MyCardsTabs,
        navigationOptions: ({navigation}) => ({
            title: 'My Cards'
        }),
    },
})
*/

const ProfileTab = StackNavigator({
    Explore: {
        screen: ProfileScreen,
        navigationOptions: ({navigation}) => ({
            title: 'Profile'
        }),
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

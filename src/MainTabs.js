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
import CardsScreen from './screens/Cards';
import MyCardsScreen from './screens/MyCards';
import MakeCardsScreen from './screens/MakeCards';

import CardsListScreen from './screens/CardsList';
import BoardModelScreen from './screens/BoardModel';

import BoardsScreen from './screens/Boards';
import PinsScreen from './screens/Pins';


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
        BoardModel: {
            screen: BoardModelScreen,
        },
    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);
BoardModelScreen.navigationOptions = props => {
    const {navigation} = props;
    const {state} = navigation;
    const {params} = state;
    return {
        headerTitle: `Choose Boards`,
        headerRight: (
            <Icon
                raised
                name='close'
                type='font-awesome'
                color='#f50'
                onPress={() =>
                    navigation.goBack()}
            />
        ),
    };
};


const CardsTabs = TabNavigator(
    {
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
        CardsLibraryTab: {
            screen: CardsScreen,
            navigationOptions: {
                tabBarLabel: 'Cards Library',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            },
        },
        MyCardTab: {
            screen: MyCardsScreen,
            navigationOptions: {
                tabBarLabel: 'My Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-star' : 'ios-star-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }

        },

        MakeCardsTab: {
            screen: MakeCardsScreen,
            navigationOptions: {
                tabBarLabel: 'Make Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-image' : 'ios-image-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }

        },
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


const CardsTab = StackNavigator({
    Cards: {
        screen: CardsTabs,
        navigationOptions: ({navigation}) => ({
            title: 'Cards'
        }),
    },
})


//Boards
const MyBoardsStack = StackNavigator({
        MySettings: {
            screen: BoardsScreen,
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

const MyPinsStack = StackNavigator({
        MySettings: {
            screen: PinsScreen,
            navigationOptions: ({navigation}) => ({
                headerLeft: null,
            }),
        },

    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);
const BoardsTabs = TabNavigator(
    {
        MyBoardsTab: {
            screen: MyBoardsStack,
            navigationOptions: {
                tabBarLabel: 'Boards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            },
        },
        MyPinsTab: {
            screen: MyPinsStack,
            navigationOptions: {
                tabBarLabel: 'Pins',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            },
        },


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
const BoardsTab = StackNavigator({
    Boards: {
        screen: BoardsTabs,
        navigationOptions: ({navigation}) => ({
            title: 'My Boards'
        }),
    },
})
//

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
        BoardTab: {
            screen: BoardsTab,
            navigationOptions: {
                tabBarLabel: 'Boards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
            }

        },
        CardsTab: {
            screen: CardsTab,
            navigationOptions: {
                tabBarLabel: 'Cards',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-star' : 'ios-star-outline'}
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

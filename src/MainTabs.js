/**
 * @flow
 */

import React from 'react';
import {Button, ScrollView} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';
import Settings from './screens/Settings';
import Signin from './screens/Signin';
import Signup from './screens/Signup';
import Cards from './screens/Cards';
import Ionicons from 'react-native-vector-icons/Ionicons';

const MyNavScreen = ({navigation, banner}) => (
    <ScrollView>
        <Button
            onPress={() => navigation.navigate('Profile', {name: 'Jordan'})}
            title="Open profile screen"
        />
        <Button
            onPress={() => navigation.navigate('NotifSettings')}
            title="Open notifications screen"
        />
        <Button
            onPress={() => navigation.navigate('SettingsTab')}
            title="Go to settings tab"
        />
        <Button onPress={() => navigation.goBack(null)} title="Go back"/>
    </ScrollView>
);

const MyHomeScreen = ({navigation}) => (
    <MyNavScreen banner="Home Screen" navigation={navigation}/>
);

const MyProfileScreen = ({navigation}) => (
    <MyNavScreen
        banner={`${navigation.state.params.name}s Profile`}
        navigation={navigation}
    />
);

const MyNotificationsSettingsScreen = ({navigation}) => (
    <MyNavScreen banner="Notifications Screen" navigation={navigation}/>
);

// const MySettingsScreen = ({navigation}) => (
//     <Settings banner="Settings Screen" navigation={navigation}/>
// );
//
// const SigninScreen = ({navigation}) => (
//     <Signin navigation={navigation}/>
// );

const MainTab = StackNavigator({
    Home: {
        screen: MyHomeScreen,
        path: '/',
        navigationOptions: {
            title: 'Welcome',
        },
    },
    Profile: {
        screen: MyProfileScreen,
        path: '/people/:name',
        navigationOptions: ({navigation}) => ({
            title: `${navigation.state.params.name}'s Profile!`,
        }),
    },
});

const CardsTab = StackNavigator({
    Cards: {
        screen: Cards,
        path: '/',
        navigationOptions: ({navigation}) => ({
            title: 'Pick your cards'
        }),
    },
    // MakeCards: {
    //     screen: MakeCard,
    //     path: '/',
    //     navigationOptions: ({navigation}) => ({
    //         title: 'Make card',
    //     }),
    // },
})

const SettingsTab = StackNavigator({
    Settings: {
        screen: Settings,
        path: '/',
        navigationOptions: ({navigation}) => ({
            title: 'Settings',
        }),
    },
    Signin: {
        screen: Signin,
        path: '/sign/:name',
        navigationOptions: ({navigation}) => ({
            title: `Sign in`
        }),
    },
    Signup: {
        screen: Signup,
        navigationOptions: ({navigation}) => ({
            title: 'Sign up'
        }),
    },

    NotifSettings: {
        screen: MyNotificationsSettingsScreen,
        navigationOptions: {
            title: 'Notifications',
        },
    },
});

const StacksInTabs = TabNavigator(
    {
        SettingsTab: {
            screen: SettingsTab,
            // path: '/settings',
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
        MainTab: {
            screen: MainTab,
            path: '/',
            navigationOptions: {
                tabBarLabel: 'Home',
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-home' : 'ios-home-outline'}
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
console.ignoredYellowBox = ['Remote debugger'];
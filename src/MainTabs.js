/**
 * @flow
 */

import React from 'react';
import {ScrollView, Alert} from 'react-native';
import {StackNavigator, TabNavigator} from 'react-navigation';

//Explore
import ExploreScreen from './screens/explore/Explore';
import ImagesGalleryScreen from './screens/explore/ImagesGallery';

//Make card
import CardsDeckScreen from './screens/makeCard/CardsDeck';
import MyCardsScreen from './screens/makeCard/MyCards';
import MakeCardScreen from './screens/makeCard/MakeCard';
import MakeInvitationScreen from './screens/makeCard/MakeInvitation';

//Profile
import AuthScreen from './screens/profile/Auth';
import ConfirmEmailScreen from './screens/profile/ConfirmEmail';
// import VerifiEmailScreen from './screens/profile/VerifyEmail';
import ResetPasswordScreen from './screens/profile/ResetPassword';
import TermsScreen from './screens/profile/TermOfUse';
import PolicyScreen from './screens/profile/PrivacyPolicy';
//Settings
import SettingsScreen from './screens/settings/Settings';
import AboutScreen from './screens/settings/About';
import UnLockModalScreen from './screens/settings/UnLockModal';

import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from './styles/colors';

import {I18n} from './config/language/I18n';
//`${I18n.t('tabs.')}`
const ExploreTab = StackNavigator({
    Explore: {
        screen: ExploreScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.exploreTranslation')}`,
        }),
    },
    ImagesGallery: {
        screen: ImagesGalleryScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.imagesGalleryTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
            // headerBackTitleStyle: {color: colors.secondary2},
        }),
    },

})
const MakeCardTab = StackNavigator({
    CardsDeck: {
        screen: CardsDeckScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.cardsDeckTranslation')}`,
            headerLeft: null,
        }),
    },
    MyCards: {
        screen: MyCardsScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.myFavoritesTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        })

    },
    MakeCard: {
        screen: MakeCardScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('tabs.makeCardTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        })

    },
    MakeInvitation: {
        screen: MakeInvitationScreen,
        navigationOptions:({navigation}) => ( {
            title: `${I18n.t('screens.makeInvitationTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {
                color: colors.black
            }
            ,
        })

    }
    ,
})
const ProfileTab = StackNavigator({
    Auth: {
        screen: AuthScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.welcomeTranslation')}`,
            // headerBackTitle: 'Back',
            headerLeft: null,
        }),
    },
    ConfirmEmail: {
        screen: ConfirmEmailScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.confirmEmailTranslation')}`,
            headerLeft: null,
        }),
    },
    ResetPassword: {
        screen: ResetPasswordScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.resetPasswordTranslation')}`,
            headerTintColor: colors.secondary2,
        }),
    },
    Terms: {
        screen: TermsScreen,
        navigationOptions: ({navigation}) => ({
            title:`${I18n.t('screens.termsTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},

        }),
    },
    Policy: {
        screen: PolicyScreen,
        navigationOptions: ({navigation}) => ({
            title: `${I18n.t('screens.policyTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        }),
    },

})

const SettingsTab = StackNavigator({
    Settings: {
        screen: SettingsScreen,
        navigationOptions:({navigation}) => ( {
            title: `${I18n.t('tabs.settingsTranslation')}`,
        }),
    },
    About: {
        screen: AboutScreen,
        navigationOptions:({navigation}) => ( {
            title:`${I18n.t('screens.aboutTranslation')}`,
            headerTintColor: colors.secondary2,
            headerTitleStyle: {color: colors.black},
        })
    },
});

const StacksInTabs = TabNavigator(
    {
        ExploreTab: {
            screen: ExploreTab,
            navigationOptions:({navigation}) => ( {
                tabBarLabel: `${I18n.t('tabs.exploreTranslation')}`,
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-images' : 'ios-images-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
            })

        },

        MakeCardTab: {
            screen: MakeCardTab,
            navigationOptions: ({navigation}) => ({
                tabBarLabel: `${I18n.t('tabs.makeCardTranslation')}`,
                headerTintColor: colors.secondary2,
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-star' : 'ios-star-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),

            })

        },

        ProfileTab: {
            screen: ProfileTab,
            navigationOptions:({navigation}) => ( {
                tabBarLabel: `${I18n.t('tabs.profileTranslation')}`,
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-person' : 'ios-person-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                )
            })

        },
        SettingsTab: {
            screen: SettingsTab,
            navigationOptions:({navigation}) => ( {
                tabBarLabel: `${I18n.t('tabs.settingsTranslation')}`,
                tabBarIcon: ({tintColor, focused}) => (
                    <Ionicons
                        name={focused ? 'ios-settings' : 'ios-settings-outline'}
                        size={26}
                        style={{color: tintColor}}
                    />
                ),
            }),
        },

    },
    {
        tabBarPosition: 'bottom',
        animationEnabled: false,
        swipeEnabled: false,
        tabBarOptions: {activeTintColor: colors.secondary2}

    },
);

const StacksOverTabs = StackNavigator({
        Root: {
            screen: StacksInTabs,
        },
        UnLock: {
            screen: UnLockModalScreen,
            navigationOptions: {
                title: 'UnLock',
            },
        },

    },
    {
        headerMode: 'none',
        mode: 'modal',
    }
);

export default StacksOverTabs;
console.disableYellowBox = true
console.ignoredYellowBox = ['Remote debugger'];

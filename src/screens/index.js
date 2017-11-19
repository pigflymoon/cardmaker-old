import {Navigation} from 'react-native-navigation';

import CardTabScreen from './CardTabScreen';
import SettingsTabScreen from './SettingsTabScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import SwipeCardsScreen from './SwipeCardsScreen';
import Settings from '../components/Settings';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('cardmaker.CardTabScreen', () => CardTabScreen);
    Navigation.registerComponent('cardmaker.SettingsTabScreen', () => SettingsTabScreen);
    Navigation.registerComponent('cardmaker.SwipeCardsScreen', () => SwipeCardsScreen);

    // Navigation.registerComponent('cardmaker.PushedScreen', () => PushedScreen);
    Navigation.registerComponent('cardmaker.SignInScreen', () => SignInScreen);
    Navigation.registerComponent('cardmaker.SignUpScreen', () => SignUpScreen);
    Navigation.registerComponent('cardmaker.Settings', () => Settings);

    //Settings

}

import { Navigation } from 'react-native-navigation';

import CardTabScreen from './CardTabScreen';
import SettingsTabScreen from './SettingsTabScreen';
import PushedScreen from './PushedScreen';
import SignInScreen from './SignInScreen';
// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('cardmaker.CardTabScreen', () => CardTabScreen);
    Navigation.registerComponent('cardmaker.SettingsTabScreen', () => SettingsTabScreen);
    Navigation.registerComponent('cardmaker.PushedScreen', () => PushedScreen);
    Navigation.registerComponent('cardmaker.SignInScreen', () => SignInScreen);

    //Settings

}

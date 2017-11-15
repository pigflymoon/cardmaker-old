import { Navigation } from 'react-native-navigation';

import CardTabScreen from './CardTabScreen';
import SettingsTabScreen from './SettingsTabScreen';
import PushedScreen from './PushedScreen';

// register all screens of the app (including internal ones)
export function registerScreens() {
    Navigation.registerComponent('example.CardTabScreen', () => CardTabScreen);
    Navigation.registerComponent('example.SettingsTabScreen', () => SettingsTabScreen);
    Navigation.registerComponent('example.PushedScreen', () => PushedScreen);
}

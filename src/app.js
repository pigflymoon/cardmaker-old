import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import {registerScreens} from './screens';

registerScreens(); // this is where you register all of your app's screens

// start the app


async function prepareIcons() {
    const icons = await Promise.all([
        Icon.getImageSource('ios-home', 30),
        Icon.getImageSource('ios-settings', 30),
        Icon.getImageSource('ios-bookmarks', 30),
        Icon.getImageSource('ios-heart', 30),
        Icon.getImageSource('ios-person', 30),
    ]);
    const [home, settings, cards, notifications, profile] = icons;
    return {home, settings, cards, notifications, profile};
}

// and then
async function startApp() {
    const icons = await prepareIcons();

    // start the app
    Navigation.startTabBasedApp({
        tabs: [
            {
                label: 'Settings',
                screen: 'cardmaker.SettingsTabScreen',
                icon: icons.settings,
                // selectedIcon: icons.settings, // iOS only
                title: 'Screen Settings'
            },
            {
                label: 'MyCards',
                screen: 'cardmaker.SwipeCardsScreen', // this is a registered name for a screen
                icon: icons.cards,
                title: 'Make Card'
            },
            {
                label: 'Card',
                screen: 'cardmaker.CardTabScreen', // this is a registered name for a screen
                icon: icons.profile,
                title: 'Screen Card'
            },

        ]
    });
}
console.ignoredYellowBox = ['Remote debugger'];
// start the app
startApp();
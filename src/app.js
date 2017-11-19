import {Navigation} from 'react-native-navigation';

import {registerScreens} from './screens';
import {prepareIcons} from './utils/IconsLoader';

registerScreens(); // this is where you register all of your app's screens


// and then
async function startApp() {
    const icons = await prepareIcons();

    // start the app
    Navigation.startTabBasedApp({
        tabs: [
            {
                label: 'Settings',
                screen: 'cardmaker.SettingsTabScreen',
                icon: icons.profile,
                // selectedIcon: icons.settings, // iOS only
                title: 'Screen Settings'
            },
            // {
            //     label: 'MyCards',
            //     screen: 'cardmaker.SwipeCardsScreen', // this is a registered name for a screen
            //     icon: icons.cards,
            //     title: 'Make Card'
            // },
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
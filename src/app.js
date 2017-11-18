import {Navigation} from 'react-native-navigation';

import {registerScreens} from './screens';

registerScreens(); // this is where you register all of your app's screens

// start the app
Navigation.startTabBasedApp({
    tabs: [
        {
            label: 'Settings',
            screen: 'cardmaker.SettingsTabScreen',
            icon: require('../img/two.png'),
            selectedIcon: require('../img/two_selected.png'), // iOS only
            title: 'Screen Settings'
        },
        {
            label: 'MyCards',
            screen: 'cardmaker.SwipeCardsScreen', // this is a registered name for a screen
            icon: require('../img/one.png'),
            selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Make Card'
        },
        {
            label: 'Card',
            screen: 'cardmaker.CardTabScreen', // this is a registered name for a screen
            icon: require('../img/one.png'),
            selectedIcon: require('../img/one_selected.png'), // iOS only
            title: 'Screen Card'
        },

    ]
});
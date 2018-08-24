import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    NetInfo,
    AsyncStorage,
    Linking,
} from 'react-native';
import reactFirebase, {Notification, NotificationOpen} from 'react-native-firebase';
// Optional: Flow type
import type {RemoteMessage} from 'react-native-firebase';
import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge';
import MainTabs from './src/MainTabs';
import  Utils from './src/utils/utils';
const tracker = new GoogleAnalyticsTracker("1:588144564200:ios:c2b8c2188ab5b13c");

export default class App extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            signin: false,
            isConnected: false,
        };

    }

    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        if (route.routes) {
            return this.getCurrentRouteName(route);
        }
        return route.routeName;
    }

    handleConnectivityChange = (connectionInfo) => {
        let connectionType = connectionInfo.type;
        if (connectionType === 'none' || connectionType === 'unknown') {
            Utils.netWorkError();
            this.setState({
                isConnected: false
            });
        } else {
            console.log('type is ', connectionType)
            this.setState({
                // connectionInfo: connectionType,
                isConnected: true
            });
        }

    }

    componentWillMount() {
        //Intial connection check
        var self = this;
        NetInfo.isConnected.fetch().then(isConnected => {
            console.log('fetch isConnected ', isConnected)
            if (isConnected) {
                self.setState({
                    isConnected: true
                });
            } else {
                self.setState({
                    isConnected: false
                });
            }
        });
        //Check connection change
        const handleFirstConnectivityChange = (isConnected) => {
            console.log('isConnected ', isConnected)
            this.setState({
                isConnected: isConnected
            });
            NetInfo.isConnected.removeEventListener('connectionChange', handleFirstConnectivityChange);
        };
        NetInfo.isConnected.addEventListener('connectionChange', handleFirstConnectivityChange);
    }


    componentDidMount() {

        NetInfo.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );
        var self = this;
        reactFirebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    console.log('enabled!!!', enabled);//1
                    reactFirebase.messaging().getToken().then(token => {
                        console.log("LOG: ", token);
                    })
                    // user has permissions
                } else {
                    console.log('enabled????', enabled);//0
                    reactFirebase.messaging().requestPermission()
                        .then(() => {
                            // alert("User Now Has Permission")
                            self.notificationOpenedListener = reactFirebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
                                reactFirebase.notifications().setBadge(0);

                            });
                            //App Closed
                            self.getInitialNotificationListener = reactFirebase.notifications().getInitialNotification()
                                .then((notificationOpen: NotificationOpen) => {
                                    if (notificationOpen) {
                                        // App was opened by a notification
                                        // Get the action triggered by the notification being opened
                                        reactFirebase.notifications().setBadge(0);

                                    } else {
                                        console.log('not opened')
                                    }
                                });
                        })
                        .catch(error => {
                            alert("Error", error)
                            // User has rejected permissions
                        });
                }
            });

    }



    componentWillUnmount() {
        this.getInitialNotificationListener();
        this.notificationOpenedListener();
    }

    render() {
        return (
            <MainTabs
                screenProps={{
                    signin: this.state.signin,
                    currentScreen: this.state.currentScreen,
                    isConnected: this.state.isConnected,

                }}
                onNavigationStateChange={(prevState, currentState) => {
                    const currentScreen = this.getCurrentRouteName(currentState);
                    const prevScreen = this.getCurrentRouteName(prevState);
                    if (prevScreen !== currentScreen) {
                        // the line below uses the Google Analytics tracker
                        // change the tracker here to use other Mobile analytics SDK.
                        tracker.trackScreenView(currentScreen);
                        this.setState({currentScreen: currentScreen})
                    }
                }}
            />
        )
    }
}
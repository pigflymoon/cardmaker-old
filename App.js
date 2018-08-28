import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    NetInfo,
    Linking,
    AppState,
    Alert,
    AsyncStorage
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

    handleAppStateChange = (nextAppState) => {
        if (nextAppState != null && nextAppState === 'active') {

            //如果是true ，表示从后台进入了前台 ，请求数据，刷新页面。或者做其他的逻辑
            if (this.flage) {
                //这里的逻辑表示 ，第一次进入前台的时候 ，不会进入这个判断语句中。
                // 因为初始化的时候是false ，当进入后台的时候 ，flag才是true ，
                // 当第二次进入前台的时候 ，这里就是true ，就走进来了。
                reactFirebase.notifications().setBadge(0);

            }
            this.flage = false;

        } else if (nextAppState != null && nextAppState === 'background') {
            this.flage = true;

        }

    }

    showAlert = () => {
        Alert.alert(
            "DON'T MISS OUT",
            "Allow notifications and receive FREE cards!",
            [
                {text: 'OK', onPress: () => this.requestNotifications()}, // open store if update is needed.
            ])
    }
    requestNotifications = () => {
        var self = this;
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
                // alert("Error", error)
                console.log('user reject permissons');
                // User has rejected permissions
            });
    }

    firstOpen = () => {
        var self = this;
        AsyncStorage.getItem('isFirst', (error, result) => {
            if (result == 'false') {
                console.log('Not first time open');
            } else {
                //save
                AsyncStorage.setItem('isFirst', 'false', (error) => {
                    reactFirebase.messaging().hasPermission()
                        .then(enabled => {
                            if (enabled) {
                                reactFirebase.messaging().getToken().then(token => {
                                    console.log("LOG: ", token);
                                })
                                // user has permissions
                            } else {
                                self.showAlert();
                            }
                        });
                });

            }
        });

    }

    componentDidMount() {
        NetInfo.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );

        this.firstOpen();
        AppState.addEventListener('change', this.handleAppStateChange);
    }


    componentWillUnmount() {
        this.getInitialNotificationListener();
        this.notificationOpenedListener();
        AppState.removeEventListener('change', this.handleAppStateChange);

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
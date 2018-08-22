import React, {Component} from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Text,
    View,
    NetInfo,
} from 'react-native';
import {GoogleAnalyticsTracker} from 'react-native-google-analytics-bridge';
import MainTabs from './src/MainTabs';
import  Utils from './src/utils/utils';
import firebase from 'react-native-firebase';
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
//

        firebase.messaging().hasPermission()
            .then(enabled => {
                if (enabled) {
                    firebase.messaging().getToken().then(token => {
                        console.log("LOG: ", token);
                    })
                    // user has permissions
                } else {
                    firebase.messaging().requestPermission()
                        .then(() => {
                            alert("User Now Has Permission")
                        })
                        .catch(error => {
                            alert("Error", error)
                            // User has rejected permissions
                        });
                }
            });
        //
        NetInfo.addEventListener(
            'connectionChange',
            this.handleConnectivityChange
        );


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
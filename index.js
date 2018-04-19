import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, SafeAreaView, View} from 'react-native';
// import App from './App';
import App from "./src/index";
class Root extends Component {
    render() {
        return (
            <SafeAreaView style={styles.safeArea} forceInset={{top: 'always', bottom: 'never'}}>
                <App/>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    }
})
AppRegistry.registerComponent('cardmaker', () => Root);
console.disableYellowBox = true
console.ignoredYellowBox = ['Remote debugger'];
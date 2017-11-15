import React, {Component} from 'react';

import {StyleSheet, Text, View, Image,TouchableOpacity} from 'react-native';


export default class PushedScreen extends Component {
    constructor(props, context) {
        super(props, context);

    }



    componentDidMount() {

    }

    render() {

        return (
            <View style={styles.container}>
                <Text>Pushed Screen</Text>
                <TouchableOpacity activeOpacity={.5} onPress={this.updateImage}>
                    <Text style={{color: '#222'}}>Update Image</Text>
                </TouchableOpacity>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

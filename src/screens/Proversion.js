import React, {Component} from 'react';
import {

    View,
    ScrollView,
    Linking,
    Image,
} from 'react-native';
import {
    Card, Text, Button
} from 'react-native-elements';

import SettingStyle from '../styles/setting';
import colors from '../styles/colors';
import probg from '../assets/images/bg1.jpg';
import buttonStyle from '../styles/button';

export default class Proversion extends Component {

    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <ScrollView style={SettingStyle.container}>
                <Card
                    title="PRO Version ($2.99)"
                    image={probg}>
                    <View style={SettingStyle.infoContainer}>
                        <Text style={[SettingStyle.fonts, SettingStyle.proTitle]} h6>Thank you for your support</Text>
                        <Text style={[SettingStyle.fonts, SettingStyle.proTitle]} h6>Love and share</Text>

                        <Text style={SettingStyle.fonts} h5>* More template </Text>
                        <Text style={SettingStyle.fonts} h5>* Unique artwork straight by designer</Text>
                        <Text style={SettingStyle.fonts} h5>* Updated variety cards, you will have surprise!</Text>
                        <Text style={SettingStyle.fonts} h5>* More upcoming features</Text>
                    </View>

                </Card>
            </ScrollView>
        )
    }

}


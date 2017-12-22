import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements';

import bg1 from '../assets/images/bg11.jpg';
import layoutStyle from '../styles/layout';
import colors from '../styles/colors';
import Copyright from '../components/Copyright';

export default class About extends Component {

    render() {
        return (
            <ScrollView style={layoutStyle.container}>
                <Card
                    title='ACKNOWLEDGEMENTS'
                    image={bg1}>
                    <Text style={{marginBottom: 10}}>
                        1. Multiple template
                        * Updated variety cards, you will have surprise!
                    </Text>
                    <Text style={{marginBottom: 10}}>
                        2. Easy to edit for instant creation
                        * you will find your festival favourite
                    </Text>
                    <Text style={{marginBottom: 10}}>
                        3. Unique artwork straight by designer
                        * All templates have been produced with love by designer
                    </Text>
                    <Text style={{marginBottom: 10}}>
                        4. Print and email
                        * Easy to use and make our world more green

                    </Text>

                </Card>
                <Copyright/>
            </ScrollView>
        );
    }
}

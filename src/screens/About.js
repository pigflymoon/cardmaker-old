import React, {Component} from 'react';
import {StyleSheet, Text, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Card, Button, List, ListItem, Icon,} from 'react-native-elements';

import bg1 from '../assets/images/bg1.jpg';
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
                        Culpa lacinia! Alias ex, varius massa, accumsan nunc, perferendis cumque? Impedit cras habitant odit odit malesuada unde porta. Dolores soluta.

                        Aspernatur eius, molestiae a primis, inventore nostra, molestias? Leo quod, minim per praesent dignissimos class doloribus impedit labore iste maiores.

                        Nulla fames qui arcu, tempus exercitationem magni cursus. Potenti, in eleifend praesentium sit laudantium nisl, penatibus, class ut. Voluptates imperdiet.
                    </Text>

                </Card>
                <Copyright/>
            </ScrollView>
        );
    }
}

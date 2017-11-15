import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {Card, Button} from 'react-native-elements'
import bg1 from '../images/bg1.jpg';


export default class SettingsTabScreen extends Component {
    constructor(props, context) {
        super(props, context);

    }


    componentDidMount() {

    }

    showModal = () => {
        this.props.navigator.showModal({
            screen: 'cardmaker.SignInScreen',
            title: 'Welcome to CardMaker'
        });
    }

    render() {

        return (
            <View style={styles.container}>
                <Card
                    title='HELLO WORLD'
                    image={bg1}>
                    <Text style={{marginBottom: 10}}>
                        The idea with React Native Elements is more about component structure than actual design.
                    </Text>
                    <Button
                        icon={{name: 'perm-identity'}}
                        backgroundColor='#03A9F4'
                        buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
                        title='Sign in /Sign up'
                        onPress={this.showModal}
                    />
                </Card>
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

import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert,} from 'react-native';

import axios from 'axios';
import {auth, db,firebaseApp} from '../config/FirebaseConfig';
import cardStyle from '../styles/card';


export default class TestScreen extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {}
    }

    getSwapiPerson = (i) => {
        return axios.get('https://swapi.co/api/people/' + i + '?format=json')
            .then(function (res) {
                return Promise.resolve({
                    id: i,
                    person: res.data
                });
            });
    };


    componentDidMount() {
        var ref = db.ref();
        var peopleRef = ref.child('/swapi/people');
        var promises = [];
        var i = 10;
        while (i--) {
            promises.push(this.getSwapiPerson(i + 1) // i will be 9…0, so add 1 to match the SWAPI api
                .then(function (res) {
                    return peopleRef.child(res.id).set(res.person);
                }));
        }

        Promise.all(promises)
            .then(function () {
                console.log('Swapi data loaded');
                // process.exit();
                firebaseApp.delete();
            })
            .catch(function (err) {
                console.log('Swapi data load error', err);
                firebaseApp.delete();
            });
    }


    render() {
        return (
            <View style={cardStyle.cardsContainer}>

                <Text>Test</Text>
            </View>
        );
    }
}




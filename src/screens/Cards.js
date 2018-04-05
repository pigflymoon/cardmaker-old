import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, TouchableOpacity} from 'react-native';

import {Button, Card, Icon, ButtonGroup} from 'react-native-elements';
import {auth, db} from '../config/FirebaseConfig';

import layoutStyle from '../styles/layout';
import colors from '../styles/colors';

import CardsDeck from './CardsDeck';
var savedCards = [];
const component1 = () => <Text>Birthday</Text>
const component2 = () => <Text>Holiday</Text>
const component3 = () => <Text>Wedding</Text>
const component4 = () => <Text>Others</Text>


export default class Cards extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            cardsData: [],
            selectedIndex: 0,
            index: 0,
            cardType: 'birthdayImages',

            // likedCards: [],
            // dislikedCards: [],
        }
    }

    //right  header
    static navigationOptions = ({navigation}) => {
        // console.log('savedCards in navigation',savedCards)
        return ({
            headerRight: (
                <TouchableOpacity style={{paddingRight: 5}}>
                    <Icon name={"edit"} type="font-awesome" size={28} color={colors.primary1}
                          onPress={() => navigation.navigate('MyCard', {
                              likedCards: savedCards,
                          })}/>
                </TouchableOpacity>
            )
        });
    }

    updateIndex = (selectedIndex) => {
        console.log('selectedIndex', selectedIndex)

        let showTypes = ['birthdayImages', 'holidayImages', 'weddingImages', 'otherImages'];

        this.setState({selectedIndex: selectedIndex}, function () {
            for (let type of showTypes) {
                console.log('type is ', type)
                let index = showTypes.indexOf(type);

                if (this.state.selectedIndex === index) {
                    let index = showTypes.indexOf(type);
                    console.log('index is ', index, 'value is ', type)
                    this.setState({cardType: type});

                }

            }
        })

        // this.setState({selectedIndex})
    }

    componentWillMount() {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    self.setState({signin: true, authUser, isPaidUser: isPaidUser});

                });
            } else {
                self.setState({signin: false});

            }
        });

    }

    handleSavedCards = (likedCards) => {
        console.log('likedCards', likedCards)
        savedCards = likedCards;
        // this.setState({savedCard: savedCard})
    }

    render() {
        const buttons = [{element: component1}, {element: component2}, {element: component3}, {element: component4}]
        const {selectedIndex} = this.state
        return (
            <View style={layoutStyle.container}>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{height: 40}}/>
                <CardsDeck cardType={this.state.cardType}
                           isPaidUser={this.state.isPaidUser}
                           onSavedCards={this.handleSavedCards}
                />

            </View>
        );
    }
}


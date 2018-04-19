import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, AsyncStorage, TouchableOpacity} from 'react-native';

import {Button, Card, Icon, ButtonGroup} from 'react-native-elements';
// import {auth, db} from '../../config/FirebaseConfig';
import {USER_KEY} from "../../auth";

import layoutStyle from '../../styles/layout';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import buttonStyle from '../../styles/button';

import CardsDeck from '../../components/CardsDeck';
var savedCards = [];
const component1 = () => <Text>Birthday</Text>
const component2 = () => <Text>Holiday</Text>
const component3 = () => <Text>Wedding</Text>
const component4 = () => <Text>Others</Text>


export default class MyCardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            showSignCard: true,
            welcomeCard: false,
            cardsData: [],
            selectedIndex: 0,
            index: 0,
            cardType: 'birthdayImages',
        }
    }

    //right  header
    static navigationOptions = ({navigation}) => {
        const params = navigation.state.params || {};

        if (params.signin) {
            return ({
                headerRight: (
                    <TouchableOpacity style={{paddingRight: 5}}>
                        <Icon name={"edit"} type="font-awesome" size={28} color={colors.secondary2}
                              onPress={() => navigation.navigate('MyCards', {
                                  likedCards: savedCards,
                              })}/>
                    </TouchableOpacity>
                )
            });
        } else {
            return {
                headerRight: false,
            };
        }

    };


    updateIndex = (selectedIndex) => {
        let showTypes = ['birthdayImages', 'holidayImages', 'weddingImages', 'otherImages'];

        this.setState({selectedIndex: selectedIndex}, function () {
            for (let type of showTypes) {
                let index = showTypes.indexOf(type);

                if (this.state.selectedIndex === index) {
                    this.setState({cardType: type});
                }
            }
        })

    }
    navigateToSignin = () => {
        this.props.navigation.navigate('Signin', {});
    }

    componentDidMount() {
        var self = this;
        AsyncStorage.getItem(USER_KEY)
            .then(userDataJson => {
                if (userDataJson !== null) {
                    console.log('user is ',userDataJson)
                    let userData = JSON.parse(userDataJson);
                    self.setState({signin: true,  isPaidUser: userData.isPaidUser});
                    self.props.navigation.setParams({
                        signin: true,
                        isPaidUser: userData.isPaidUser,
                        headerRight: true,
                    });
                    // self.props.navigation.navigate("SignedIn");
                } else {
                    console.log('not sign in')
                    self.setState({signin: false});
                    self.props.navigation.setParams({
                        signin: false,
                        headerRight: false,
                    });
                }
            })
            .catch(err => reject(err));
        /*
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    self.setState({signin: true, authUser, isPaidUser: isPaidUser});
                    self.props.navigation.setParams({
                        signin: true,
                        isPaidUser: isPaidUser,
                        headerRight: true,
                    });
                });
            } else {
                self.setState({signin: false});
                self.props.navigation.setParams({
                    signin: false,
                    headerRight: false,
                });

            }
        });
        */
    }

    componentWillUnmount() {
        savedCards = [];
    }

    handleSavedCards = (likedCards) => {
        savedCards = likedCards;
    }

    renderSignCard() {
        return (
            <Card title='Welcome to cardmaker'>
                <Text style={{marginBottom: 10}}>
                    Please sign in then choose picture to make card
                </Text>
                <Button
                    icon={{name: 'perm-identity', color: colors.secondary2}}
                    color={colors.secondary2}
                    buttonStyle={buttonStyle.submitButton}
                    title='Sign in / Sign up'
                    onPress={this.navigateToSignin}
                    underlayColor={colors.grey6}
                />
            </Card>
        );
    }

    render() {
        const buttons = [{element: component1}, {element: component2}, {element: component3}, {element: component4}]
        const {selectedIndex} = this.state
        if (this.state.signin) {
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
        // else {
        //     return (
        //         <View style={cardStyle.container}>
        //             {this.renderSignCard()}
        //         </View>
        //     )
        // }

    }
}


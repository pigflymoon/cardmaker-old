import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    TouchableOpacity,
    ImageBackground,
    LayoutAnimation,
    UIManager,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';

import {Button, Card, Icon, ButtonGroup} from 'react-native-elements';
import {auth, db} from '../../config/FirebaseConfig';
import  Utils from '../../utils/utils';

import layoutStyle from '../../styles/layout';
import colors from '../../styles/colors';

import {
    renderAuthBox,
} from '../../utils/authApi';
import CardDeck from '../../components/CardDeck';
import ImageTypeTab from '../../components/ImageTypeTab';

import CategoryConfig from '../../config/CategoryConfig';

var savedCards = [], paidUser = false;

export default class CardsDeck extends Component {
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
            selectedName: 'christmas',//default
            selectedValue: true,
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
                                  isPaidUser: paidUser
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

    componentDidMount() {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    self.setState({signin: true, authUser, isPaidUser: isPaidUser});
                    paidUser = isPaidUser;
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
    }

    componentWillUnmount() {
        savedCards = [];
    }

    handleSavedCards = (likedCards) => {
        savedCards = likedCards;
    }
    updateUserType = (type) => {
        paidUser = type;
    }
    renderTabs = (imageType) => {
        let imagesTypes = (imageType == 'cards') ? CategoryConfig.cards : CategoryConfig.invitations;
        return (
            Object.keys(imagesTypes).map((imagesType, key) => {
                return (
                    <View style={{flex: 1,}} key={key}>
                        <Text style={{
                            justifyContent: 'center',
                            paddingHorizontal: 30,
                            paddingVertical: 10,
                        }}>{imagesType}</Text>
                        {imagesTypes[imagesType].map((type, index) => {
                            return (
                                <ImageTypeTab key={index}
                                              category={imageType}
                                              imageType={type}
                                              selectedName={this.state.selectedName}
                                              selectedValue={this.state.selectedValue}
                                              handleSelect={this.onHandleSelect}/>
                            )
                        })}
                    </View>
                )

            })
        )

    }

    render() {
        var isConnected = this.props.screenProps.isConnected;
        var navigation = this.props.navigation;

        if (!isConnected) {
            return Utils.renderOffline();
        }
        const {selectedIndex} = this.state
        const imageType = 'cards'
        const buttons = ['Cards', 'Invitations']
        if (this.state.signin) {
            return (
                <View style={layoutStyle.container}>

                    <ScrollView style={{flex: 1, flexDirection: 'column',  height:220}}>
                        <ButtonGroup
                            onPress={this.updateIndex}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{height: 30}}
                        />
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                            {this.renderTabs(imageType)}
                        </View>
                    </ScrollView>

                    <CardDeck
                        cardType={this.state.cardType}
                        isPaidUser={this.state.isPaidUser}
                        onSavedCards={this.handleSavedCards}
                        onRefreshUser={this.updateUserType}/>
                </View>


            );

        } else {
            {
                return renderAuthBox(this.state.isLoading, navigation)
            }
        }

    }
}


import React, {Component} from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import {Icon, ButtonGroup} from 'react-native-elements';
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
var savedCards = [], paidUser = false, category = 'cards';

export default class CardsDeck extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            selectedIndex: 0,
            imageType: 'cards/christmas',
            category: 'cards',
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
                                  isPaidUser: paidUser,
                                  category: category
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

    onHandleSelect = (selectedName, selectedValue, type, category) => {
        var self = this;
        var imageType;
        console.log('fetch type  is ********', type)
        if (category == 'cards') {
            switch (type) {
                case 'cards':
                    imageType = 'updatedcards';
                    break;
                case 'christmas' :
                case 'newYear' :
                case 'easter' :
                case 'kids' :
                case 'forHer' :
                case 'forHim' :
                case 'general' :
                case 'birthday' :
                case 'wedding' :
                    imageType = `cards/${type}`;
                    break;

            }
        } else {//
            switch (type) {
                case 'invitations':
                    imageType = 'updatedinvitations';
                    break;
                case 'christmas' :
                case 'newYear' :
                case 'easter' :
                case 'kids' :
                case 'women' :
                case 'men' :
                case 'invitation' :
                case 'saveTheDate' :
                case 'rsvp' :
                    imageType = `invitations/${type}`;
                    break;
            }
        }


        this.setState((prevState) => {
            if (prevState.type != type) {
                return {
                    selectedName: selectedName,
                    selectedValue: selectedValue,
                    type: type,
                    loading: false,
                    imageType: imageType
                }
            }
        })
    }
    //
    updateCategory = (selectedIndex) => {
        let imagesTypes = (selectedIndex == 0) ? 'cards' : 'invitations';
        category = imagesTypes;
        this.setState({selectedIndex: selectedIndex, category: imagesTypes});
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
        const {selectedIndex, category} = this.state
        const buttons = ['Cards', 'Invitations']
        if (this.state.signin) {
            return (
                <View style={layoutStyle.container}>
                    <ScrollView style={{flex: 1, flexDirection: 'column', height: 220}}>
                        <ButtonGroup
                            onPress={this.updateCategory}
                            selectedIndex={selectedIndex}
                            buttons={buttons}
                            containerStyle={{height: 30}}
                            selectedButtonStyle={{backgroundColor: colors.secondary2}}
                            selectedTextStyle={{color: colors.white}}
                        />
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                            {this.renderTabs(category)}
                        </View>
                    </ScrollView>
                    <CardDeck
                        imageType={this.state.imageType}
                        isPaidUser={this.state.isPaidUser}
                        onSavedCards={this.handleSavedCards}
                        onRefreshUser={this.updateUserType}/>
                </View>
            );

        } else {
            return renderAuthBox(this.state.isLoading, navigation)
        }

    }
}



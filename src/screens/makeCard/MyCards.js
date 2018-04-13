import React, {Component} from 'react';
import {
    Text,
    View,
    Alert,
    ImageBackground,
    TouchableHighlight,
    TouchableOpacity,
} from 'react-native';

import GridView from 'react-native-super-grid';
import {auth} from '../../config/FirebaseConfig';

import {Icon, Card, Button} from 'react-native-elements';

import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';

import cardStyle from '../../styles/card';
import buttonStyle from '../../styles/button';
var makeCard = [];
export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            makeCards: null,
            chooseCards: [],
            signin: false,
            selectedIndex: 0,
            selectedItem: [{id: '0', value: '0'}],
        }

    }

    //right  header
    static navigationOptions = ({navigation}) => {
        return ({
            headerRight: (
                <TouchableOpacity style={{paddingRight: 5}}>
                    <Icon name={"edit"} type="font-awesome" size={28} color={colors.secondary2}
                          onPress={() => {
                              {
                                  navigation.navigate('MakeCard', {
                                      chooseCards: makeCard,
                                      signin: true
                                  });
                              }

                          }}/>
                </TouchableOpacity>
            )
        });
    }

    initialSelectedItem = (chooseCards) => {
        var result = chooseCards.map(card => ({id: card.id, value: false}));
        return result;
    }

    componentDidMount() {
        console.log('my cards list called')
        var self = this;
        if (this.props.navigation.state.params) {
            var chooseCards = this.props.navigation.state.params.likedCards;
            var signin = this.props.navigation.state.params.signin;

            if (chooseCards.length > 0) {
                this.setState({
                    signin: signin,
                    chooseCards: chooseCards,
                    selectedItem: this.initialSelectedItem(chooseCards)
                })
            }
        }


        auth.onAuthStateChanged(function (user) {
            if (!user) {
                self.setState({signin: false, chooseCards: []})
            } else {
                self.setState({signin: true})
            }
        });


    }

    componentWillReceiveProps(nextProps) {
        var chooseCards = nextProps.navigation.state.params.likedCards;
        this.setState({chooseCards: chooseCards, selectedItem: this.initialSelectedItem(chooseCards)});

    }

    componentWillUnmount() {
        this.setState({chooseCards: []})
    }

    chooseCard = (card) => {
        var selectedItem = this.initialSelectedItem(this.state.chooseCards);

        var selectedIndex = 0;
        selectedItem.forEach(function (item, i) {
            if (card.id == item.id) {
                item.value = !item.value;
                selectedIndex = i;
            }

        });
        makeCard = card;
        this.setState({
            makeCards: card,
            selectedItem,
            selectedIndex: selectedIndex
        });

    }

    getItemColor = (item) => {
        var items = this.state.selectedItem;
        if ((items[this.state.selectedIndex].id == item.id) && (items[this.state.selectedIndex].value == true)) {
            return colors.primary3;
        } else {
            return colors.secondary2;
        }
    }

    renderHeader() {
        return (
            <View style={cardStyle.header}>
                <View style={cardStyle.headerCenter}>
                    <View style={cardStyle.titleContainer}>
                        <Text style={cardStyle.title}>1. choose your card by just click it</Text>
                    </View>
                    <View style={cardStyle.titleContainer}>
                        <Text style={cardStyle.title}>2. Then make your own card</Text>
                    </View>
                </View>

            </View>
        );
    }

    navigateToSignin = () => {
        this.props.navigation.navigate('Signin', {});
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

    renderCards() {
        return (
            <GridView
                itemWidth={130}
                items={this.state.chooseCards}
                style={cardStyle.gridView}
                renderItem={(item) => (
                    <TouchableHighlight onPress={() => this.chooseCard(item)}
                                        underlayColor={colors.primary3}>
                        <View
                            style={[cardStyle.itemContainer, {backgroundColor: this.getItemColor(item)}]}>
                            <ImageBackground source={{uri: item.illustration}} style={cardStyle.imageContainer}>
                                <Text style={cardStyle.itemName}>{item.title}</Text>
                            </ImageBackground>
                        </View>
                    </TouchableHighlight>
                )}
            />
        );
    }

    render() {
        var renderCard = ((this.state.chooseCards.length > 0) && this.state.signin);
        var renderSign = this.state.signin;

        if (renderCard) {
            return (
                <View style={layoutStyle.container}>
                    {this.renderCards()}
                </View>
            )
        }
        if (!renderSign) {
            return (
                <View style={layoutStyle.container}>
                    {this.renderSignCard()}
                </View>
            )
        } else {
            return (
                <View style={layoutStyle.container}>
                    {this.renderHeader()}
                </View>
            )
        }


    }

}




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
import Ionicons from 'react-native-vector-icons/Ionicons';

import bg from '../../assets/images/noWifiBg.png';

import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';
import cardStyle from '../../styles/card';
import showInfo from '../../styles/showInfo';

import {
    renderAuthBox,
} from '../../utils/authApi';
var makeCard = {};
export default class MyCards extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            makeCards: null,
            chooseCards: [],
            signin: false,
            selectedIndex: 0,
            selectedItem: [{id: '0', value: '0'}],
            category: 'cards',
        }

    }

    //right  header
    static navigationOptions = ({navigation}) => {
        var isPaidUser = navigation.state.params.isPaidUser;
        return ({
            headerRight: (
                <TouchableOpacity style={{paddingRight: 5}}>
                    <Icon name={"edit"} type="font-awesome" size={28} color={colors.secondary2}
                          onPress={() => {
                              {
                                  navigation.navigate('MakeInvitation', {//MakeCard MakeInvitation
                                      chooseCards: makeCard,
                                      signin: true,
                                      isPaidUser: isPaidUser
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
        var self = this;
        if (this.props.navigation.state.params) {
            const {likedCards, signin, category} = this.props.navigation.state.params;
            if (likedCards.length > 0) {
                this.setState({
                    signin: signin,
                    chooseCards: likedCards,
                    selectedItem: this.initialSelectedItem(likedCards),
                    category: category
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
        // var chooseCards = nextProps.navigation.state.params.likedCards;
        const {likedCards, category} = nextProps.navigation.state.params;
        console.log('likedcards are', likedCards, 'category is ', category)

        this.setState({
            chooseCards: likedCards,
            category: category,
            selectedItem: this.initialSelectedItem(likedCards)
        });

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
            return colors.secondary2;
        } else {
            return colors.grey4;
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

    renderEmptyStates = () => {
        return (
            <View style={cardStyle.container}>
                <ImageBackground
                    source={bg}
                    style={{
                        flex: 1,
                        width: null,
                        height: 400,
                    }}
                >
                    <View style={showInfo.container}><Text style={showInfo.greyText}>Oops,No cards!</Text>
                        <TouchableOpacity style={{
                            paddingLeft: 8,
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'flex-start'
                        }}>
                            <Ionicons
                                name={'ios-return-left'}
                                size={28}
                                style={{color: colors.secondary2, paddingRight: 20,}}
                                onPress={() => {
                                    {
                                        this.props.navigation.goBack();
                                    }

                                }}
                            />
                            <Text style={showInfo.greyText}>Start Swiping to choose. Enjoy!</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground >

            </View>
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
                                        underlayColor={colors.secondary2}>
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
        var navigation = this.props.navigation;

        if (renderCard) {
            return (
                <View style={layoutStyle.container}>
                    {this.renderCards()}
                </View>
            )
        }
        if (!renderSign) {
            {
                return renderAuthBox(this.state.isLoading, navigation)
            }
        } else {
            return (
                <View style={layoutStyle.container}>
                    {this.renderEmptyStates()}
                </View>
            )
        }


    }

}




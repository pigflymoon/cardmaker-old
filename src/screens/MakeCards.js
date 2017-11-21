import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';

import {Button, Card, Icon,} from 'react-native-elements';


import colors from '../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;


export default class MyCards extends Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showSignCard: false,
            // cardsData: [],
            myCards: [],
            color: 'green',

        }
    }




    componentDidMount() {
        console.log('*************Swipe card this.props*********', this.props)
        //

    }
    componentWillReceiveProps(nextProps) {
        var likedCards = nextProps.navigation.state.params.likedCards;
        this.setState({myCards: likedCards});
    }


    renderNoMoreCards() {
        // this.setState({likedCards: likedCards});
        return (
            <Card
                containerStyle={{
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.92,
                    height: SCREEN_HEIGHT - 165,
                }}
                featuredTitle="No more cards"
                featuredTitleStyle={{fontSize: 25}}
                image={{uri: 'https://i.imgflip.com/1j2oed.jpg'}}
                imageStyle={{
                    borderRadius: 10,
                    width: SCREEN_WIDTH * 0.915,
                    height: SCREEN_HEIGHT - 165,
                }}
            />
        );
    }

    renderHeader() {
        return (
            <View style={styles.header}>
                {this.state.showSignCard ?
                    <View style={styles.headerLeftIcon}>
                        <Icon name="user" type="font-awesome" color="#ccc" size={35}/>
                    </View> : null}
                <View style={styles.headerCenter}>
                    <View style={styles.headerCenterToggleContainer}>
                        <View style={styles.headerCenterToggleLeft}>
                            <Icon
                                name="bookmark"
                                color="#fff"
                                size={28}
                            />
                        </View>

                    </View>
                </View>
                <View style={styles.headerRightIcon}>
                    <Icon name="card-giftcard" color={colors.primary1} size={35}
                          onPress={this.gotoMakeCards}
                    />
                </View>
            </View>
        );
    }


    render() {
        return (
            <View style={styles.container}>
                {this.renderHeader()}
                <View style={styles.deck}>
                  <Text>Make cards</Text>
                </View>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    header: {
        height: 64,
        paddingTop: 35,
        flexDirection: 'row',
    },
    headerLeftIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 15,
    },
    headerCenter: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerCenterToggleContainer: {
        flexDirection: 'row',
        width: 160,
        height: 45,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    headerCenterToggleLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        borderRadius: 30,
    },
    headerCenterToggleRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    deck: {
        flex: 1,
    },
    footer: {
        height: 64,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    footerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 10,
    },
});



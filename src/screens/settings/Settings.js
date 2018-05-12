import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    AppState,
    Platform,
    Item,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    Image,
    ImageBackground
} from 'react-native';
import VersionCheck from 'react-native-version-check';

import {List, ListItem,} from 'react-native-elements';
import * as StoreReview from 'react-native-store-review';
import {auth, db} from '../../config/FirebaseConfig';
import probg from '../../assets/images/bg.jpg';
import graybg from '../../assets/images/bg-grey.jpg';

import {
    onRestore,
    upDateRole
} from '../../utils/AppPay';

import Config from '../../config/ApiConfig';
import Utils from '../../utils/utils';

import colors from '../../styles/colors';
import listStyle from '../../styles/list';
export default class Settings extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            version: '2.0.1',
            isPro: 'DISABLED',
            versionColor: colors.grey2,
            bgImage: graybg,
            unlock: false,
            showProData: false,//remove in-purchase

        };
    }

    onAbout = () => {
        this.props.navigation.navigate('About', {});
    };

    onShare = () => {
        const message = 'I am using Cardmaker App. Life is s more meaningful when you share with others! :) Download Cardmaker App for iOS, and start make cards for your families and friends today!'
        const url = Config.share.url;
        Utils.shareText(message, url)
    }

    onRate = () => {
        let link = 'https://itunes.apple.com/nz/app/cardmaker-app/id1318023993';
        //
        if (Platform.OS === 'ios') {
            if (StoreReview.isAvailable) {
                return StoreReview.requestReview();
            }

        }

        return Utils.goToURL(link);
    }

    titleStyle = () => {
        const {showProData} = this.state;
        if (showProData) {
            return {
                color: colors.secondary2
            }
        } else {
            return {
                color: colors.red1
            }
        }

    }

    getUserRole = () => {
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                db.ref('/users/' + userId).once('value').then(function (snapshot) {
                    var userrole = (snapshot.val() && snapshot.val().role) || {free_user: true, paid_user: false};
                    var isPaidUser = userrole.paid_user;
                    if (isPaidUser) {
                        self.setState({
                            showProData: true,
                            isPro: 'Available'
                        });
                    }

                });
            } else {
                self.setState({
                    showProData: false,
                    isPro: 'DISABLED'
                });
            }
        });
    }

    onUnlock = data => {
        console.log('return  data is ', data);
        var unlock = data.unLock;

        if (unlock === true) {
            // AsyncStorage.setItem("isPro", 'true');
            this.setState({
                showProData: true,
                isPro: 'Available',
                unlock: true,
                bgImage: probg,
                versionColor: colors.secondary2,
            }, function () {
                upDateRole();
            });
        }

    };
    toggleUnlockSwitch = (value) => {
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});

    }

    restorePurchase = () => {
        var self = this;
        onRestore().then(function (restoreResponse) {
            console.log('restoreResponse', restoreResponse)
            if (restoreResponse.restore) {
                self.setState({
                    showProData: true,
                    isPro: 'Available',
                    unlock: true,
                    bgImage: probg,
                    versionColor: colors.secondary2,
                });
                //update db user
                upDateRole();
                Alert.alert('Restore Successful', 'Successfully restores all your purchases.');

            }
        })

    }

    componentWillMount() {

        VersionCheck.getLatestVersion({
            provider: 'appStore'  // for iOS
        })
            .then(latestVersion => {
                console.log(latestVersion);    // 0.1.2
                this.setState({version: latestVersion})
            });
    }

    componentDidMount() {
        this.getUserRole();
    }

    render() {
        return (
            <ScrollView>
                <View>
                    <ImageBackground
                        source={this.state.bgImage}
                        style={{
                            flex: 1,
                            height: 120,

                        }}>
                        <List containerStyle={{backgroundColor: 'transparent', borderTopWidth: 0,}}>
                            <ListItem
                                containerStyle={{borderBottomWidth: 0,}}
                                hideChevron
                                leftIcon={{name: 'vpn-key', color: colors.secondary2}}
                                title={`Unlock Pro Version`}
                                titleStyle={{color: colors.secondary2, fontWeight: 'bold'}}
                                switchOnTintColor={colors.primary1}
                                switchTintColor={colors.secondary2}
                                switchButton
                                onSwitch={this.toggleUnlockSwitch}
                                switched={this.state.unlock}
                            />
                        </List>

                    </ImageBackground>
                </View>
                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'refresh', color: colors.secondary2}}
                        title={`Restore Purchase`}
                        onPress={this.restorePurchase}
                        hideChevron
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: this.state.versionColor}}
                        title={`PRO Version`}
                        titleStyle={this.titleStyle()}
                        rightTitle={this.state.isPro}
                        rightTitleStyle={this.titleStyle()}
                        hideChevron
                    />

                </List>
                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'chat', color: colors.orange1}}
                        title={`Tell a friend`}
                        onPress={() => this.onShare()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.red1}}
                        title={`Rate us`}
                        onPress={() => this.onRate()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'info', color: colors.purple1}}
                        title={`About`}
                        onPress={() => this.onAbout()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'perm-device-information', color: colors.primary2}}
                        hideChevron
                        title={`Version`}
                        subtitle={this.state.version}
                    />
                </List>
            </ScrollView>
        )
    }

}

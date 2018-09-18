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
    ImageBackground,
    AsyncStorage
} from 'react-native';
import VersionCheck from 'react-native-version-check';
import {List, ListItem,} from 'react-native-elements';
import * as StoreReview from 'react-native-store-review';
import reactFirebase, {Notification, NotificationOpen} from 'react-native-firebase';
import type {RemoteMessage} from 'react-native-firebase';


import LanguageRespository from '../../utils/LanguageRespository';
import DeviceInfo from 'react-native-device-info'

import {auth, db} from '../../config/FirebaseConfig';
import probg from '../../assets/images/bg.jpg';
import graybg from '../../assets/images/bg-grey.jpg';

import {
    onRestore,
    upDateRole
} from '../../utils/AppPay';


import {I18n} from '../../config/language/I18n'

import Config from '../../config/ApiConfig';
import Utils from '../../utils/utils';

import colors from '../../styles/colors';
import listStyle from '../../styles/list';
export default class Settings extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            version: '2.1.4',
            isPro: 'Disabled',
            versionColor: colors.grey2,
            bgImage: graybg,
            unlock: false,
            isNotified: true,
            isSilent: true,
            localeLanguage: null,
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
        const {unlock} = this.state;
        if (unlock) {
            return {
                color: colors.green
            }
        } else {
            return {
                color: colors.red
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
                            // showProData: true,
                            isPro: 'Available',
                            unlock: true,
                            bgImage: probg,
                            versionColor: colors.orange,
                        });
                    }

                });
            } else {
                self.setState({
                    // showProData: false,
                    unlock: false,
                    isPro: 'Disabled'
                });
            }
        });
    }

    onUnlock = data => {
        var unlock = data.unLock;

        if (unlock === true) {
            this.setState({
                showProData: true,
                isPro: 'Available',
                unlock: true,
                bgImage: probg,
                versionColor: colors.green,
            }, function () {
                upDateRole();
            });
        }

    };
    toggleUnlockSwitch = () => {
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});
    }

    restorePurchase = () => {
        var self = this;
        onRestore().then(function (restoreResponse) {
            if (restoreResponse.restore) {
                self.setState({
                    // showProData: true,
                    isPro: 'Available',
                    unlock: true,
                    bgImage: probg,
                    versionColor: colors.green,
                });
                //update db user
                upDateRole();
                Alert.alert('Restore Successful', 'Successfully restores all your purchases.');

            }
        })

    }

    linkToNotification = () => {
        Linking.canOpenURL('app-settings:').then(supported => {
            if (!supported) {
                console.log('Can\'t handle settings url');
            } else {
                return Linking.openURL('app-settings:');
            }
        }).catch(err => console.error('An error occurred', err));
        //


    }


    componentWillMount() {
        VersionCheck.getLatestVersion({
            provider: 'appStore'  // for iOS
        })
            .then(latestVersion => {
                this.setState({version: latestVersion})
            });

        let locale = DeviceInfo.getDeviceLocale();

        console.log('locale is :', locale);
        new LanguageRespository().saveLocalRepository('localLanguage', locale, (error) => {
            if (error) {
                alert(error);
            }
        });
    }

    componentDidMount() {
        this.getUserRole();
    }

    refreshLanguage = (index) => {
        switch (index) {
            case 0:
                I18n.locale = 'en-US';
                break;
            case 1:
                I18n.locale = 'zh-Hans-US';
                break;
            case 2:
                I18n.locale = DeviceInfo.getDeviceLocale();
                break;
        }

        this.setState({
            localeLanguage: I18n.locale
        });

    };

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
                                leftIcon={{name: 'vpn-key', color: colors.green}}
                                title={`Unlock Pro Version`}
                                titleStyle={{color: colors.green, fontWeight: 'bold'}}
                                switchOnTintColor={colors.green}
                                switchTintColor={colors.green}
                                switchButton
                                onSwitch={this.toggleUnlockSwitch}
                                switched={this.state.unlock}
                            />
                        </List>
                    </ImageBackground>
                </View>
                <List containerStyle={listStyle.listContainer}>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'refresh', color: colors.green}}
                        title={`Restore Purchase`}
                        onPress={this.restorePurchase}
                        hideChevron
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'wb-incandescent', color: this.state.versionColor}}
                        title={`PRO Version`}
                        titleStyle={this.titleStyle()}
                        rightTitle={this.state.isPro}
                        rightTitleStyle={this.titleStyle()}
                        hideChevron
                    />
                </List>
                <List containerStyle={listStyle.listContainer}>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.red}}
                        title={`Rate on the App Store`}
                        onPress={() => this.onRate()}
                        hideChevron

                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'chat', color: colors.secondary2}}
                        title={`Tell a friend`}
                        onPress={() => this.onShare()}
                        hideChevron
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'notifications', color: colors.orange}}
                        title={`Notifications`}
                        switchOnTintColor={colors.primary1}
                        switchButton
                        onPress={this.linkToNotification}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'notifications', color: colors.orange}}
                        title={I18n.t('changeToChinese')}
                        switchOnTintColor={colors.primary1}
                        switchButton
                        onPress={()=>this.refreshLanguage(1)}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'info', color: colors.tealBlue}}
                        title={`About`}
                        onPress={() => this.onAbout()}
                        chevronColor={colors.grey5}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'perm-device-information', color: colors.purple}}
                        hideChevron
                        title={`Version`}
                        subtitle={this.state.version}
                    />
                </List>
            </ScrollView>
        )
    }

}

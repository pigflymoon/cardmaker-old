import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    AppState,
    Platform,
    AsyncStorage,
    Item,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    Image,
} from 'react-native';
import VersionCheck from 'react-native-version-check';

import {List, ListItem, Card, Icon} from 'react-native-elements';
import * as StoreReview from 'react-native-store-review';
import {NativeModules} from 'react-native';
const {InAppUtils}  = NativeModules;
import axios from 'axios';
import {auth, db} from '../../config/FirebaseConfig';

import {
    upDateRole
} from '../../utils/AppPay';

var verifysandboxHost = Config.receiptVerify.Host.sandboxHost;
var verifyHost = verifysandboxHost;

// var verifyproductionHost = Config.receiptVerify.Host.productionHost;
// var verifyHost = verifyproductionHost;

import {onceGetReceipts, doCreateReceipt} from '../../config/db';

import Config from '../../config/ApiConfig';
import Utils from '../../utils/utils';

import colors from '../../styles/colors';
import listStyle from '../../styles/list';
import SettingStyle from '../../styles/setting';
export default class Settings extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            version: '2.0.1',
            isPro: 'DISABLED',
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


    onPay = () => {
        var self = this;
        InAppUtils.canMakePayments((enabled) => {

            if (enabled) {
                var productIdentifier = Config.products.productIdentifier;
                var products = [
                    productIdentifier,
                ];

                InAppUtils.loadProducts(products, (error, products) => {
                    //update store here.
                    var productIdentifier = Config.products.productIdentifier;
                    InAppUtils.purchaseProduct(productIdentifier, (error, response) => {
                        // NOTE for v3.0: User can cancel the payment which will be available as error object here.
                        //transactionReceipt
                        if (response && response.transactionReceipt) {
                            InAppUtils.receiptData((error, receiptData) => {
                                if (error) {
                                    Alert.alert('itunes Error', 'Receipt not found.');
                                } else {
                                    //send to validation server
                                    axios.post(verifyHost, {
                                        'receipt-data': receiptData,
                                    })
                                        .then(function (response) {
                                            if (response.data.receipt) {
                                                self.sendRecipt(response.data.receipt);
                                                var status = response.data.status;
                                                var statusCode = Config.receiptVerify.statusCode;
                                                for (var prop in statusCode) {
                                                    if (status == prop) {
                                                        if (status == 0) {
                                                            AsyncStorage.setItem("isPro", 'true');
                                                            self.setState({
                                                                showProData: true,
                                                                isPro: 'Available'
                                                            }, function () {
                                                                // AsyncStorage.setItem('dataSource', 'true');
                                                                this.upDateRole();
                                                            });


                                                            //
                                                        } else {
                                                            Alert.alert('Message: ' + statusCode[prop].message);
                                                        }
                                                    }
                                                }
                                            } else {
                                                Alert.alert('Please try later.')
                                            }

                                        })
                                        .catch(function (error) {
                                            Alert.alert(error)
                                        })
                                }
                            });
                        }

                    });
                });

            } else {
                Alert.alert('IAP disabled');
            }
        });
    }

    onRestore = () => {
        InAppUtils.restorePurchases((error, response) => {
            if (error) {
                Alert.alert('itunes Error', 'Could not connect to itunes store.');
            } else {
                if (response.length === 0) {
                    Alert.alert('No Purchases', "We didn't find any purchases to restore.");
                    return;
                } else {
                    var productIdentifier = Config.products.productIdentifier;

                    response.forEach((purchase) => {
                        if (purchase.productIdentifier === productIdentifier) {
                            // Handle purchased product.
                            this.setState({showProData: true, isPro: 'Available'});
                            // AsyncStorage.setItem('dataSource', 'true');
                            //update db user
                            this.upDateRole();

                            Alert.alert('Restore Successful', 'Successfully restores all your purchases.');

                        }
                    });
                }

            }
        });
    }

    onProversion = () => {
        this.props.navigation.navigate('Proversion', {});
    }

    sendRecipt = (receipt) => {
        var transactionKey = ((receipt.in_app)[0].transaction_id) ? ( (receipt.in_app)[0].transaction_id).toString() : null;
        if (transactionKey) {
            onceGetReceipts().then(snapshot => {
                if (snapshot) {
                    if (snapshot.hasChild(transactionKey)) {
                        console.log('exists')
                    } else {
                        // Create a receipt in your own accessible Firebase Database too
                        doCreateReceipt(transactionKey, receipt)
                            .then(() => {
                                console.log('Got the receipt!')
                                // user.updateProfile({displayName: self.state.name});
                                // console.log('email', email)
                                // self.props.navigation.navigate('VerifyEmail', {user: user, email: email});
                            })
                            .catch(error => {
                                console.log(('error', error))
                            });
                        //
                    }
                }
            });


        }
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
            AsyncStorage.setItem("isPro", 'true');
            this.setState({
                showProData: true,
                isPro: 'Available',
                unlock: true,
            }, function () {
                upDateRole();
            });
        }

        // this.setState(data);
    };
    toggleUnlockSwitch = (value) => {
        console.log('unlock', value)
        this.props.navigation.navigate("UnLock", {onUnlock: this.onUnlock});

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
                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        hideChevron
                        leftIcon={{name: 'notifications', color: colors.grey2}}
                        title={` It's Ok to want them all!`}
                        switchOnTintColor={colors.primary1}
                        switchButton
                        onSwitch={this.toggleUnlockSwitch}
                        switched={this.state.unlock}
                    />

                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.grey2}}
                        title={`PRO Version`}
                        titleStyle={this.titleStyle()}
                        rightTitle={this.state.isPro}
                        rightTitleStyle={this.titleStyle()}
                        hideChevron
                        onPress={() => {
                            this.onPay()
                        }}
                    />


                </List>


                <List>
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'chat', color: colors.secondary2}}
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

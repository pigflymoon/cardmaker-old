import React, {Component} from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Linking,
    AppState,
    Picker,
    Platform,
    AsyncStorage,
    Item,
    TouchableOpacity,
    Alert,
    TouchableHighlight,
    Image,
} from 'react-native';
import {List, ListItem, Card, Tile, Icon, Button} from 'react-native-elements';
import * as StoreReview from 'react-native-store-review';
import {NativeModules} from 'react-native';
const {InAppUtils}  = NativeModules;
import axios from 'axios';
import {fetchAllAsyncImages} from '../utils/FetchImagesByApi';
import {auth, db} from '../config/FirebaseConfig';

var verifysandboxHost = Config.receiptVerify.Host.sandboxHost;
// var verifyproductionHost = Config.receiptVerify.Host.productionHost;
var verifyHost = verifysandboxHost;
import firebaseReceriptApp from '../config/FirebaseReceiptsconfig';

import Config from '../config/ApiConfig';
import Utils from '../utils/utils';

import colors from '../styles/colors';
import listStyle from '../styles/list';
import SettingStyle from '../styles/setting';
var cardsSource = [];
export default class Settings extends Component {

    constructor(props, context) {
        super(props, context);
        this.state = {
            version: '1.0.1',
            isPro: 'DISABLED',
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

    onRate() {
        let link = 'https://itunes.apple.com/nz/app/cardmaker-app/id1318023993';
        //
        if (Platform.OS === 'ios') {
            if (StoreReview.isAvailable) {
                return StoreReview.requestReview();
            }

        }

        return Utils.goToURL(link);
    }

    upDateRole = () => {
        //update db user
        var self = this;
        auth.onAuthStateChanged(function (authUser) {
            if (authUser) {
                var userId = auth.currentUser.uid;
                console.log('current userid,', userId);

                db.ref('/users/' + userId).update({
                    role: {
                        admin: false,
                        free_user: true,
                        paid_user: true,
                    }
                })

            } else {
                console.log('no user?')
                self.setState({signin: false, cardsData: []})
            }
        });
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
                                    console.log('receiptData ', receiptData)
                                    axios.post(verifyHost, {
                                        'receipt-data': receiptData,
                                    })
                                        .then(function (response) {
                                            if (response.data.receipt) {
                                                self.sendRecipt(response.data.receipt, receiptData);
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
                                            console.log('validate error', error);
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
    };

    sendRecipt = (receipt, receiptData) => {
        var self = this;
        this.receiptsRef = firebaseReceriptApp.database().ref('receipts');
        // var newPostRef = this.receiptsRef.push();
        var transactionKey = ( (receipt.in_app)[0].transaction_id) ? ( (receipt.in_app)[0].transaction_id).toString() : null;
        if (transactionKey) {
            this.receiptsRef.once('value', function (snapshot) {
                if (snapshot) {
                    if (snapshot.hasChild(transactionKey)) {
                        console.log('exists')
                    } else {
                        self.receiptsRef.child(transactionKey).set({
                            receiptData: receiptData,
                            transaction_id: (receipt.in_app)[0].transaction_id,
                            application_version: receipt.application_version,
                            bundle_id: receipt.bundle_id,
                            original_application_version: receipt.original_application_version,
                            original_purchase_date: receipt.original_purchase_date,
                            original_purchase_date_pst: receipt.original_purchase_date_pst,
                            receipt_creation_date: receipt.receipt_creation_date,
                            receipt_creation_date_pst: receipt.receipt_creation_date_pst,
                            receipt_type: receipt.receipt_type,
                        });
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

    render() {
        return (
            <ScrollView>
                <List>
                    <Card
                        containerStyle={{marginTop: 15, marginBottom: 15}}
                        title="Thank you for your support"
                        titleStyle={{color: colors.primary1}}
                    >
                        <View style={SettingStyle.proContainer}>
                            <TouchableOpacity activeOpacity={.5} onPress={this.onPay}>
                                <View style={SettingStyle.getAppContainer}>
                                    <Text style={{color: '#ffffff'}}>Get PRO Version</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.5} onPress={() => {
                                this.onRestore()
                            }}>
                                <View style={SettingStyle.getRestoreContainer}>
                                    <Text style={{color: '#ffffff'}}>Restore Purchases</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        <View style={SettingStyle.container}>
                            <TouchableOpacity activeOpacity={.5} onPress={() => this.onProversion()}
                                              style={SettingStyle.more}>
                                <View>
                                    <Text style={SettingStyle.link}>Find out more ></Text>
                                </View>
                            </TouchableOpacity></View>

                    </Card>


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
                        leftIcon={{name: 'chat', color: colors.grey2}}
                        title={`Tell a friend`}
                        onPress={() => this.onShare()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'favorite', color: colors.grey2}}
                        title={`Rate us`}
                        onPress={() => this.onRate()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'info', color: colors.grey2}}
                        title={`About`}
                        onPress={() => this.onAbout()}
                    />
                    <ListItem
                        containerStyle={listStyle.listItem}
                        leftIcon={{name: 'perm-device-information', color: colors.grey2}}
                        hideChevron
                        title={`Version`}
                        subtitle={this.state.version}
                    />
                </List>

            </ScrollView>
        )
    }

}

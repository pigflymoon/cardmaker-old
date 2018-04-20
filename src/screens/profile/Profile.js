import React, {Component} from 'react';
import {View, AsyncStorage} from "react-native";
import {Card, Button, Text,} from "react-native-elements";
import buttonStyle from '../../styles/button';
import bg1 from '../../assets/images/bg1.jpg';
import colors from '../../styles/colors';
import {onSignOut, USER_KEY} from "../../auth";

export default class Profile extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            welcomeCard: true,
        }
    }

    handleSignOut = () => {
        ///
        var self = this;

        onSignOut().then(() => {
            console.log('sign out return')
            self.props.navigation.navigate("Signin");
        });


    }
    onAuthUser = () => {
        var self = this;
        AsyncStorage.getItem(USER_KEY)
            .then(userDataJson => {
                if (userDataJson !== null) {
                    console.log('user is ', userDataJson)
                    let userData = JSON.parse(userDataJson);
                    let displayName = userData.displayName;
                    let title = `Hi ${displayName}, Welcome to cardmaker!`;
                    self.setState({
                        signin: true,
                        isPaidUser: userData.isPaidUser,
                        displayName: displayName,
                        title: title,
                    });

                    // self.props.navigation.navigate("SignedIn");
                } else {
                    console.log('not sign in')
                    self.props.navigation.navigate("Signin");
                    self.setState({signin: false});

                }
            })
            .catch(err => reject(err));
    }

    componentDidMount() {
        this.onAuthUser();
    }

    render() {
        return (
            <View style={{paddingVertical: 20}}>
                <Card title={this.state.title}
                      image={bg1}>>
                    <View
                        style={{
                            backgroundColor: "#bcbec1",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 80,
                            height: 80,
                            borderRadius: 40,
                            alignSelf: "center",
                            marginBottom: 20
                        }}
                    >
                        <Text style={{color: "white", fontSize: 28}}>{this.state.displayName}</Text>
                    </View>
                    <Button
                        icon={{name: 'perm-identity', color: colors.secondary2}}
                        color={colors.secondary2}
                        buttonStyle={buttonStyle.submitButton}
                        title='Sign out'
                        onPress={this.handleSignOut}
                        underlayColor={colors.grey6}
                    />
                </Card>
            </View>
        )
    }
}

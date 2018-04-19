import React, {Component} from 'react';
import {View} from "react-native";
import {Card, Button, Text} from "react-native-elements";
import buttonStyle from '../../styles/button';
import bg1 from '../../assets/images/bg1.jpg';
import colors from '../../styles/colors';
import {onSignOut} from "../../auth";
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

    render() {
        return (
            <View style={{paddingVertical: 20}}>
                <Card title="John Doe"
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
                        <Text style={{color: "white", fontSize: 28}}>JD</Text>
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

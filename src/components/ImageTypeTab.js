import React, {Component} from 'react';
import {
    Button,
} from 'react-native-elements';

import colors from '../styles/colors';

export default class ImageTypeTab extends Component {
    constructor() {
        super();

        this.state = {
            selected: false,
            selectedIndex: 0,
        };
    }

    updateChoice = (category, type) => {
        var self = this;

        let showCardsType = ["christmas", "newYear", "easter", "kids", "forHer", "forHim", "general", "birthday", "wedding"];
        let showInvitationsType = ["christmas", "newYear", "easter", "kids", "women", "men", "invitation", "saveTheDate", "rsvp"];
        let showTypes = (category == "cards") ? showCardsType : showInvitationsType;

        // let showPosition = ["christmas", "newYear", "easter", "kids", "women", "men", "invitation", "saveTheDate", "rsvp"];

        var selectedItem = showTypes.map(position => ({name: position, value: false}));
        var selectedIndex = 0;
        selectedItem.forEach(function (item, i) {
            if (item.name == type) {
                item.value = !item.value;
                selectedIndex = i;
                self.props.handleSelect(
                    item.name,
                    item.value,
                    item.name,
                    category
                )
            }
        })
    }

    render() {
        const {category, imageType, selectedName, selectedValue} = this.props;
        console.log('tab name is **********',imageType);
        return (
            <Button
                title={imageType}
                titleStyle={{color: colors.white,}}
                fontSize={14}
                buttonStyle={[{
                    borderRadius: 20,
                    marginBottom: 10,
                    paddingHorizontal:20,
                }, (selectedName == imageType) &&
                (selectedValue == true) ? {
                        backgroundColor: colors.secondary2,
                    } : {
                        backgroundColor: colors.grey4,
                    }]}
                onPress={() => {
                    this.updateChoice(category, imageType)
                }}/>
        );
    }
}
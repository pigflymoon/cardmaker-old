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

        let showCardsType = ["christmas", "newYear", "easter", "kids", "forHer", "forHim", "general", "birthday", "wedding", "anniversary", "goodLuck", "teacherAppreciation", "graduation", "newBaby", "exam", "cheerUp", "friendship", "getWell", "loveRomance"];
        let showInvitationsType = ["christmas", "newYear", "easter", "kids", "women", "men", "invitation", "saveTheDate", "rsvp", "anniversary", "graduationParty", "BBQParty", "birth", "graduation"];
        let showTypes = (category == "cards") ? showCardsType : showInvitationsType;


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
        var imagesType1 = imageType.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
        return (
            <Button
                title={imagesType1}
                textStyle={{color: colors.white,textTransform:'capitalize',}}
                fontSize={14}
                buttonStyle={[{
                    borderRadius: 20,
                    marginBottom: 10,
                    paddingHorizontal:12,
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
import React, {Component} from 'react';
import {
    Button,
} from 'react-native-elements';
import CategoryConfig from '../config/CategoryConfig';

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
        let showTypes = (category == "cards") ? CategoryConfig.showCardsType : CategoryConfig.showInvitationsType;

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
        const {category, imageType,imageTypeTitle, selectedName, selectedValue} = this.props;
        var imagesTypeName = imageTypeTitle.replace(/([a-z])([A-Z])/g, '$1 $2');
        return (
            <Button
                title={imagesTypeName}
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
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
            selectedItem: [{name: "christmas", value: false},
                {name: "newYear", value: false},
                {name: "easter", value: false},
                {name: "kids", value: false},
                {name: "forHer", value: false},
                {name: "forHim", value: false},
                {name: "general", value: false},
                {name: "birthday", value: false},
                {name: "wedding", value: false},
            ],
            selectedIndex: 0,
        };
    }

    updateChoice = (type) => {
        var self = this;
        let showPosition = ["christmas", "newYear", "easter","kids", "forHer", "forHim","general", "birthday", "wedding"];
        var selectedItem = showPosition.map(position => ({name: position, value: false}));
        var selectedIndex = 0;
        selectedItem.forEach(function (item, i) {
            if (item.name == type) {
                item.value = !item.value;
                selectedIndex = i;
                self.props.handleSelect(
                    item.name,
                    item.value,
                    item.name
                )
            }
        })
    }

    render() {
        const {imageType, selectedName, selectedValue} = this.props;
        return (
            <Button
                title={imageType}
                titleStyle={{color: colors.white,}}
                fontSize={14}
                buttonStyle={ (selectedName == imageType) &&
                (selectedValue == true) ? {
                        backgroundColor: colors.secondary2,
                        borderRadius: 30,
                        marginBottom: 10,
                        paddingHorizontal: 5,
                    } : {
                        borderRadius: 30,
                        paddingHorizontal: 5,
                        backgroundColor: colors.grey4,
                        marginBottom: 10,
                    }}
                onPress={() => {
                    this.updateChoice(imageType)
                }}/>
        );
    }
}
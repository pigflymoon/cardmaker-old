import React, {Component} from 'react';
import {
    Button,
} from 'react-native-elements';

import colors from '../styles/colors';

export default class ImagesTab extends Component {
    constructor() {
        super();

        this.state = {
            selected: false,
            selectedItem: [{name: "topLeft", value: false},
                {name: "topCenter", value: false},
                {name: "topRight", value: false},
                {name: "bottomLeft", value: false},
                {name: "bottomCenter", value: false},
                {name: "bottomRight", value: false},
                {name: "center", value: false}],
            selectedIndex: 0,
        };
    }

    updateChoice = (type) => {
        var self = this;
        let showPosition = ['topLeft', 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'center'];
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
        const {positionType, selectedName, selectedValue} = this.props;
        return (
            <Button
                title={positionType}
                titleStyle={{color: colors.white,}}
                fontSize={14}
                buttonStyle={ (selectedName == positionType) &&
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
                    this.updateChoice(positionType)
                }}/>
        );
    }
}
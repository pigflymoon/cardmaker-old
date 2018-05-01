import React, {Component} from 'react';
import {ScrollView, View, Text} from 'react-native';

import {Icon, Card, Button, CheckBox} from 'react-native-elements';

class CustomCheckbox extends Component {
    constructor() {
        super();

        this.state = {
            checked: false
        };
    }

    render() {
        const {tag, color, updateCount} = this.props;
        const {checked} = this.state;

        return (
            <CheckBox
                key={tag}
                center
                title={tag}
                iconRight
                iconType='material'
                checkedIcon='clear'
                uncheckedIcon='add'
                checkedColor='red'
                checked={checked}
                containerStyle={{width: 70, backgroundColor: color}}
                onPress={() => {
                    this.setState({
                        checked: !checked
                    });
                    updateCount(!this.state.checked);
                }}
            />
        );
    }
}

export default class CustomTagGroups extends Component {
    constructor() {
        super();

        this.state = {
            count: 0
        };
    }

    renderTags(tags, color) {
        return tags.map((tag, index) => {
            return (
                <View key={index} style={{flex: 1, flexDirection: 'column', width: 70}}>
                    <CustomCheckbox tag={tag} color={color} updateCount={this.updateCount.bind(this)}/>
                </View>
            );
        });
    }

    updateCount(increment) {
        const {count} = this.state;

        this.setState({
            count: increment ? count + 1 : count - 1
        });
    }

    render() {
        const {tags, color} = this.props;
        const {count} = this.state;

        return (
            <View style={{flex: 1}}>
                <Text style={{textAlign: 'center'}}>Group 1</Text>
                {this.renderTags(tags, color)}
                <Text style={{textAlign: 'center'}}>Count: {count}</Text>
            </View>
        );
    }
}

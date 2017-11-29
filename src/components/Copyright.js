import React, {Component} from 'react';
import {View, ScrollView} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import Label from './Label';
import Utils from '../utils/utils';

export default class Copyright extends Component {

    render() {
        const bsdProjects = [{
            name: 'React Native',
            link: 'https://github.com/facebook/react-native',
        }];

        const mitProjects = [
            {
                name: 'React Native Elements',
                link: 'https://github.com/react-native-training/react-native-elements',
            },
            {
                name: 'react-navigation',
                linke: 'https://github.com/react-community/react-navigation'
            },
            {
                name: 'axios',
                linke: 'https://github.com/mzabriskie/axios'
            },

            {
                name: 'React Native Share',
                link: 'https://github.com/EstebanFuentealba/react-native-share',
            },

            {
                name: 'React Native Vector Icons',
                link: 'https://github.com/oblador/react-native-vector-icons',
            },
            {
                name: 'react-native-background-timer',
                link: 'git@github.com:ocetnik/react-native-background-timer.git',
            },
            {
                name: 'react-native-super-grid',
                link: 'git@github.com:saleel/react-native-super-grid.git'
            },

        ];

        return (
            <View>
                <Label text="MIT"/>
                <List containerStyle={{borderTopWidth: 0}}>
                    {mitProjects.map((project, index) =>
                        <ListItem
                            rightIcon={{name: 'open-in-new'}}
                            key={`index-${project.name}`}
                            title={project.name}
                            onPress={() => {
                                Utils.goToURL(project.link);
                            }}
                        />,
                    )}
                </List>
                <Label text="BSD"/>
                <List containerStyle={{borderTopWidth: 0}}>
                    {bsdProjects.map(project =>
                        <ListItem
                            rightIcon={{name: 'open-in-new'}}
                            key={`index-${project.name}`}
                            title={project.name}
                            onPress={() => {
                                Utils.goToURL(project.link);
                            }}
                        />,
                    )}
                </List>
            </View>
        );
    }
}


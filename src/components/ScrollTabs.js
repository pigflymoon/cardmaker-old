import React, {Component} from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ImageTypeTab from '../components/ImageTypeTab';

import {I18n} from '../config/language/I18n';

import colors from '../styles/colors';
import sliderTabStyle from '../styles/slideTab';

export default class ScrollTab extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            signin: false,
            selectedIndex: 0,
            imageType: 'cards/christmas',
            category: 'cards',
            selectedName: 'christmas',//default
            selectedValue: true,
        }
    }

    onHandleSelect = (selectedName, selectedValue, type, category) => {
        var self = this;
        var imageType;
        if (category == 'cards') {
            if (type == 'cards') {
                imageType = 'updatedcards';
            } else {
                imageType = `cards/${type}`;
            }
        } else {
            if (type == 'invitations') {
                imageType = 'updatedinvitations';
            } else {
                imageType = `invitations/${type}`;
            }
        }
        this.setState((prevState) => {
            if (prevState.type != type) {
                self.props.selectedTab(selectedName, selectedValue, type, false, imageType);
                return {
                    selectedName: selectedName,
                    selectedValue: selectedValue,
                    type: type,
                    loading: false,
                    imageType: imageType
                }
            }
        })

    }

    renderTypeTabs = (category, imagesType) => {

        var imagesType = imagesType.types;
        return (
            imagesType.map((type, index) => {
                return (
                    <ImageTypeTab key={index}
                                  category={category}
                                  imageType={Object.keys(type)[0]}
                                  imageTypeTitle={type[Object.keys(type)[0]]}
                                  dataTypes
                                  selectedName={this.state.selectedName}
                                  selectedValue={this.state.selectedValue}
                                  handleSelect={this.onHandleSelect}/>
                )
            })
        )
    }

    render() {
        const {category} = this.props;
        {I18n.t('cards')}
        let imagesTypes = (category == 'cards') ? I18n.t('cards') : I18n.t('invitations');

        return (
            <ScrollableTabView
                initialPage={0}
                tabBarTextStyle={{textTransform:'capitalize'}}
                tabBarInactiveTextColor={colors.secondary2}
                tabBarActiveTextColor={colors.primary3}
                tabBarUnderlineStyle={{backgroundColor:colors.primary3}}
                renderTabBar={() => <ScrollableTabBar style={{height:35}} tabStyle={{height:34}} />}
            >
                {Object.keys(imagesTypes).map((key, index) => {
                    let item = imagesTypes[key];
                    let title = item.title;
                    return (
                        <ScrollView tabLabel={title} key={index} style={sliderTabStyle.tabView}>
                            <View style={{flex: 1, flexDirection: 'row', flexWrap:'wrap',justifyContent: 'flex-start'}}>
                                {this.renderTypeTabs(category, item)}
                            </View>
                        </ScrollView>
                    )
                })}
            </ScrollableTabView>
        )
    }
}
import React, {Component} from 'react';
import {
    View,
    ScrollView,
} from 'react-native';
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ImageTypeTab from '../components/ImageTypeTab';

import CategoryConfig from '../config/CategoryConfig';
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
            switch (type) {
                case 'cards':
                    imageType = 'updatedcards';
                    break;
                default:
                    imageType = `cards/${type}`;
                    break;

            }
        } else {//
            switch (type) {
                case 'invitations':
                    imageType = 'updatedinvitations';
                    break;
                default:
                    imageType = `invitations/${type}`;
                    break;
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

    renderTypeTabs = (category, imagesTypes, imagesType) => {
        console.log('type tabs is called', category, imagesTypes, imagesType);
        return (
            imagesTypes[imagesType].map((type, index) => {
                return (
                    <ImageTypeTab key={index}
                                  category={category}
                                  imageType={type}
                                  selectedName={this.state.selectedName}
                                  selectedValue={this.state.selectedValue}
                                  handleSelect={this.onHandleSelect}/>
                )
            })
        )
    }

    render() {
        const {category} = this.props;
        let imagesTypes = (category == 'cards') ? CategoryConfig.cards : CategoryConfig.invitations;
        return (
            <ScrollableTabView
                initialPage={0}
                tabBarTextStyle={{textTransform:'capitalize',}}
                tabBarInactiveTextColor={colors.secondary2}
                tabBarActiveTextColor={colors.primary3}
                tabBarUnderlineStyle={{backgroundColor:colors.primary3}}
                renderTabBar={() => <ScrollableTabBar />}
            >
                {Object.keys(imagesTypes).map((imagesType, key) => {
                    var imagesTypeLabel = imagesType.replace(/([a-z])([A-Z])/g, '$1 $2');
                    return (
                        <ScrollView tabLabel={imagesTypeLabel} key={key} style={sliderTabStyle.tabView}>
                            <View
                                style={{flex: 1, flexDirection: 'row', flexWrap:'wrap',justifyContent: 'flex-start',}}>
                                {this.renderTypeTabs(category, imagesTypes, imagesType)}
                            </View>
                        </ScrollView>
                    )

                })}
            </ScrollableTabView>

        )
    }
}
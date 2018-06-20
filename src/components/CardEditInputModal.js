import React, {Component} from 'react';
import {
    Text,
    View,
    Modal,
    TouchableOpacity,
} from 'react-native';
import {
    SlidersColorPicker,
} from 'react-native-color';
import {
    Slider,
    Button
} from 'react-native-elements';
import tinycolor from 'tinycolor2';
import {Dropdown} from 'react-native-material-dropdown';

import EditModalStyle from '../styles/EditModal';
import cardStyle from '../styles/card';
import colorPickerStyle from '../styles/colorPicker';
import colors from '../styles/colors';

import CardConfig from '../config/CardConfig';

export default class CardEditInputModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            color: tinycolor('#2988BC').toHsl(),
            recents: ['#2988BC', '#2F496E', '#ACBD78', '#ED8C72', '#211F30'],
            recentsFontFamily: ['Didot-Italic', 'Baskerville-Bold', 'Marker Felt'],
            textAligns: ['align-left', 'align-justify', 'align-right'],
            modalIndex: this.props.modalIndex,
            fontSize: 32,
            buttonActiveColor: colors.grey4,
            textAlign: 'align-justify'
        }
    }

    /**
     * Edit input style
     * @param size
     */
    onChangeFontSize = (size) => {
        console.log('state is :', this.state)
        var stateName = `input${this.state.modalIndex}FontSize`;
        console.log('stateName is', stateName)


        this.setState({
            [stateName]: size,
            fontSizeLabel: size,
        });
    }
    onChangeFontFamily = (font) => {
        var stateName = `input${this.state.modalIndex}FontFamily`;
        this.setState({
            [stateName]: font,
            fontFamilyLabel: font,
        });
        this.setState({
            recentsFontFamily: [
                font,
                ...this.state.recentsFontFamily.filter(c => c !== font).slice(0, 2)
            ]
        });
    }
    onChangeTextPosition = (position) => {
        var stateName = `input${this.state.modalIndex}Position`;

        this.setState({
            [stateName]: position,
            textPositionLabel: position,
        });
    }
    onChangeTextAlign = (direction, index) => {
        var stateName = `input${this.state.modalIndex}TextAlign`;
        console.log('stateName is', stateName)
        this.setState({
            [stateName]: direction,
            buttonActiveColor: colors.secondary2
        });
    }
    getItemColor = (item) => {
        console.log('item is ', item)
        var stateName = `input${this.state.modalIndex}TextAlign`;
        var textAligns = ['align-left', 'align-justify', 'align-right']
        var index = textAligns.indexOf((this.state)[stateName])
        if (index == item) {
            return colors.secondary2;
        } else {
            return 'transparent';
        }
    }


    componentWillReceiveProps(nextProps) {
        const {modalIndex} = nextProps;
        this.setState({modalIndex: modalIndex})
    }

    render() {
        const {
            visible,
            onOk,
            onCancel,
            okLabel,
            cancelLabel,
            modalIndex
        } = this.props;
        console.log('modalIndex is ', modalIndex)
        var fontSize = `input${modalIndex}FontSize`;
        var fontFamily = `input${modalIndex}FontFamily`;
        var textPosition = `input${modalIndex}Position`;
        var textAlign = `input${modalIndex}TextAlign`;

        var textColor = `input${modalIndex}Color`;
        let fontsFamily = CardConfig.allfontFamily;
        const overlayTextColor = tinycolor(this.state.color).isDark()
            ? '#FAFAFA'
            : '#222';
        return (
            <Modal
                animationType="slide"
                transparent={false}
                visible={visible}
                onRequestClose={onCancel}
            >
                <View style={EditModalStyle.container}>
                    <View style={EditModalStyle.header}>
                        <TouchableOpacity onPress={onCancel}>
                            <Text style={EditModalStyle.headerButton}>{cancelLabel}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                onOk((this.state)[textColor],
                                    (this.state)[fontSize],
                                    (this.state)[fontFamily],
                                    (this.state[textAlign]),
                                    {/*(this.state)[textPosition]*/}
                                )
                            }
                        >
                            <Text style={EditModalStyle.headerButton}>{okLabel}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={EditModalStyle.content}>

                        <View style={[cardStyle.container, cardStyle.wrapper]}>

                            <Text style={[colorPickerStyle.sectionText, {
                                color: (this.state)[textColor] || colors.primary1,
                                fontFamily: (this.state)[fontFamily]
                            }]}>Font Color</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({modalVisible: true})}
                                style={[
                                    colorPickerStyle.colorPreview,
                                    {backgroundColor: tinycolor((this.state)[textColor] || colors.primary1).toHslString()}
                                ]}
                            >
                                <Text style={[colorPickerStyle.colorString, {color: overlayTextColor}]}>
                                    {tinycolor((this.state)[textColor] || colors.primary1).toHexString()}
                                </Text>
                            </TouchableOpacity>


                            <SlidersColorPicker
                                visible={this.state.modalVisible}
                                color={this.state.color}
                                returnMode={'hex'}
                                onCancel={() => this.setState({modalVisible: false})}
                                onOk={colorHex => {
                                    var stateName = `input${modalIndex}Color`;

                                    this.setState({
                                        modalVisible: false,
                                        color: tinycolor(colorHex).toHsl(),
                                        [stateName]: colorHex,

                                    });
                                    this.setState({
                                        recents: [
                                            colorHex,
                                            ...this.state.recents.filter(c => c !== colorHex).slice(0, 4)
                                        ]
                                    });
                                }}
                                swatches={this.state.recents}
                                swatchesLabel="RECENTS"
                                okLabel="Done"
                                cancelLabel="Cancel"
                            />
                            <Slider
                                value={this.state.fontSize}
                                step={1}
                                animateTransitions
                                animationType="spring"
                                thumbTouchSize={{width: 48, height: 48}}
                                maximumValue={100}
                                onValueChange={this.onChangeFontSize}
                                thumbStyle={cardStyle.thumb}
                            />
                            <Text>Font Size: {(this.state)[fontSize] || this.state.fontSize}</Text>

                            <Dropdown
                                label={(this.state)[fontFamily] || 'Font Family'}
                                data={fontsFamily}
                                setFontFamily={true}
                                onChangeText={this.onChangeFontFamily}
                            />
                            <Text style={cardStyle.title}>RECENTS:</Text>

                            <View style={{
                                marginTop: 12,
                                marginBottom: 24,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                flexWrap: 'wrap',
                            }}>
                                {(this.state.recentsFontFamily).map((swatch, index) => (

                                    <TouchableOpacity
                                        key={swatch}
                                        style={[
                                            {
                                                flex: 1,
                                                aspectRatio: 1,
                                                maxHeight: 200,
                                                maxWidth: 100,
                                                padding: 5,
                                                borderRadius: 3,
                                                borderColor: colors.grey4,
                                                borderWidth: 1,
                                                marginRight: index < (this.state.recentsFontFamily).length - 1 ? 16 : 0
                                            }
                                        ]}
                                        onPress={() => {
                                            var stateName = `input${this.state.modalIndex}FontFamily`;
                                            console.log('stateName is', stateName, 'swatch is ', swatch)
                                            this.setState({
                                                [stateName]: swatch
                                            });
                                        }
                                        }
                                    ><Text style={{
                                        color: colors.secondary2,
                                        fontFamily: swatch
                                    }}>{swatch}</Text></TouchableOpacity>

                                ))}
                            </View>

                            <Text style={cardStyle.title}>Text Align</Text>

                            <View style={{
                                marginTop: 12,
                                marginBottom: 24,
                                flexDirection: 'row',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                flexWrap: 'nowrap',
                            }}>

                                {(this.state.textAligns).map((direction, index) => (
                                    <Button
                                        key={index}

                                        title=""
                                        icon={{
                                            name: direction,
                                            type: 'font-awesome',
                                            color: colors.secondary2,
                                            size: 24
                                        }}
                                        onPress={() => this.onChangeTextAlign(direction, index)}
                                        buttonStyle={{
                                            padding: 0,
                                            backgroundColor: 'transparent',
                                            borderColor: this.getItemColor(index),
                                            borderWidth: 1,
                                        }}
                                        containerViewStyle={{width: 60,}}
                                        textStyle={{fontWeight: '700', color: colors.secondary2}}
                                    />


                                ))}
                            </View>
                            {/*<Dropdown*/}
                            {/*label={(this.state)[textPosition] || 'Text Position'}*/}
                            {/*data={CardConfig.textPostion}*/}
                            {/*onChangeText={this.onChangeTextPosition}*/}
                            {/*/>*/}

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
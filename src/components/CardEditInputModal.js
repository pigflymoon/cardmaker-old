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
} from 'react-native-elements';
import tinycolor from 'tinycolor2';
import {Dropdown} from 'react-native-material-dropdown';

import EditModalStyle from '../styles/EditModal';
import cardStyle from '../styles/card';
import colorPickerStyle from '../styles/colorPicker';
import colors from '../styles/colors';

import CardConfig from '../config/CardConfig';

const modes = {
    hex: {
        getString: color => tinycolor(color).toHexString(),
        label: 'HEX'
    },
    hsl: {
        getString: color => tinycolor(color).toHslString(),
        label: 'HSL'
    },
    hsv: {
        getString: color => tinycolor(color).toHsvString(),
        label: 'HSV'
    },
    rgb: {
        getString: color => tinycolor(color).toRgbString(),
        label: 'RGB'
    }
};

export default class CardEditInputModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            color: tinycolor('#70c1b3').toHsl(),
            recents: ['#247ba0', '#70c1b3', '#b2dbbf', '#f3ffbd', '#ff1654'],
            recentsFontFamily: ['Didot-Italic', 'Baskerville-Bold', 'Marker Felt'],
            modalIndex: this.props.modalIndex,
            fontSize: 24,
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
                                onOk((this.state)[textColor], (this.state)[fontSize], (this.state)[fontFamily], (this.state)[textPosition])
                            }
                        >
                            <Text style={EditModalStyle.headerButton}>{okLabel}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={EditModalStyle.content}>

                        <View style={[cardStyle.container, cardStyle.wrapper]}>

                            <Text style={[colorPickerStyle.sectionText, {
                                color: (this.state)[textColor],
                                fontFamily: (this.state)[fontFamily]
                            }]}>Font Color</Text>
                            <TouchableOpacity
                                onPress={() => this.setState({modalVisible: true})}
                                style={[
                                    colorPickerStyle.colorPreview,
                                    {backgroundColor: tinycolor((this.state)[textColor]).toHslString()}
                                ]}
                            >
                                <Text style={[colorPickerStyle.colorString, {color: overlayTextColor}]}>
                                    {tinycolor((this.state)[textColor]).toHexString()}
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
                            <Text>Font Size: {(this.state)[fontSize]}</Text>

                            <Dropdown
                                label={(this.state)[fontFamily] || 'Font Family'}
                                data={fontsFamily}
                                setFontFamily={true}
                                onChangeText={this.onChangeFontFamily}
                            />
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
                                            console.log('stateName is', stateName)
                                            this.setState({
                                                [stateName]: swatch
                                            });
                                        }
                                        }
                                    ><Text style={{color: colors.secondary2}}>{swatch}</Text></TouchableOpacity>

                                ))}
                            </View>
                            <Dropdown
                                label={(this.state)[textPosition] || 'Text Position'}
                                data={CardConfig.textPostion}
                                onChangeText={this.onChangeTextPosition}
                            />

                        </View>
                    </View>
                </View>
            </Modal>
        )
    }
}
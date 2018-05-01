import React, {Component} from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Platform,
    Picker,
    Item,
    ScrollView,
    ImageBackground,
    KeyboardAvoidingView,
    AsyncStorage
} from 'react-native';
import {
    Icon,
    FormInput,
    FormLabel,
    FormValidationMessage,
    Card,
    CheckBox
} from 'react-native-elements';
import {ColorWheel} from 'react-native-color-wheel';
import {auth} from '../../config/FirebaseConfig';
import Marker from 'react-native-image-marker'
import TextPositionButton from '../../components/TextPositionButton';
// import CustomTagGroups from '../../components/CustomTagGroups';
import  Utils from '../../utils/utils';
import formStyle from '../../styles/form';
import cardStyle from '../../styles/card';
import colors from '../../styles/colors';
import layoutStyle from '../../styles/layout';

import {
    renderAuthBox,
} from '../../utils/authApi';


export default class PreviewCard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            makeCard: null,
            title: '',
            caption: '',
            checked: false,
            signin: false,
            position: 'bottomCenter',
            textColor: colors.primary1,
            check: [],
            font: 'SnellRoundhand-Bold',
            fontSize: 48,
        }
    }


    componentDidMount() {
        var self = this;
        auth.onAuthStateChanged(function (user) {
            if (user) {
                self.setState({signin: true})
            } else {
                self.setState({signin: false})
            }
        });
        const params = this.props.navigation.state.params || {};
        const {url, text, position, textColor, font, textSize} = params;

        this.imageMarker(url, text, position, textColor, font, textSize);
        ;
    }


    insertEnter = (str, n) => {
        var len = str.length;//获取字符的长度
        var strTemp = '';
        if (len > n) {//如果字符的长度大于指定的长度
            strTemp = str.substring(0, n);//那么截取指定长度的字符串
            str = str.substring(n, len);//截取剩余的字符串
            //在截取的指定长度的字符串添加\n 标签实现换行并返回
            return strTemp + '\n' + this.insertEnter(str, n);
        } else {
            return str;
        }
    }

    onShare = () => {
        Utils.shareImage(this.state.imageUrl, this.state.title, this.state.caption)
    }

    imageMarker = (url, text, position, textColor, font, textSize) => {
        Marker.addTextByPostion(url, text, position, textColor, font, textSize)
            .then((path) => {
                this.setState({
                    show: true,
                    imageUrl: Platform.OS === 'android' ? 'file://' + path : path
                })
            }).catch((err) => {
            console.log(err)
        })
    }


    renderEdit = () => {
        return (
            <View style={[layoutStyle.container,]}>

                <View style={cardStyle.previewImageContainer}>
                    {
                        <Image
                            source={{uri: this.state.imageUrl}}
                            style={cardStyle.previewImage}
                        />
                    }
                </View>
                <View style={cardStyle.shareRightIcon}>
                    <Icon name="share-alt" type="font-awesome" color={colors.secondary2} size={28}
                          onPress={this.onShare}
                    />
                </View>




            </View>
        )
    }

    render() {
        var navigation = this.props.navigation;

        if (this.state.signin) {
            return this.renderEdit();

        }
        else {
            {
                return renderAuthBox(this.state.isLoading, navigation)
            }

        }
    }
}

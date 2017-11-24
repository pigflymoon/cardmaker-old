import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions, Alert, Image, FlatList, ScrollView, ImageBackground} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import Canvas, {Image as CanvasImage, Path2D} from 'react-native-canvas';
import {Button, Card, Icon,} from 'react-native-elements';
import colors from '../styles/colors';
import GridView from 'react-native-super-grid';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const data = [
    {
        url: 'https://i.pinimg.com/236x/d8/3a/9b/d83a9b6faf2e58ff895342242bd62214.jpg',
        pixelHeight: 354,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/61/35/93/613593ea3d5537c7f85f7365f0d72f45.jpg',
        pixelHeight: 157,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/52/7c/66/527c66879c1bbbeaf53938e467ee8927.jpg',
        pixelHeight: 289,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/16/8e/1e/168e1e2ba9e74baf37e1c64df576b79c.jpg',
        pixelHeight: 326,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/22/0f/01/220f016c154044a51abca097f7ecc4ea.jpg',
        pixelHeight: 354,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/14/3a/8c/143a8c283ecaecbf90058ac0f914a1ed.jpg',
        pixelHeight: 176,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/3d/65/6f/3d656f63189290a84d906b92d0d1565d.jpg',
        pixelHeight: 571,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/7a/2c/f2/7a2cf28357e37a95dfac3d273ef9cb0a.jpg',
        pixelHeight: 265,
        pixelWidth: 190
    },
    {
        url: 'https://i.pinimg.com/236x/57/f2/c5/57f2c55991b7173ffa9056c413cae260.jpg',
        pixelHeight: 744,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/e0/d3/85/e0d385c22794dc2140639ffc73257047.jpg',
        pixelHeight: 354,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/b2/bf/d8/b2bfd8cb9ecb96982de45d96ef5f5801.jpg',
        pixelHeight: 249,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/c3/73/2a/c3732abb95e790432a0208097c4e662e.jpg',
        pixelHeight: 314,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/24/1b/5e/241b5eb929d7353e7a85c37cffad4027.jpg',
        pixelHeight: 188,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/8b/73/b9/8b73b932a9d73ae7e17f3ccc8fc4029c.jpg',
        pixelHeight: 156,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/88/a8/4d/88a84d09003aae699bde89d888428642.jpg',
        pixelHeight: 361,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/3c/ca/4f/3cca4f233f253b4ca72010f5200cb372.jpg',
        pixelHeight: 249,
        pixelWidth: 202
    },
    {
        url: 'https://i.pinimg.com/236x/35/50/b5/3550b5659e25022e8af69fb8f6417e13.jpg',
        pixelHeight: 1137,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/ba/2d/f9/ba2df9aa774329560f3ee48fc947a299.jpg',
        pixelHeight: 785,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/f0/45/4d/f0454d0a5047ba3c73a50cc8c9d80bba.jpg',
        pixelHeight: 353,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/d8/64/ca/d864cad4ec4d9cfb1a08202a887bb175.jpg',
        pixelHeight: 353,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/2d/f4/91/2df491590161974dc461767bd405de8e.jpg',
        pixelHeight: 405,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/c6/6d/02/c66d0236627dbb979f8b1c1b5cc3e8fb.jpg',
        pixelHeight: 354,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/bd/3c/35/bd3c35762f8174decf01096f980c10e0.jpg',
        pixelHeight: 236,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/90/0a/49/900a49c038c9759f79ddccbf6a82c499.jpg',
        pixelHeight: 480,
        pixelWidth: 230
    },
    {
        url: 'https://i.pinimg.com/236x/13/24/2f/13242f1e28dfe2e590859107d31758a1.jpg',
        pixelHeight: 300,
        pixelWidth: 225
    },
    {
        url: 'https://i.pinimg.com/236x/cc/da/2a/ccda2a351bb00a0267bb98e6bc8067eb.jpg',
        pixelHeight: 577,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/a7/1e/97/a71e9712083d908d31d55ada64598125.jpg',
        pixelHeight: 394,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/2d/cf/1e/2dcf1eca1f7329f45b4ecc572841b0f7.jpg',
        pixelHeight: 187,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/d5/32/b3/d532b398c2c824bace748d5c876e0d1f.jpg',
        pixelHeight: 975,
        pixelWidth: 236
    },
    {
        url: 'https://i.pinimg.com/236x/4f/a3/44/4fa3442fd9a7e2da25ddaddb968b6d0a.jpg',
        pixelHeight: 328,
        pixelWidth: 236
    }
]

export default class TestCards extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            data: data,
        }

    }


    componentDidMount() {
        //

    }





    renderHeader() {
        return (
            <View style={styles.header}>
                {this.state.showSignCard ?
                    <View style={styles.headerLeftIcon}>
                        <Icon name="user" type="font-awesome" color="#ccc" size={35}/>
                    </View> : null}
                <View style={styles.headerCenter}>
                    <Text>Test cards</Text>
                </View>

            </View>
        );
    }


    render() {
        const items = [
            { name: 'TURQUOISE', code: '#1abc9c' }, { name: 'EMERALD', code: '#2ecc71' },
            { name: 'PETER RIVER', code: '#3498db' }, { name: 'AMETHYST', code: '#9b59b6' },
            { name: 'WET ASPHALT', code: '#34495e' }, { name: 'GREEN SEA', code: '#16a085' },
            { name: 'NEPHRITIS', code: '#27ae60' }, { name: 'BELIZE HOLE', code: '#2980b9' },
            { name: 'WISTERIA', code: '#8e44ad' }, { name: 'MIDNIGHT BLUE', code: '#2c3e50' },
            { name: 'SUN FLOWER', code: '#f1c40f' }, { name: 'CARROT', code: '#e67e22' },
            { name: 'ALIZARIN', code: '#e74c3c' }, { name: 'CLOUDS', code: '#ecf0f1' },
            { name: 'CONCRETE', code: '#95a5a6' }, { name: 'ORANGE', code: '#f39c12' },
            { name: 'PUMPKIN', code: '#d35400' }, { name: 'POMEGRANATE', code: '#c0392b' },
            { name: 'SILVER', code: '#bdc3c7' }, { name: 'ASBESTOS', code: '#7f8c8d' },
        ];

        return (
            <View style={styles.container}>
                <GridView
                    itemWidth={130}
                    items={items}
                    style={styles.gridView}
                    renderItem={item => (
                        <View style={[styles.itemContainer, { backgroundColor: item.code }]}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemCode}>{item.code}</Text>
                        </View>
                    )}
                />
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    header: {
        height: 64,
        paddingTop: 35,
        flexDirection: 'row',
    },
    headerLeftIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginLeft: 15,
    },
    headerCenter: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
    },
    headerCenterToggleContainer: {
        flexDirection: 'row',
        width: 160,
        height: 45,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#ccc',
    },
    headerCenterToggleLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ff0000',
        borderRadius: 30,
    },
    headerCenterToggleRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
});



import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Alert,
    Image,
    FlatList,
    ScrollView,
    ImageBackground,
    TouchableHighlight
} from 'react-native';

import SuperGrid from 'react-native-super-grid';


const items = [
    {
        url: 'https://i.pinimg.com/236x/c3/73/2a/c3732abb95e790432a0208097c4e662e.jpg',
        name: 'TURQUOISE',
        code: '#1abc9c'
    }, {
        url: 'https://i.pinimg.com/236x/c3/73/2a/c3732abb95e790432a0208097c4e662e.jpg',
        name: 'EMERALD',
        code: '#2ecc71'
    },
    {
        url: 'https://i.pinimg.com/236x/3c/ca/4f/3cca4f233f253b4ca72010f5200cb372.jpg',
        name: 'PETER RIVER',
        code: '#3498db'
    }, {name: 'AMETHYST', code: '#9b59b6'},
    {
        url: 'https://i.pinimg.com/236x/4f/a3/44/4fa3442fd9a7e2da25ddaddb968b6d0a.jpg',
        name: 'WET ASPHALT', code: '#34495e'
    }, {name: 'GREEN SEA', code: '#16a085'},
    {
        url: 'https://i.pinimg.com/236x/4f/a3/44/4fa3442fd9a7e2da25ddaddb968b6d0a.jpg',
        name: 'NEPHRITIS', code: '#27ae60'
    }, {name: 'BELIZE HOLE', code: '#2980b9'},
    {
        url: 'https://i.pinimg.com/236x/90/0a/49/900a49c038c9759f79ddccbf6a82c499.jpg',
        name: 'WISTERIA', code: '#8e44ad'
    }, {name: 'MIDNIGHT BLUE', code: '#2c3e50'},
    {
        url: 'https://i.pinimg.com/236x/4f/a3/44/4fa3442fd9a7e2da25ddaddb968b6d0a.jpg',
        name: 'SUN FLOWER', code: '#f1c40f'
    }, {name: 'CARROT', code: '#e67e22'},
    {
        url: 'https://i.pinimg.com/236x/61/35/93/613593ea3d5537c7f85f7365f0d72f45.jpg',
        name: 'ALIZARIN', code: '#e74c3c'
    }, {name: 'CLOUDS', code: '#ecf0f1'},
    {
        url: 'https://i.pinimg.com/236x/cc/da/2a/ccda2a351bb00a0267bb98e6bc8067eb.jpg',
        name: 'CONCRETE', code: '#95a5a6'
    }, {name: 'ORANGE', code: '#f39c12'},
    {
        url: 'https://i.pinimg.com/236x/4f/a3/44/4fa3442fd9a7e2da25ddaddb968b6d0a.jpg',
        name: 'PUMPKIN', code: '#d35400'
    }, {name: 'POMEGRANATE', code: '#c0392b'},
    {
        url: 'https://i.pinimg.com/236x/90/0a/49/900a49c038c9759f79ddccbf6a82c499.jpg',
        name: 'SILVER', code: '#bdc3c7'
    }, {
        url: 'https://i.pinimg.com/236x/c3/73/2a/c3732abb95e790432a0208097c4e662e.jpg',
        name: 'ASBESTOS',
        code: '#7f8c8d'
    },
];
export default class TestCards extends Component {


    constructor(props, context) {
        super(props, context);


    }


    componentDidMount() {
        //

    }

    chooseCard = (item) => {
        console.log('choose the ', item)
    }



    render() {
        return (
            <View style={styles.container}>
                <SuperGrid
                    itemWidth={130}
                    items={items}
                    style={styles.gridView}
                    renderItem={item => (

                        <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
                            <TouchableHighlight onPress={() => this.chooseCard(item)}>
                                <ImageBackground source={{uri: item.url}} style={styles.imageContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemCode}>{item.code}</Text>
                                </ImageBackground>
                            </TouchableHighlight>
                        </View>


                    )}
                />
                <Text>
                    Test
                </Text>
                <SuperGrid
                    itemWidth={130}
                    items={items}
                    style={styles.gridView}
                    renderItem={item => (

                        <View style={[styles.itemContainer, {backgroundColor: item.code}]}>
                            <TouchableHighlight onPress={() => this.chooseCard(item)}>
                                <ImageBackground source={{uri: item.url}} style={styles.imageContainer}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <Text style={styles.itemCode}>{item.code}</Text>
                                </ImageBackground>
                            </TouchableHighlight>
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
    gridView: {
        paddingTop: 25,
        flex: 1,
    },
    imageContainer: {
        height: 130,
        // width: 150,
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



import {
    Dimensions,
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;


export default {
    cardContainer: {
        // borderRadius: 5,
        // width: IMAGE_SIZE,
        paddingTop: 20,
    },
    cardInnerwrapper: {
        // paddingTop: 2,
        // paddingBottom: 2,


    },
    cardImage: {
        flex: 1,
        alignSelf: 'center',
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,

    },
    imageWrapper:{
        borderRadius: 5,

    }
}
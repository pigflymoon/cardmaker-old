import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;

export const HEADER_MAX_HEIGHT = 200;
export const HEADER_MIN_HEIGHT = 60;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default {
    cardContainer: {
        // borderRadius: 5,
        // width: IMAGE_SIZE,
        paddingTop: 20,
    },
    cardImage: {
        flex: 1,
        alignSelf: 'center',
        height: IMAGE_SIZE,
        width: IMAGE_SIZE,

    },
    imageWrapper: {
        borderRadius: 5,

    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#03A9F4',
        overflow: 'hidden',
    },
    bar: {
        marginTop: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {

        backgroundColor: 'transparent',
        color: 'white',
    },
    newFeatures: {
        color: colors.secondary2,
    },
    scrollViewContent: {
        marginTop: HEADER_MAX_HEIGHT,
    },
}
import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;

export const HEADER_MAX_HEIGHT = 140;
export const HEADER_MIN_HEIGHT = 60;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default {
    cardContainer: {
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
        backgroundColor: colors.primary3,
        opacity: 0.9,
        overflow: 'hidden',
    },
    bar: {
        height: 60,
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
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: null,
        height: HEADER_MAX_HEIGHT,
        // resizeMode: 'cover',
    },
    showBanner: {
        flex: 1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',

    },
    imageList: {
        width: (SCREEN_WIDTH - 28) / 2,
        height: (SCREEN_WIDTH - 28) / 2 * 1.2,//parseInt(Math.random() * 20 + 12) * 10,
        backgroundColor: colors.secondary2,
        paddingTop: 20,
        borderRadius: 8,
    }
}
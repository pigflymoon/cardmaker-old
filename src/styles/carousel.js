import {StyleSheet} from 'react-native';
import colors from '../styles/colors';
//
// export const colors = {
//     black: '#1a1917',
//     gray: '#888888',
//     background1: '#B721FF',
//     background2: '#21D4FD'
// };

export default StyleSheet.create({


    carouselContainer: {
        paddingVertical: 10,

    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexDirection: 'row',
        paddingHorizontal: 8,
        paddingTop: 20,

        // alignSelf: 'center',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },

    title: {
        // paddingHorizontal: 10,
        backgroundColor: 'transparent',
        color: colors.grey1,
        fontSize: 20,
        fontWeight: 'bold',
        // width: '50%',
        // textAlign: 'left'
    },
    subtitle: {
        // paddingHorizontal: 0,
        backgroundColor: 'transparent',
        color: colors.primary1,
        fontSize: 16,
        // fontWeight: 'bold',
        // alignSelf: 'flex-end',
    },
    titleDark: {
        color: colors.grey1,
    },

    slider: {
        marginTop: 15,
        overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
        paddingVertical: 10 // for custom animation
    },
    paginationContainer: {
        paddingVertical: 8
    },
    paginationDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 8
    }
});

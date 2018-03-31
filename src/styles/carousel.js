import { StyleSheet } from 'react-native';
import colors from '../styles/colors';
//
// export const colors = {
//     black: '#1a1917',
//     gray: '#888888',
//     background1: '#B721FF',
//     background2: '#21D4FD'
// };

export default StyleSheet.create({
    container:{
        paddingVertical: 30

    },

    gradient: {
        ...StyleSheet.absoluteFillObject
    },
    scrollview: {
        flex: 1
    },

    title: {
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: colors.grey1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'left'
    },
    titleDark: {
        color: colors.grey1,
    },
    subtitle: {
        marginTop: 5,
        paddingHorizontal: 30,
        backgroundColor: 'transparent',
        color: colors.grey1,
        fontSize: 13,
        fontStyle: 'italic',
        textAlign: 'left'
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

import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';

export default{
    //cards
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    gridView: {
        paddingTop: 20,
        flex: 1,
    },
    boardsContainer: {
        flex: 1,
        flexDirection: 'row',
        // height: 240,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        padding: 10,
    },

    boardContainer: {
        height: 220,
    },
    leftImage: {
        height: 220,
        width: 220,
    },

    rightImage: {
        height: 105,
        width: 105,
    },

    boardContainerLeft: {
        // backgroundColor: '#f7941d',
        flex: 1,
        flexGrow: 2,
        marginRight: 10,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 0,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 0,
        overflow: 'hidden',

    },
    boardContainerRight: {
        flex: 1,
        flexGrow: 1,
        flexDirection: 'column',
    },
    boardRightTopContainer: {
        height: 105,
        width: 105,
        marginBottom: 10,
        borderTopRightRadius: 5,
        overflow: 'hidden',
    },
    boardRightBottomContainer: {
        height: 105,
        width: 105,
        borderBottomRightRadius: 5,
        overflow: 'hidden',
    },


    itemName: {
        fontSize: 18,
        color: colors.grey1,
        fontWeight: '600',
        paddingTop: 15,
    },

}
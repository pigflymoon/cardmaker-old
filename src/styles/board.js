import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';
const {width} = Dimensions.get('window');

const equalWidth = (width / 2 )
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
        flexDirection:'row',
        borderRadius: 10,
        borderWidth: 10,
        borderColor: colors.white,
        // padding: 10,
        height: 240,
        // backgroundColor: colors.primary1
    },
    itemContainer: {
        justifyContent: 'flex-end',
        padding: 10,
    },

    boardContainer: {
        height: 220,
    },
    boardContainerLeft: {
        backgroundColor: '#f7941d',
        flex: 1,
        flexGrow:2,
        borderRightWidth: 10,
        borderColor: colors.white,
    },
    boardContainerRight: {
        backgroundColor: '#8d5022',
        flex: 1,
        flexGrow:1,

    },

    itemName: {
        fontSize: 18,
        color: colors.grey1,
        fontWeight: '600',
        paddingTop: 15,
    },

}
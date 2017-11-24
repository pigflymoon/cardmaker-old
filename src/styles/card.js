import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';
const {width, height} = Dimensions.get('window');

const equalWidth = (width / 2 )
export default{
    //cards
    container: {
        flex: 1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    cardsContainer: {
        flex: 1,
        borderTopWidth: 5,
        borderTopColor: colors.primary1,
        backgroundColor: 'rgba(211, 211, 211, 0.4)',
    },
    header: {
        height: 50,
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
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',

    },
    title: {
        color: colors.primary1,
    },

    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    iconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginTop: 10,
    },
    shareRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        // alignItems: 'center',

    },
    deck: {
        flex: 1,
    },
    footer: {
        height: 64,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    footerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 10,
    },
    //
    imageListContainer: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        flexDirection: 'row',
    },
    imageContainer: {
        justifyContent: 'flex-start',
        paddingRight: 15,
        paddingTop: 15,

    },
    previewContainer: {
        flex: 1,
        flexDirection: 'row',
        flexGrow: 2,


    },
    inputStyle: {
        width: equalWidth - 20,
        fontSize: 12,

    },
    footer: {
        height: 64,
        flexDirection: 'row',
        paddingBottom: 10,
    },
    footerIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        margin: 10,
    },
    //my card grid cards
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
}
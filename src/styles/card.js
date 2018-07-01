import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;
const PRVIEW_IMAGE_SIZE = SCREEN_WIDTH - 20;

export default{
    //cards
    container: {
        flex: 1,
    },
    wrapper: {
        marginHorizontal: 40,
    },
    cardsContainer: {
        flex: 1,
    },
    editCardContainer: {
        width: SCREEN_WIDTH - 20,
        flex: 1,
        alignSelf: 'center',
        flexGrow: 8,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.secondary2,
        borderRadius: 25,
    },
    cardImage: {
        flex: 1,
        width: '100%',
        // width: SCREEN_WIDTH - 30,
        alignSelf: 'center',
        justifyContent: 'center',
    },

    labelStyle: {
        marginTop: 5,
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 24 / 2,
        shadowColor: 'black',
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 4,
        shadowOpacity: 0.1,
        backgroundColor: colors.secondary2,
    },
    header: {
        height: 50,
        flexDirection: 'row',
    },
    headerCenter: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'flex-start',
        alignSelf: 'center',
        marginLeft: 15,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        color: colors.secondary2,
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
    footerIconContainer: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    imageContainer: {
        height: 140,
        justifyContent: 'flex-start',
        paddingRight: 15,
    },
    //my card grid cards
    gridView: {
        paddingTop: 25,
        flex: 1,
    },

    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 5,
        height: 150,
    },
    itemName: {
        fontSize: 16,
        color: colors.primary1,
        fontWeight: '600',
    },

    inputStyle: {
        width: '100%',
        maxHeight: 60,
        fontSize: 12,
        paddingTop: 0,
        marginBottom: 2,
        color: colors.secondary2,

    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
//make card
    frontStyles: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    backStyles: {
        justifyContent: 'center',
        height: '100%',
        width: '100%',
    },
    iconsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexGrow: 1,
    },
    shareRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center',

    },
}
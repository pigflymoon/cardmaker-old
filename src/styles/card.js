import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';
const {width, height} = Dimensions.get('window');

const equalWidth = (width / 2 )
export default{
    //cards
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
    shareRightIcon: {
        flex: 1,
        justifyContent: 'flex-end',
        marginLeft: 80,
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

}
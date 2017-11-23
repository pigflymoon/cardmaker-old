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

    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
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
        flexGrow: 1.5,
        paddingBottom: 10,

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
import {
    Dimensions,
} from 'react-native';
import colors from '../styles/colors';
const SCREEN_WIDTH = Dimensions.get('window').width;
const IMAGE_SIZE = SCREEN_WIDTH - 80;
export default{
    //cards
    container: {
        flex: 1,
    },
    cardsContainer: {
        flex: 1,
    },
    imageSize: IMAGE_SIZE,
    labelStyle: {
        marginTop: 5,
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
        color: colors.primary1,
    },

    headerRightIcon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 20,
    },
    editContainer: {
        flex: 1,
        // height: 100,
        backgroundColor: colors.white,
        // marginTop: 10,
    },
    // iconContainer: {
    //     flex: 1,
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     marginTop: 10,
    //     // paddingVertical: 5,
    //     // flexWrap: 'wrap'
    // },
    shareRightIcon: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'flex-start',
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
        width: '100%',
        justifyContent: 'space-between',
        // flexGrow: 1.5,
        height: 300,

    },
    imageContainer: {
        justifyContent: 'flex-start',
        paddingRight: 15,
    },
    previewContainer: {
        flex: 1,
        // flexDirection: 'row',
        height: SCREEN_WIDTH,
        // flexGrow: 2,
        // width: width * 0.92,
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
    },
    thumbnail: {
        height: 220,
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 5,
        padding: 10,
        height: 150,
        backgroundColor: "#234234"
    },
    itemName: {
        fontSize: 16,
        color: colors.primary1,
        fontWeight: '600',
    },
    preview: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH,
        flex: 1
    },
    markerTextContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        // marginHorizontal: 2,
        flexWrap: 'wrap',
        marginTop: 5,

        // flexGrow: 2.5,
    },
    iconsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 100,

    },
    badgeBg: {
        backgroundColor: colors.secondary2,
        marginBottom: 5,
    },
    statusBar: {
        height: 10,
    },
    navBar: {
        height: 60,
        width: SCREEN_WIDTH,
        justifyContent: 'center',
        alignContent: 'center'
    },
    nameHeader: {
        color: 'white',
        fontSize: 22,
        textAlign: 'center'
    },
    infoTypeLabel: {
        fontSize: 15,
        textAlign: 'right',
        color: 'rgba(126,123,138,1)',
        // fontFamily: 'regular',
        paddingBottom: 10,
    },
    infoAnswerLabel: {
        fontSize: 15,
        color: 'white',
        // fontFamily: 'regular',
        paddingBottom: 10,
    },
    inputStyle: {
        width: '100%',
        fontSize: 12,
        paddingTop: 0,
        marginBottom: 2,
        color: colors.secondary2,

    },
    editImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        height: IMAGE_SIZE,
    },
    editImage: {
        flex: 1,
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 10,
    },
    editTextContainer: {
        flex: 1,
        marginTop: 10,
        width: SCREEN_WIDTH - 80,
        marginLeft: 40,
        marginBottom: 30,
    },
    editCardTip: {
        flex: 1,
        fontSize: 15,
        color: 'rgba(216, 121, 112, 1)',
        marginLeft: 40,
    },
    editCardPositionContainer: {
        flex: 1,
        width: SCREEN_WIDTH,
        marginTop: 20
    }

}
import {
    Dimensions,
} from 'react-native';
const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
import colors from '../styles/colors';
export default{
    container: {
        flex: 1,
    },
    rowSelector: {
        height: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectorContainer: {
        flex: 1,
        alignItems: 'center',

    },
    selected: {
        position: 'absolute',
        borderRadius: 50,
        height: 0,
        width: 0,
        top: -10,
        borderRightWidth: 70,
        borderBottomWidth: 70,
        borderColor: colors.white,
        backgroundColor: colors.white,
    },
    loginContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginTextButton: {
        fontSize: 14,
        color: colors.white,
        // fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: colors.secondary2,
        borderRadius: 5,
        height: 50,
        width: 200,
    },
    titleContainer: {
        height: 150,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: colors.white,
        width: SCREEN_WIDTH - 30,
        borderRadius: 10,
        paddingTop: 32,
        paddingBottom: 32,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },
    bgImage: {
        flex: 1,
        top: 0,
        left: 0,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        fontFamily: 'light',
        backgroundColor: 'transparent',
        opacity: 0.54,
    },
    selectedCategoryText: {
        opacity: 1,
        fontSize: 30,
    },
    titleText: {
        color: colors.white,
        fontSize: 30,
        // fontFamily: 'georgia',
    },
    helpContainer: {
        // height: 64,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabButton: {
        backgroundColor: 'transparent',
    },
    inputContainer: {
        width: SCREEN_WIDTH - 60,
        marginTop: 16,
        borderBottomColor: 'rgba(0, 0, 0, 0.38)',

    },
    validateContainer: {
        backgroundColor: colors.orange,
    },
    validateLabel: {
        color: colors.white,
    },
    authButtonContainer:{
        alignSelf: 'center',
    }
}
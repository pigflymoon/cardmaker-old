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
    tabButtonGroup: {
        flexDirection: 'row',
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
        fontSize: 16,
        color: colors.white,
        fontWeight: 'bold',
    },
    loginButton: {
        backgroundColor: colors.secondary2,
        borderRadius: 5,
        height: 50,
        width: 200,
    },
    titleContainer: {
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    resetPasswordTitleContainer: {
        marginVertical: 30,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    formContainer: {
        backgroundColor: colors.white,
        width: SCREEN_WIDTH - 30,
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    loginText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.white,
    },

    categoryText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 24,
        backgroundColor: 'transparent',
        opacity: 0.54,
    },
    selectedCategoryText: {
        opacity: 1,
        fontSize: 22,
    },
    titleText: {
        color: colors.white,
        fontSize: 24,
    },
    infoTitle:{
        color: colors.white,
        fontSize: 22,
        textAlign:'center',
    },
    subtitleText: {
        color: colors.white,
        fontSize: 18,
        textAlign:'center',
    },
    helpContainer: {
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
        marginTop: 10,
        borderBottomColor: 'rgba(0, 0, 0, 0.38)',

    },
    inputText: {
        marginLeft: 20,
        color: colors.grey1,
    },
    validateContainer: {
        marginTop: 5,
        // backgroundColor: colors.orange,
    },
    validateLabel: {
        color: colors.secondary2,
    },
    validateErrorLabel: {
        color: colors.orange,
    },
    authButtonContainer: {
        alignSelf: 'center',
    },
    noButtonContainer: {
        backgroundColor: 'transparent',
        marginBottom: 10,
    },
    noButtonText: {
        fontSize: 16,
    },
    infoText: {
        marginBottom: 10,
        color: colors.grey1,

    }
}
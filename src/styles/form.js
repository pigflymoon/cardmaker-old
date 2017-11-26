import colors from '../styles/colors';
export default{
    container: {
        flex: 1,
    },

    inputsContainer: {
        flex: 1,
    },
    footerContainer: {
        flex: 1,
    },
    largerFooterContainer: {
        flex: 1.5,
    },

    inputContainer: {
        height: 60,
    },
    textInfoContainer: {
        flexDirection: 'row',
        marginTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    textLink: {
        color: colors.primary1,
    },
    plainText: {
        color: colors.grey3,
    },
    validateContainer: {
        backgroundColor: colors.orange,
    },
    validateLabel: {
        color: colors.white,
    },
    checkboxContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
    }
}
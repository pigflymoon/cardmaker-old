import colors from './colors';

export default {
    submitButton: {
        // marginTop: 15,
        backgroundColor: 'transparent',

        // backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.secondary2,
    },
    iconStyle: {
        color: colors.secondary2,
    },
    closeButton: {
        backgroundColor: colors.error,
        width: 50,
        height: 25,
        borderRadius: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        color: 'white',
        // color: colors.secondary2,
    },
    button: {
        backgroundColor: 'tomato',
        width: 34,
        height: 34,
        borderRadius: 34 / 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    }
};



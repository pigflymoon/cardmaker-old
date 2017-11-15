import colors from '../styles/colors';

export default{
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        // flex: 0 1 100%;
        // <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]

    },
    lineContainer: {
        flexGrow: 0,
        flexShrink: 1,
        flexBasis: '100%',

    },
    labelContainerStyle: {
        marginTop: 8,
    },

    textContainer: {
        flex: 1,
        marginTop: 10,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        // alignItems: 'flex-start',

    },
    paragraphContainer: {
        // flex: 1,flex: 1 0 50%;        text-align: center;padding: 10px;
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '20%',
        // padding: 10,
        // justifyContent: 'center',
        // flexWrap: 'nowrap',


    },
    containerMarginHorizontal: {
        marginHorizontal: 20,
    },
    paddingHorizontal10: {
        paddingHorizontal: 10,
    },
    textLink: {
        color: colors.primary1,
    },
    plainText: {
        color: colors.grey3,
    },

}
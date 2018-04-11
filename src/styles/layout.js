import colors from '../styles/colors';

export default{
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    maskLoader: {
        flex: 1,
    },
    loadingBackgroundStyle: {
        backgroundColor: colors.secondary4,
    },
    cardContainer: {
        borderRadius: 5,
    },
    cardInnerwrapper: {
        paddingTop: 6,
        paddingBottom: 2,

    },
    cardImage: {
        flex: 1,
        // justifyContent: "center",
        alignSelf: 'center',
        height: 330,
        width: 330,

    },
    textWrapper: {
        paddingHorizontal: 10,
    },
    text: {
        paddingVertical: 5,
    },
    textTitle: {
        paddingVertical: 5,
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.secondary2,
    },


}
import colors from '../styles/colors';
export default{
    //for network
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 50,

    },
    text: {
        color: colors.red1,
        fontSize: 16,
    },
    //for chat
    infoWrapper: {
        flexDirection: "column",
        justifyContent: "flex-start",
        marginHorizontal: 10,

    },
    infoText: {
        color: colors.white,
    },
    greyText:{
        color:colors.grey2,

    }

}
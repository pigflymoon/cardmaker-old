import {
    Platform,
} from 'react-native';

export default {
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    header: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 64,
        marginHorizontal: 16
    },
    headerButton: {
        lineHeight: 22,
        fontSize: 17,
        ...Platform.select({
            android: {
                fontFamily: 'sans-serif-medium'
            },
            ios: {
                fontWeight: '600',
                letterSpacing: -0.41
            }
        })
    },
    content: {
        flex: 1,
        marginHorizontal: 16
    },
}
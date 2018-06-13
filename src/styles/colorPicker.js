import {
    Platform
} from 'react-native';

export default{
    sectionText: {
        marginTop: 32,
        color: '#222',
        fontSize: 22,
        lineHeight: 32,
        ...Platform.select({
            android: {
                fontFamily: 'sans-serif-medium'
            },
            ios: {
                fontWeight: '600',
                letterSpacing: 0.75
            }
        })
    },
    componentText: {
        marginTop: 16,
        color: '#222',
        fontSize: 16,
        lineHeight: 21,
        ...Platform.select({
            android: {
                fontFamily: 'sans-serif-medium'
            },
            ios: {
                fontWeight: '600',
                letterSpacing: -0.408
            }
        })
    },
    colorPreview: {
        marginLeft: 12,
        marginTop: 12,
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 3,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        shadowOpacity: 0.25
    },
    colorString: {
        fontSize: 34,
        lineHeight: 41,
        ...Platform.select({
            android: {
                fontFamily: 'monospace'
            },
            ios: {
                fontFamily: 'Courier New',
                fontWeight: '600',
                letterSpacing: 0.75
            }
        })
    }

}
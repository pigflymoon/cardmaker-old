import Marker from 'react-native-image-marker'

export function setMaker(url, text, position, textColor, font, textSize) {
    console.log('font is ', font)
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            Marker.addTextByPostion(url, text, position, textColor, font, textSize)
                .then((path) => {
                    resolve(path)
                });
        }, 1000);
    });
}

export function setTextMaker(textMarker) {
    console.log('textMarkder is ', textMarker)
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            Marker.markText(textMarker)
                .then((path) => {
                    resolve(path)
                });
        }, 1000);
    });
}

// export function setTextMakerByXY(textMarker) {
//     return new Promise(function (resolve, reject) {
//         setTimeout(() => {
//             Marker.addText(textMarker)
//                 .then((path) => {
//                     resolve(path)
//                 })
//
//         })
//     })
// }

export function makerTask(value, textInfo) {
    var textMarker = {
        src: value,
        text: textInfo.text,
        position: textInfo.position,
        color: textInfo.color,
        fontName: textInfo.fontName,
        fontSize: textInfo.fontSize,
        scale: 1,
        quality: 100,
    }
    var textMarkerXY = {
        src: value,
        text: textInfo.text,
        // text: 'Doctor and Mrs. Ronald Kaleya Mr. and Mrs. Barnett Rothenberg',//Doctor and Mrs. Ronald Kaleya Mr. and Mrs. Barnett Rothenberg
        //     text: `Doctor and Mrs. Ronald Kaleya \n
        //     Mr. and Mrs. Barnett Rothenberg\n
        // invite you to share in their joy\n
        // at the marriage of their children`,
        color: textInfo.color,
        fontName: textInfo.fontName,
        fontSize: textInfo.fontSize,
        scale: 1,
        quality: 100,
        X: textInfo.xPos,
        Y: textInfo.yPos,

    }
    return new Promise((resolve, reject) => {
        if (resolve) {
            var nextValue = setTextMaker(textMarkerXY)
            console.log('value3 is######## ', nextValue)
            resolve(nextValue)
        } else {
            throw new Error("throw Error @ task2");
        }
    });
}
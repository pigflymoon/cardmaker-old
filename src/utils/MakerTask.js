import Marker from 'react-native-image-marker';


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

export function setImageMaker(imageMarker) {
    console.log('imageMarker is ', imageMarker)
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            Marker.markImage(imageMarker)
                .then((path) => {
                    resolve(path)
                });
        }, 1000);
    });
}

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
    if (textInfo.text != '') {
        var textMarkerXY = {
            src: value,
            text: textInfo.text,
            color: textInfo.color,
            fontName: textInfo.fontName,
            fontSize: textInfo.fontSize,
            scale: 1,
            quality: 100,
            X: textInfo.xPos,
            Y: textInfo.yPos,
            alignment: textInfo.alignment,
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
    } else {
        return new Promise((resolve, reject) => {
            if (resolve) {
                resolve(value)
            } else {
                throw new Error("throw Error @ task2");
            }
        });
    }


}

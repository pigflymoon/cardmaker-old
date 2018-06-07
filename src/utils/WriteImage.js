import Marker from 'react-native-image-marker'
import colors from '../styles/colors';

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

export function task1(url, text, position, textColor, font, textSize) {

    return new Promise((resolve, reject) => {
        if (resolve) {
            var value2 = setMaker(url, text, position, textColor, font, textSize)
            console.log('value 2 ', value2)
            resolve(value2)
        } else {
            throw new Error("throw Error @ task1");
        }
    });
}

export function task2(value2) {
    console.log('value2###### ', value2)

    var text = "Hello duck";
    var position = 'topCenter';
    var textColor = colors.secondary2;
    var font = 'Didot-Italic';
    var textSize = 40;
    return new Promise((resolve, reject) => {
        if (resolve) {
            var value3 = setMaker(value2, text, position, textColor, font, textSize)
            console.log('value3 is######## ', value3)
            resolve(value3)
        } else {
            throw new Error("throw Error @ task1");
        }
    });
}


export function WriteImage(imageUrl, textInfo) {
    return new Promise((resolve, reject) => {
        var value = task1(imageUrl, textInfo.text, textInfo.position, textInfo.textColor, textInfo.font, textInfo.textSize).then(task2);
        resolve(value);
    })

}
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


export function makerTask(value,textInfo) {
    return new Promise((resolve, reject) => {
        if (resolve) {
            var nextValue = setMaker(value, textInfo.text, textInfo.position, textInfo.textColor, textInfo.font, textInfo.textSize)
            console.log('value3 is######## ', nextValue)
            resolve(nextValue)
        } else {
            throw new Error("throw Error @ task2");
        }
    });
}

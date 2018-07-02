import {
    Alert,
} from 'react-native';
import {db} from '../config/FirebaseConfig';
import Utils from './utils';

export function getUpdatedImages(category = 'cards', count = 9) {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref().child(`updated${category}`).limitToLast(count).once("value", function (snapshot) {
                var downloadImages = snapshot.val();

                downloadImages = Utils.reverseObject(downloadImages)
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                title: downloadImages[key].name,
                                illustration: downloadImages[key].downloadUrl,
                            }
                        )
                    )
                    resolve(images)
                }

            });


        }, 500);
    });
}
export function getAllImagesByImageType(imageType = 'cards/christmas') {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref().child(imageType).once("value", function (snapshot) {
                var downloadImages = snapshot.val();

                downloadImages = Utils.reverseObject(downloadImages)
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                title: downloadImages[key].name,
                                // subtitle: downloadImages[key].Name,
                                illustration: downloadImages[key].downloadUrl,

                            }
                        )
                    )
                    resolve(images)
                }

            });


        }, 500);
    });
}

export function getFreeImagesByImageType(imageType = 'cards/christmas', count = 3) {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref().child(imageType).limitToLast(count).once("value", function (snapshot) {
                var downloadImages = snapshot.val();

                downloadImages = Utils.reverseObject(downloadImages)
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                title: downloadImages[key].name,
                                // subtitle: downloadImages[key].Name,
                                illustration: downloadImages[key].downloadUrl,

                            }
                        )
                    )
                    resolve(images)
                }

            });


        }, 500);
    });
}
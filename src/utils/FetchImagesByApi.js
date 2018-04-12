import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {auth, db, storage} from '../config/FirebaseConfig';
import Utils from './utils';


export function getFreeImages(cardType = 'birthdayImages') {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref(cardType).limitToFirst(3).on("value", function (snapshot) {
                var downloadImages = snapshot.val();
                // downloadImages = downloadImages.reverse();
                downloadImages = Utils.reverseObject(downloadImages)
                console.log('downloadImages ', downloadImages);
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
export function getFreeBirthdayImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('birthdayImages').limitToFirst(3).on("value", function (snapshot) {

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
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

/**
 * get all birthday images
 * @returns {Promise}
 */
export function getAllImages(cardType = 'birthdayImages') {

    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value
            db.ref(cardType).once("value", function (snapshot) {//'birthdayImages'

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
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
export function getFreeHolidayImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('holidayImages').limitToFirst(8).on("value", function (snapshot) {

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
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

export function getFreeWeddingImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('weddingImages').limitToFirst(8).on("value", function (snapshot) {

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
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
export function getFreeOtherImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('otherImages').limitToFirst(8).on("value", function (snapshot) {

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
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


export function getAllUploadImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('uploadImages').limitToLast(8).on("value", function (snapshot) {
                console.log('snapshot ', snapshot);
                var downloadImages = snapshot.val();
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

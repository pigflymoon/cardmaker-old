import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {auth, db, storage} from '../config/FirebaseConfig';


export function getFreeBirthdayImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('birthdayImages').limitToFirst(8).on("value", function (snapshot) {

                var downloadImages = snapshot.val();
                console.log('downloadImages ', downloadImages);
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                title: downloadImages[key].Name,
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
                                title: downloadImages[key].Name,
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
                                title: downloadImages[key].Name,
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
                                title: downloadImages[key].Name,
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
                                title: downloadImages[key].Name,
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

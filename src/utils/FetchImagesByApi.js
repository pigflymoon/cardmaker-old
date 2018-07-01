import {
    Alert,
} from 'react-native';
import {auth, db, storage} from '../config/FirebaseConfig';
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
export function getAllImagesByImageType(imageType = 'cards/christmas', count = 9) {
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

export function getFreeImages(category = 'cards', cardType = 'christmas') {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref(cardType).limitToLast(3).once("value", function (snapshot) {
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
export function getFreeBirthdayImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('birthdayImages').limitToFirst(3).on("value", function (snapshot) {

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
export function getFreeHolidayImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('holidayImages').limitToFirst(8).on("value", function (snapshot) {

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

export function getFreeWeddingImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('weddingImages').limitToFirst(8).on("value", function (snapshot) {

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
export function getFreeOtherImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('otherImages').limitToFirst(8).on("value", function (snapshot) {

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


export function getAllUploadImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value
            db.ref('uploadImages').limitToLast(8).on("value", function (snapshot) {
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


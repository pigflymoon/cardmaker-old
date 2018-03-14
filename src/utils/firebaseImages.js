import {onceGetPaidImages, onceGetFreeImages} from '../config/db';
export function getFreeImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            onceGetFreeImages().then(snapshot => {
                var downloadImages = snapshot.val();
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                uri: downloadImages[key].downloadUrl,
                                name: downloadImages[key].Name,
                            }
                        )
                    )
                    resolve(images)
                }

            });


        }, 500);
    });
}

export function getPaidImages() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            onceGetPaidImages().then(snapshot => {
                var downloadImages = snapshot.val();
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                uri: downloadImages[key].downloadUrl,
                                name: downloadImages[key].Name,

                            }
                        )
                    );
                    resolve(images)

                }

            });
        }, 500)
    })
}
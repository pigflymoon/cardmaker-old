import {
    AsyncStorage,
    Alert,
} from 'react-native';
import {auth, db, storage} from '../config/FirebaseConfig';


export function getFreeUploadImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            db.ref('uploadImages').limitToFirst(8).on("value", function (snapshot) {
                console.log('snapshot ', snapshot);
                var downloadImages = snapshot.val();
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                title: downloadImages[key].Name,
                                subtitle: downloadImages[key].Name,
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


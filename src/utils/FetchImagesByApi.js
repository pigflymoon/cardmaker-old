import {
    AsyncStorage,
    Alert,
} from 'react-native';
import firebaseApp from '../config/FirebaseConfig';

var storageRef = firebaseApp.storage().ref('/images');

const firebaseAsyncImage = (data, resolve, reject) => {

    var cardsSource;
    setTimeout(function () {
        if (storageRef.child(data.imageName + '.jpg')) {
            var thisRef = storageRef.child(data.imageName + '.jpg');
            thisRef.getDownloadURL().then(function (url) {
                cardsSource = {
                    id: Date.now().toString(36),
                    uri: url,
                    name: Date.now().toString(36),
                    code: '#2980b9'
                }
                resolve(cardsSource);
            });
        }


        //
    }, 2000);
}
export const fetchAllAsyncImages = () => {

    // Create an array of promises
    var promises = [];
    var self = this;
    for (var i = 1; i < 5; i++) {
        // Fill the array with promises which initiate some async work
        promises.push(new Promise(function (resolve, reject) {
            firebaseAsyncImage({imageName: i}, resolve, reject);
        }));
    }

    // Return a Promise.all promise of the array
    return Promise.all(promises);
}

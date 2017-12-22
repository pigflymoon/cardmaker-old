import {
    AsyncStorage,
    Alert,
} from 'react-native';
import firebaseApp from '../config/FirebaseConfig';

var storageRef = firebaseApp.storage().ref('/images');

// var storage = firebase.storage();

// Create a storage reference from our storage service
//
const firebaseAsyncImage = (data, resolve, reject) => {

    var cardsSource;
    setTimeout(function () {
        console.log('download url??', storageRef.child(data.imageName + '.jpg'))
        /*
         if (storageRef.child(data.imageName + '.jpg')) {
         storageRef.child(data.imageName + '.jpg').getDownloadURL().then(function (value) {
         console.log('download url,', value)
         if (value) {
         cardsSource = {
         id: Date.now().toString(36),
         uri: value,
         name: Date.now().toString(36),
         code: '#2980b9'
         };
         console.log('cardsSource is ', cardsSource)

         resolve(cardsSource);
         } else {
         reject('Image is not existed')
         }

         }).catch(function (err) {
         console.log('err', err);
         });
         ;
         }
         */

        /*
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
         */


        //
    }, 2000);
}

const apiRequest = (data) => {
    return new Promise(function (resolve, reject) {
        var cardsSource;
        setTimeout(function () {
            storageRef.child(data.imageName + '.jpg').getDownloadURL().then(function (value) {
                console.log('download url,', value)
                if (value) {
                    cardsSource = {
                        id: Date.now().toString(36),
                        uri: value,
                        name: Date.now().toString(36),
                        code: '#2980b9'
                    };
                    console.log('cardsSource is ', cardsSource)

                    resolve(cardsSource);
                } else {
                    console.log('Image is not existed')
                    resolve('Image is not existed')
                }

            }).catch(function (err) {
                console.log('err', err);
            });


        }, 2000);


    })
        .catch(function (err) {
            //return error;
            return err;
        });
}
export const fetchAllAsyncImages = () => {

    // Create an array of promises
    var promises = [];
    var self = this;
    for (var i = 1; i < 7; i++) {
        // Fill the array with promises which initiate some async work
        promises.push(apiRequest({imageName: i}));
        // promises.push(new Promise(function (resolve, reject) {
        //     firebaseAsyncImage({imageName: i}, resolve, reject);
        // }));
    }
    Promise.all(promises).then(function (dataArr) {
        dataArr.forEach(function (data) {
            console.log('data is ',data)
        });
    }).catch(function (err) {
        console.log(err);
    });
    // Return a Promise.all promise of the array
    // return Promise.all(promises);

}

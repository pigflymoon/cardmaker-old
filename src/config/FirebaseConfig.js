import firebase from 'firebase';  // Initialize Firebase
var fireBaseconfig = {
    apiKey: "AIzaSyCWshjbWMf9dKwKWScyYePagnBLu-aD04I",
    authDomain: "cardmaker-31ae8.firebaseapp.com",
    databaseURL: "https://cardmaker-31ae8.firebaseio.com",
    projectId: "cardmaker-31ae8",
    storageBucket: "cardmaker-31ae8.appspot.com",
    messagingSenderId: "409995152460"
};
//dev
// var fireBaseconfig = {
//     apiKey: "AIzaSyBHdEif0MF0SHVW-IuuIq1NXdW2dKWc_1A",
//     authDomain: "cardmaker-bca47.firebaseapp.com",
//     databaseURL: "https://cardmaker-bca47.firebaseio.com",
//     projectId: "cardmaker-bca47",
//     storageBucket: "cardmaker-bca47.appspot.com",
//     messagingSenderId: "149962974009"
// };
var firebaseApp = firebase.initializeApp(fireBaseconfig);
const db = firebaseApp.database();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export {
    db,
    auth,
    storage,
}

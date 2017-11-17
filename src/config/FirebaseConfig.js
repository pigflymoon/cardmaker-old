import firebase from 'firebase';  // Initialize Firebase
var fireBaseconfig = {
    apiKey: "AIzaSyCWshjbWMf9dKwKWScyYePagnBLu-aD04I",
    authDomain: "cardmaker-31ae8.firebaseapp.com",
    databaseURL: "https://cardmaker-31ae8.firebaseio.com",
    projectId: "cardmaker-31ae8",
    storageBucket: "cardmaker-31ae8.appspot.com",
    messagingSenderId: "409995152460"
};
var firebaseApp = firebase.initializeApp(fireBaseconfig);

export default firebaseApp

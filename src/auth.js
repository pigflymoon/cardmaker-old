import {AsyncStorage} from "react-native";

export const USER_KEY = "auth-demo-key";
import {auth, db} from './config/FirebaseConfig';
export const onSignIn = (email, password) => {

    var self = this;
    return new Promise((resolve, reject) => {
        auth.signInWithEmailAndPassword(email, password)
            .then(function (signuser) {
                console.log('called********')
                auth.onAuthStateChanged(function (authUser) {
                    if (authUser) {
                        var userId = auth.currentUser.uid;
                        db.ref('/users/' + userId).once('value').then(function (snapshot) {
                            var userrole = (snapshot.val() && snapshot.val().role) || {
                                    free_user: true,
                                    paid_user: false
                                };
                            var isPaidUser = userrole.paid_user;
                            var displayName = authUser.displayName ? authUser.displayName : (authUser.email).split("@")[0];
                            var userData = {
                                signin: true,
                                role: userrole,
                                isPaidUser: isPaidUser,
                                displayName: displayName
                            }
                            AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
                            resolve(true);
                        });


                    } else {
                        resolve(false);
                    }
                })
            })
            .catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                switch (errorCode) {
                    case 'auth/invalid-email':
                    case 'auth/user-disabled':
                    case 'auth/operation-not-allowed':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        self.setState({
                            errorMessage: errorMessage
                        });
                        break;
                    default:
                        self.setState({
                            errorMessage: 'Error'
                        });
                }
                reject(errorMessage)
            });

    })


};

export const onSignOut = () => {

    var self = this;
    return new Promise((resolve, reject) => {
        auth.signOut().then(function () {
            // Sign-out successful.
            AsyncStorage.removeItem(USER_KEY);
            resolve(true);
            console.log('called sign out')
            // self.setState({showSignBox: true, welcomeCard: false,})
        }).catch(function (error) {
            // An error happened.
            console.log('error', error)
            reject(error)
        });
    })

}

export const isSignedIn = () => {
    return new Promise((resolve, reject) => {
        AsyncStorage.getItem(USER_KEY)
            .then(res => {
                if (res !== null) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            })
            .catch(err => reject(err));
    });
};


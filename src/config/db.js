import {db} from './FirebaseConfig';

//User API


export const onceGetPaidImages = () =>
    db.ref('paidUploadImages').once('value');

export const onceGetFreeImages = () =>
    db.ref('freeUploadImages').once('value');

export const doCreateUser = (id, username, email) =>
    db.ref(`users/${id}`).set({
        username,
        email,
        role: {free_user: true, paid_user: false, admin: false}
    });
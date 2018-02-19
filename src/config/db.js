import {db} from './FirebaseConfig';

//User API


export const onceGetPaidImages = () =>
    db.ref('paidUploadImages').once('value');

export const onceGetFreeImages = () =>
    db.ref('freeUploadImages').once('value');
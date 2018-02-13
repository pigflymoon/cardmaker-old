import {db} from './FirebaseConfig';

//User API


export const onceGetImages = () =>
    db.ref('uploadImages').once('value');

export const onceGetDefaultImages = () =>
    db.ref('defaultUploadImages').once('value');
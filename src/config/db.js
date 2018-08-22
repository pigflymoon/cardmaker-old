import {db} from './FirebaseConfig';
export const onceGetPaidImages = () =>
    db.ref('paidUploadImages').once('value');

export const onceGetFreeImages = () =>
    db.ref('freeUploadImages').once('value');

export const onceGetImages = () => {
    db.ref('upImages').limitToFirst(8).on("value", function (snapshot) {
        return snapshot;
    });
}

export const doCreateUser = (id, username, email) =>
    db.ref(`users/${id}`).set({
        username,
        email,
        role: {free_user: true, paid_user: false, admin: false}
    }, function (error) {
        if (error) {
            // The write failed...
            console.log('create user error')
        } else {
            console.log('create user successfully!!')
            updateUserCount();
        }
    });

export const updateUserCount = () => db.ref('/user-count').once('value').then(function (snapshot) {
    console.log("There are " + snapshot.numChildren() + " users");
    return snapshot.numChildren() + 1;

}).then(function (number) {
    db.ref('/user-count').set({number})
})

export const saveFavoriteCard = (userid, username, cardId, cardUrl, cardName) => {
    return new Promise(function (resolve, reject) {

        db.ref(`favorite/${userid}/${cardId}`).once("value", snapshot => {
            if (snapshot.exists()) {
                reject('Card already saved!')
            } else {
                resolve(db.ref(`favorite/${userid}`).child(cardId).set({
                        downloadUrl: cardUrl,
                        name: cardName,
                        cardId: cardId
                    })
                )
            }
        })
    })


}

export const onceGetReceipts = () =>
    db.ref('receipts').once('value');

export const doCreateReceipt = (id, receipt) =>
    db.ref(`receipts/${id}`).set({
        transaction_id: (receipt.in_app)[0].transaction_id,
        application_version: receipt.application_version,
        bundle_id: receipt.bundle_id,
        original_application_version: receipt.original_application_version,
        original_purchase_date: receipt.original_purchase_date,
        original_purchase_date_pst: receipt.original_purchase_date_pst,
        receipt_creation_date: receipt.receipt_creation_date,
        receipt_creation_date_pst: receipt.receipt_creation_date_pst,
        receipt_type: receipt.receipt_type,
    });

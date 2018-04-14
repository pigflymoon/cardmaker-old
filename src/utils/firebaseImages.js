import {onceGetPaidImages, onceGetFreeImages} from '../config/db';

export function getFreeImages() {
    var self = this;
    return new Promise(function (resolve, reject) {
        // some async operation here
        setTimeout(function () {
            // resolve the promise with some value

            onceGetFreeImages().then(snapshot => {
                var downloadImages = snapshot.val();
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                uri: downloadImages[key].downloadUrl,
                                name: downloadImages[key].name,
                            }
                        )
                    )
                    resolve(images)
                }

            });


        }, 500);
    });
}

export function getPaidImages() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            onceGetPaidImages().then(snapshot => {
                var downloadImages = snapshot.val();
                if (downloadImages) {
                    var images = Object.keys(downloadImages).map(key => (
                            {
                                id: key,
                                uri: downloadImages[key].downloadUrl,
                                name: downloadImages[key].name,

                            }
                        )
                    );
                    resolve(images)

                }

            });
        }, 500)
    })
}

export function getPages(peopleRef,accumulator, cursor) {
    var pages = accumulator || [];
    var query = peopleRef.orderByKey().limitToFirst(pageLength + 1); // limitToFirst starts from the top of the sorted list
    if (cursor) { // If no cursor, start at beginning of collection... otherwise, start at the cursor
        query = query.startAt(cursor);  // Don't forget to overwrite the query variable!
    }

    return query.once('value')
        .then(function (snaps) {
            var page = [];
            var extraRecord;
            snaps.forEach(function (childSnap) {
                page.push({
                    id: childSnap.getKey(),
                    name: childSnap.val().name
                });
            });

            if (page.length > pageLength) {
                extraRecord = page.pop();
                pages.push(page);
                return getPages(pages, extraRecord.id);
            } else {
                pages.push(page);
                return Promise.resolve(pages);
            }
        });
};

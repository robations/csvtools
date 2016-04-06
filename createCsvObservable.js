const rx = require("rx");
const csv = require("fast-csv");

module.exports = function (stream, options) {
    return rx.Observable.create((observer) => {
        var csvStream = csv(options)
            .on("data", (data) => {
                observer.onNext(data);
            })
            .on("error", (err) => {
                observer.onError(err);
            })
            .on("end", () => {
                observer.onCompleted();
            })
        ;
        stream.pipe(csvStream);
    });
};

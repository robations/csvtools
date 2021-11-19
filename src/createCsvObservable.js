const rx = require("rxjs");
const csv = require("@fast-csv/parse");

module.exports = function (stream, options) {
    return new rx.from(csv.parseStream(stream, options));
};

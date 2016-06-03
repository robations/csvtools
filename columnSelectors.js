const _ = require("lodash");

/**
 * 
 * @param cols {Array}
 * @returns {function()}
 */
exports.include = function (cols) {
    return (x) => {
        return cols.length === 0
            ? x
            : _.pick(x, cols)
        ;
    };
};

/**
 * 
 * @param excludes {Array}
 * @returns {function()}
 */
exports.exclude = function (excludes) {
    return (x) => {
        return excludes.length === 0
            ? x
            : _.omit(x, excludes)
        ;
    };
};

const {omit, pick} = require("lodash");

function pickCols (x, cols) {
    return cols.map((i) => x[i])
}

/**
 *
 * @param cols {Array}
 * @returns {function()}
 */
function include(cols) {
    return (x) => {
        return cols.length === 0
            ? x
            : (Array.isArray(x)
                ? pickCols(x, cols)
                : pick(x, cols)
            )
        ;
    };
}

/**
 *
 * @param excludes {Array}
 * @returns {function()}
 */
function exclude(excludes) {
    return (x) => {
        return excludes.length === 0
            ? x
            : omit(x, excludes)
        ;
    };
}

module.exports = {
    include,
    exclude,
    pickCols,
};

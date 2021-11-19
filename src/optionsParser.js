const dashdash = require("dashdash");
const fs = require("fs");

const opts = [
    {
        names: ["help"],
        type: "bool",
        help: "Print this help and exit",
        default: false
    },
    {
        names: ["version", "v"],
        type: "bool",
        help: "Print version number and exit",
        default: false
    },
    {
        names: ["no-headers", "n"],
        type: "bool",
        help: "First row of input is not a header row, columns must be indexed by number.",
        default: false
    },
    {
        names: ["headers-out", "h"],
        type: "bool",
        help: "Output a header row.",
        default: false
    },
    {
        names: ["col", "c"],
        type: "arrayOfString",
        help: "Select a column by name (if using a header row) or 0-indexed number. Cannot be used with --exclude.",
        default: []
    },
    {
        names: ["exclude", "e"],
        type: "arrayOfString",
        help: "Exclude a column by name (if using a header row) or 0-indexed number. Cannot be used with --col.",
        default: []
    },
    {
        names: ["delimiter", "d"],
        type: "string",
        help: "CSV delimiter [,]. Must be one character in length only.",
        default: ","
    },
    {
        names: ["tabdelim", "t"],
        type: "bool",
        help: "Override delimiter to use tabs (avoids negotiating CLI parsing).",
        default: false
    }
];

const parser = dashdash.createParser({options: opts});

/**
 *
 * @param argv {Array}
 * @returns {{inputFile: null, inputStream: (process.stdin|{}), cols: (*|Array), delimiter: (*|string), excludes: (*|Array), headersIn: boolean, headersOut: boolean}}
 */
module.exports = function parseOptions(argv) {
    const options = parser.parse(argv);

    if (options.col.length > 0 && options.exclude.length > 0) {
        throw new Error("Options --col and --exclude cannot be used together");
    }

    const headersIn = options.no_headers === false;
    const headersOut = options.headers_out === true;

    const inputFile = options._args.length > 0
        ? options._args[0]
        : null
    ;
    const inputStream = inputFile
        ? fs.createReadStream(inputFile)
        : process.stdin
    ;

    return {
        inputFile: inputFile,
        inputStream: inputStream,
        cols: options.col || [],
        excludes: options.exclude || [],
        headersIn: headersIn,
        headersOut: headersOut,
        delimiter: (
            options.tabdelim
                ? "\t"
                : options.delimiter || ","
        ),
        help: options.help,
        get  helpText() { return parser.help(); },
        version: options.version
    };
};

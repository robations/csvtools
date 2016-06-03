const fs = require("fs");

module.exports = function parseOptions(cli) {
    // always coerce into an array:
    const cols = typeof cli.flags.col === "undefined"
        ? []
        : (typeof cli.flags.col === "object" ? cli.flags.col : [cli.flags.col])
    ;
    const delimiter = typeof cli.flags.delimiter === "undefined"
        ? ","
        : cli.flags.delimiter
    ;
    const excludes = typeof cli.flags.exclude === "undefined"
        ? []
        : (typeof cli.flags.exclude === "object" ? cli.flags.exclude : [cli.flags.exclude])
    ;

    if (cols.length && excludes.length) {
        console.error("Options --col and --exclude cannot be used together");
        process.exit(1);
    }

    const headersIn = cli.flags.headers;
    const headersOut = cli.flags.headersOut === true;

    const inputFile = cli.input.length > 0
        ? cli.input[0]
        : null
    ;
    const inputStream = inputFile
        ? fs.createReadStream(inputFile)
        : process.stdin
    ;

    return {
        inputFile: inputFile,
        inputStream: inputStream,
        cols: cols,
        delimiter: delimiter,
        excludes: excludes,
        headersIn: headersIn,
        headersOut: headersOut
    };
};

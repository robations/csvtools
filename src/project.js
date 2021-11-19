#!/usr/bin/env node
"use strict";

const {format} = require("@fast-csv/format");

const createCsvObservable = require("./createCsvObservable");
const optionsParser = require("./optionsParser");
const columnSelectors = require("./columnSelectors");
const {map} = require("rxjs");

const options = optionsParser(process.argv);

if (options.version) {
    console.log(require("../package.json").version);
    process.exit(0);
}
if (options.help) {
    console.log(`Usage: $ csvproject [file.csv] --col "Column Name" --col "Another" --headers-out`);
    console.log(options.helpText);
    process.exit(0);
}


const columnSelector = options.cols.length > 0
    ? columnSelectors.include(options.cols)
    : columnSelectors.exclude(options.excludes)
;

const stream = options.inputStream;

const writeStream = format({headers: options.headersIn && options.headersOut});
writeStream.pipe(process.stdout);

const csv$ = createCsvObservable(stream, {headers: options.headersIn, delimiter: options.delimiter});
csv$.pipe(
    map(columnSelector),
)
    .subscribe({
        next: x => writeStream.write(x),
        error: null,
        complete: () => {
            writeStream.end();
            process.stdout.write("\n");
        },
    })
;

process.stdout.on("error", function (err) {
    if (err.code === "EPIPE") {
        process.exit(0);
    }
});

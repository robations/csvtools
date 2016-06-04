#!/usr/bin/env node
"use strict";

const csv = require("fast-csv");
const fs = require("fs");
const _ = require("lodash");
const rx = require("rx");

const createCsvObservable = require("./createCsvObservable");
const optionsParser = require("./optionsParser");
const columnSelectors = require("./columnSelectors");

const options = optionsParser(process.argv);

if (options.version) {
    console.log(require("./package.json").version);
    process.exit(0);
}
if (options.help) {
    console.log(`Usage: $ csvproject [file.csv] --cols "Column Name" --cols "Another" --headers-out`);
    console.log(options.helpText);
    process.exit(0);
}


const columnSelector = options.cols.length > 0
    ? columnSelectors.include(options.cols)
    : columnSelectors.exclude(options.excludes)
;

var stream = options.inputStream;

var writeStream = csv.createWriteStream({headers: options.headersIn && options.headersOut});
writeStream.pipe(process.stdout);

const csv$ = createCsvObservable(stream, {headers: options.headersIn, delimiter: options.delimiter});
csv$
    .map(columnSelector)
    .subscribe(
        x => writeStream.write(x),
        null,
        () => {
            writeStream.end();
            process.stdout.write("\n");
        }
    )
;

process.stdout.on("error", function(err) {
    if (err.code === "EPIPE") {
        process.exit(0);
    }
});

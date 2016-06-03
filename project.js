#!/usr/bin/env node
"use strict";

const meow = require("meow");
const csv = require("fast-csv");
const fs = require("fs");
const _ = require("lodash");
const rx = require("rx");

const createCsvObservable = require("./createCsvObservable");
const optionsParser = require("./options");
const columnSelectors = require("./columnSelectors");

const cli = meow(`
    USAGE
      $ csvproject [file.csv] --cols "Column Name" --cols "Another" --headers-out

    OPTIONS
      --col col, -c col
            Select a column by name (if using a header row) or number. Cannot be used with --exclude.

      --exclude col, -e col
            Exclude a column by name (if using a header row) or number. Cannot be used with --col.

      --headers-out, -h
            Output a header row.

      --no-headers, -n
            First row of input is not a header row, columns must be indexed by number.

      --delimiter x, -d x
            CSV delimiter. Default is ",". Must be one character in length only.
    `,
    {
        boolean: [
            "no-headers",
            "headers-out"
        ],
        alias: {
            c: "col",
            n: "no-headers",
            h: "headers-out",
            e: "exclude"
        }
    }
);


const options = optionsParser(cli);

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

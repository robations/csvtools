#!/usr/bin/env node
"use strict";

const meow = require("meow");
const csv = require("fast-csv");
const fs = require("fs");
const _ = require("lodash");
const rx = require("rx");

const createCsvObservable = require("./createCsvObservable");

const cli = meow(`
    USAGE
      $ csvproject [file.csv] --cols "Column Name" --cols "Another" --headers-out

    OPTIONS
      --cols col, -c col
            Select a column by name (if using a header row) or number.

      --headers-out, -h
            Output a header row.

      --no-headers, -n
            First row of input is not a header row, columns must be indexed by number.
    `,
    {
        boolean: [
            "no-headers",
            "headers-out"
        ],
        alias: {
            c: "cols",
            n: "no-headers",
            h: "headers-out"
        }
    }
);

// always coerce into an array:
const cols = typeof cli.flags.cols === "undefined"
    ? []
    : (typeof cli.flags.cols === "object" ? cli.flags.cols : [cli.flags.cols])
;

const headersIn = cli.flags.noHeaders === false;

var stream = cli.input.length > 0
    ? fs.createReadStream(cli.input[0])
    : process.stdin
;
var writeStream = csv.createWriteStream({headers: headersIn && cli.flags.headersOut});
writeStream.pipe(process.stdout);

const csv$ = createCsvObservable(stream, {headers: headersIn});
csv$
    .map((x) => {
        return cols.length === 0
            ? x
            : _.pick(x, cols)
        ;
    })
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

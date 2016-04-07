#!/usr/bin/env node
"use strict";

const meow = require("meow");
const csv = require("fast-csv");
const fs = require("fs");
const _ = require("lodash");
const rx = require("rx");

const createCsvObservable = require("./createCsvObservable");

const cli = meow(`
    Usage
      $ csvproject <file.csv> --cols "Column Name" --cols "Another" --headers-out
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

var stream = fs.createReadStream(cli.input[0]);
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
    if (err.code == "EPIPE") {
        process.exit(0);
    }
});

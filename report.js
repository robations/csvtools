#!/usr/bin/env node
"use strict";

const csv = require("fast-csv");
const fs = require("fs");
const _ = require("lodash");
const rx = require("rx");
const Table = require("cli-table2");
const colors = require("colors/safe");
const immutable = require("immutable");

const createCsvObservable = require("./createCsvObservable");
const optionsParser = require("./optionsParser");
const columnSelectors = require("./columnSelectors");

const options = optionsParser(process.argv);

if (options.version) {
    console.log(require("./package.json").version);
    process.exit(0);
}
if (options.help) {
    console.log(`Usage: $ csvreport [file.csv] --col "Column Name" --col "Another"`);
    console.log(options.helpText);
    process.exit(0);
}

const columnSelector = options.cols.length > 0
    ? columnSelectors.include(options.cols)
    : columnSelectors.exclude(options.excludes)
;

var stream = options.inputStream;

function stringColReport(agg, col) {
    if (agg === null) {
        agg = {
            max: null,
            min: null,
            maxLength: 0,
            minLength: Number.POSITIVE_INFINITY,
            count: 0,
            uniques: immutable.Set(),
            emptyCount: 0
        };
    }
    return {
        max: col > agg.max || agg.max === null ? col : agg.max,
        min: col < agg.min || agg.min === null ? col : agg.min,
        maxLength: Math.max(agg.maxLength, col.length),
        minLength: Math.min(agg.minLength, col.length),
        count: agg.count + 1,
        uniques: agg.uniques.add(col),
        emptyCount: agg.emptyCount + (_.trim(col) === "" ? 1 : 0)
    };
}
function numericColReport(agg, col) {
    if (agg === null) {
        agg = {
            max: Number.NEGATIVE_INFINITY,
            min: Number.POSITIVE_INFINITY,
            sum: 0,
            count: 0,
            mean: null,
            uniques: immutable.Set()
        };
    }
    const val = parseFloat(col);
    return {
        max: Math.max(agg.max, val),
        min: Math.min(agg.min, val),
        sum: agg.sum + val,
        count: agg.count + 1,
        mean: (agg.sum + val) / (agg.count + 1),
        uniques: agg.uniques.add(col)
    };
}

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function colReport(agg, col) {
    if (agg === void 0) {
        agg = {
            string: null,
            numeric: null
        }
    }
    return isNumeric(col)
        ? {
            numeric: numericColReport(agg.numeric, col),
            string: agg.string
        }
        : {
            numeric: agg.numeric,
            string: stringColReport(agg.string, col)
        }
    ;
}

function _if(expr, t, f) {
    return expr
        ? t
        : f
    ;
}

const csv$ = createCsvObservable(stream, {headers: options.headersIn, delimiter: options.delimiter});
csv$
    .map(columnSelector)
    .reduce(
        (agg, row) => {
            return _.mapValues(row, (v, k) => colReport(agg[k], row[k]));
        },
        {}
    )
    .map((x) => {
        return _.mapValues(x, v => {
            var table = new Table({
                colWidths: [null, 60],
                wordWrap: true
            });

            table.push([
                colors.green("Type"),
                _if(
                    v.string === null,
                    "Numeric",
                    _if(
                        v.numeric === null,
                        "String",
                        "Mixed"
                    )
                )
            ]);
            let count = (v.string === null ? 0 : v.string.count)
                + (v.numeric === null ? 0 : v.numeric.count)
            ;

            table.push([colors.green("count"), count]);
            if (v.string !== null) {
                let s = v.string;
                if (s.maxLength > 0) {
                    table.push([colors.green("min"), s.min]);
                    table.push([colors.green("max"), s.max]);
                    table.push([colors.green("minLength"), s.minLength]);
                    table.push([colors.green("maxLength"), s.maxLength]);
                    table.push([
                        colors.green("Unique strings") + ` (${s.uniques.size})`,
                        _.sampleSize(s.uniques.toArray(), 25).join(", ")
                    ]);
                }
                table.push([colors.green("emptyCount"), s.emptyCount]);
            }
            if (v.numeric !== null) {
                let t = v.numeric;
                table.push([colors.green("min"), t.min]);
                table.push([colors.green("max"), t.max]);
                table.push([colors.green("sum"), t.sum]);
                table.push([colors.green("mean"), t.mean]);
                table.push([
                    colors.green("Unique numbers") + ` (${t.uniques.size})`,
                    _.sampleSize(t.uniques.toArray(), 25).join(", ")
                ]);
            }

            return table;
        });
    })
    .forEach((tables) => {
        _.forEach(
            tables,
            (table, k) => {
                console.log("Column:", colors.white.bold(k));
                console.log(table.toString());
                console.log("");
            }
        );
    })
;

process.stdout.on("error", function(err) {
    if (err.code === "EPIPE") {
        process.exit(0);
    }
});

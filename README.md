CSV Tools
=========

Some tools for working with and analysing CSV files, including:

- `csvproject`: project columns from a CSV file
- `csvreport`: output a report for each column showing the type of data, number of empty values, and so on.

## Usage

Here’s an example input file:

```csv
# test.csv:
make,model,derivative
ford,capri,2.0L
ford,capri,3.0L
citroen,ds,2.3L
```

### `csvproject`

Project as in [projection](https://en.wikipedia.org/wiki/Projection_(relational_algebra)). Select and output columns
from the input file.

```ShellSession
$ csvproject test.csv -c make
ford
ford
citroen

$ csvproject test.csv -c make -c derivative
ford,2.0L
ford,3.0L
citroen,2.3L

$ # exclude columns instead of including:
$ csvproject test.csv -e model
ford,2.0L
ford,3.0L
citroen,2.3L

$ csvproject test.csv -c model --headers-out
model
capri
capri
ds

$ csvproject test.csv -c 1 --no-headers
model
capri
capri
ds

$ # here's an example using stdin:
$ csvproject -c make < test.csv
ford
ford
citroen

$ # use a tab delimiter:
$ csvproject -d$'\t' < test.tsv
ford,capri,2.0L
ford,capri,3.0L
citroen,ds,2.3L
```


### `csvreport`

Generate a report showing the range and type of values for each column selected

```ShellSession
$ csvreport test.csv -c make
Column: make
┌────────────────────┬────────────────────────────────────────────────────────────┐
│ Type               │ String                                                     │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ count              │ 3                                                          │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ min                │ citroen                                                    │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ max                │ ford                                                       │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ minLength          │ 4                                                          │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ maxLength          │ 7                                                          │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ Unique strings (2) │ ford, citroen                                              │
├────────────────────┼────────────────────────────────────────────────────────────┤
│ emptyCount         │ 0                                                          │
└────────────────────┴────────────────────────────────────────────────────────────┘
```


## TODO

- [x] Write usage docs.
- [x] Support files without a header row.
- [x] Support input from stdin.
- [x] Write some tests.
- [x] Add flag to exclude columns instead of including.
- [ ] Improve test coverage.
- [ ] Support passing options from a config file.

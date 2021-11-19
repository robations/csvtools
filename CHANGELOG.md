# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [0.2.0] (2021-11-19)
### Breaking change
- Upgrading to latest cli-table3 drops support for nodejs < 10

## [0.1.4] (2021-11-19)
### Fixed
- Out of date packages updated where possible
- Projecting columns by number doesn't respect ordering


## [0.1.3]
### Added
- `yarn.lock` file added

### Fixed
- `cli-table3` replaces `cli-table2` fixing security warning (thanks to [DanielRuf](https://github.com/DanielRuf) for PR)


## [0.1.2]
### Added
- `preversion` hook to check for 'Unreleased' in this changelog.
- Options `-t` and `--tabdelim` override `--delimiter` for using a tab delimiter.

### Fixed
- Empty lines no longer drop report information.


## [0.1.1]
### Added
- Options `-v` and `--version` display version number.

### Fixed
- Option parsing was broken. Switched to use [dashdash](https://github.com/trentm/node-dashdash) and added tests for
option parsing.


## [0.1.0]
### Added
- Added a changelog.
- New option `--exclude` or `-e` to exclude columns instead of including.

### Changed
- Option `-cols` changed to `-col`.

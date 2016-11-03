# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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


# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased][]

### Fixed

- [https://github.com/temando/remark-metadata/issues/1](#1) - Fix issue when disabling `git`.

## [0.2.0][] - 2017-11-28

### Changed

- `remark-metadata` now supports a plugin option, `git`. If set, this will determine the modification dates using git commits. Defaults to `true`.
- `lastModifiedDate` renamed to `lastModifiedAt`.

## [0.1.1][] - 2017-11-28

### Fixed

- Fix additional new line being added to Front Matter.

## [0.1.0][] - 2017-11-28

Initial release of `remark-metadata` plugin.

[Unreleased]: https://github.com/temando/remark-metadata/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/temando/remark-metadata/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/temando/remark-metadata/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/temando/remark-metadata/tree/v0.1.0

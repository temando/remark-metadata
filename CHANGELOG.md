# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased

### Fixed

- [https://github.com/temando/remark-metadata/issues/1](#1) - Fix issue when disabling `git`.

## [v0.2.0] - 2017-11-28

### Changed

- `remark-metadata` now supports a plugin option, `git`. If set, this will determine the modification dates using git commits. Defaults to `true`.
- `lastModifiedDate` renamed to `lastModifiedAt`.

## [v0.1.1] - 2017-11-28

### Fixed

- Fix additional new line being added to Front Matter.

## [v0.1.0] - 2017-11-28

Initial release of `remark-metadata` plugin.

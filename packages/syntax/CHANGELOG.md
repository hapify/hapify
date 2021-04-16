# Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# @hapify/syntax [1.1.0](https://github.com/hapify/hapify/compare/@hapify/syntax@1.0.0...@hapify/syntax@1.1.0) (2021-04-16)


### Features

* add generator package ([#17](https://github.com/hapify/hapify/issues/17)) ([5ac94ae](https://github.com/hapify/hapify/commit/5ac94ae190a21bf2b1c416d6f5e9641ac247794b))





### Dependencies

* **@hapify/vm:** upgraded to 1.2.0

# @hapify/syntax 1.0.0 (2021-04-15)


### Features

* import syntax module ([#13](https://github.com/hapify/hapify/issues/13)) ([ec40ec2](https://github.com/hapify/hapify/commit/ec40ec22fc8171512c1e7c8fd7e3f159a6097098))





### Dependencies

* **@hapify/vm:** upgraded to 1.1.0

# Changelog

## [unreleased]

### Added

### Changed

### Removed

## [0.8.0] - 2020-11-19

### Added

- Handle enum fields

## [0.7.0] - 2020-11-13

### Added

- Added short to long syntax conversion tool
- Add remove indent pattern
- Clear double lines after generation

## [0.6.0] - 2020-11-10

### Added
- Handle single back-slash char in templates
- Handle long syntax

## [0.4.3] - 2019-11-14

### Changed
- Use `Hapify-VM` to run code safely

## [0.4.2] - 2019-10-23

### Added
- Add tests to check globals and import functions
- Remove `console` from context

### Changed
- Ran `npm audit fix` and update packages
- Ran `npm upgrade` and upgrade packages

## [0.4.1] - 2019-05-03

### Changed
- Renamed string variants
- Add type `string:url`
- Add type `object`
- Add type `file` with sub-types `image`, `video`, `audio` and `document`
- Map `A-A` to header case rather than big case
- Fix conditional pattern with more than 9

## [0.3.0] - 2018-11-15

### Added
- Handle `important`, `restricted` and `ownership` field property.
- Handle `underscoreUpper` for names (Example: FIRST_NAME).
- Handle `hyphenUpper` for names (Example: FIRST-NAME).
- Handle subtype `rich` of type `string`.
- Handle `isGeoSearchable` property.
- Handle action's accesses.

### Changed
- Use of `safer-eval` for evaluation
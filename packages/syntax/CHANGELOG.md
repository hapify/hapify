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

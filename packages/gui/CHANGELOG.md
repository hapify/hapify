# Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# @hapify/gui 1.0.0 (2021-04-21)


### Features

* add gui package ([#20](https://github.com/hapify/hapify/issues/20)) ([443c758](https://github.com/hapify/hapify/commit/443c758804b0477005fe2ef15fc0c8f64794115d))

# Changelog

## [Unreleased]

### Added

-   Handle HPF long syntax

### Changed

-   Improve syntax highlighting

### Removed

## [0.5.0] - 2020-08-05

### Changed

-   Upgrade to Angular 10

## [0.4.1] - 2019-10-24

### Added

-   Handle scenarios.
-   Add copy/paste feature
-   Add notes for model and fields
-   Confirm exit editor with unsaved changes
-   Add filters on model view

### Changed

-   New skin.
-   Change case naming
-   Renamed string variants
-   Add type `string:url`
-   Add type `object`
-   Add type `file` with sub-types `image`, `video`, `audio` and `document`
-   Handle self references while duplicating model
-   Prefix name while duplicating model

### Removed

-   Remove model copy keyboard shortcut

## [0.3.0] - 2018-11-15

### Added

-   Add script to detect fields properties combinations not supported by a channel.
-   Add `important` field property to load linked entity in listings.
-   Add `underscoreUpper` to properties names (Example: FIRST_NAME).
-   Add `hyphenUpper` to properties names (Example: FIRST-NAME).
-   Add subtype `rich` to type `string` for rich text editors.
-   Implement Hapify Syntax.
-   Add ability to clone models.
-   Add unsaved states indicator in models.
-   Add `Ctrl+S` shortcut to save a model.

### Changed

-   Moved documentation to `hapify-cli` repository.
-   Use `hapify-cli` as backend rather than Bitbucket.
-   Use `hapify-cli` for sync process.

### Removed

-   Removed all Bitbucket interfaces.
-   Removed deployment interface.
-   Removed generator interface.

## [0.2.0] - 2018-05-09

### Added

-   Link app to Bitbucket account (Loader module).
-   Load masks from Bitbucket (Loader module).
-   Load models from Bitbucket (Loader module).
-   Download bootstraps directly from Bitbucket (Loader module).
-   Import models from a JSON file (Loader module).
-   Export and download all models in a JSON file.
-   Export and download all masks from a channel in a JSON file.
-   Create a caching system for models to improve code generation (not merged yet. To be tested).
-   Add `multiple` field property.
-   Add `subtypes` for fields. See file `src/app/model/classes/field-subtype.ts` for available sub-types.
-   Prevent page closing/reloading when the editor is opened and unsaved.
-   "Save" button within the editor is highlighted on unsaved changes.
-   "Ctrl+S"/"Cmd+S" saves the content when editor is opened (Unless the right editor is focused. To be fixed).
-   Develop deployment interface.
-   Added sync server and auto-sync functionality.
-   Added computed "Searchable label" fields in model description.
-   Added pre-computed properties in model description.

### Changed

-   Enhance translation module initialization.
-   Change application name to Hapify.
-   New skin !! And add some help/intro texts.
-   Use `NgValue` rather than `value` in all selects.
-   Fix channels and models sorting issue.
-   "Save" button within the editor now save the content and keep the editor opened.
-   Use EventEmitter for button callback rather than Observable.

### Removed

-   Remove demo service and demo templates

## [0.1.0] - 2018-03-02

No changelog before `v0.1.0`.

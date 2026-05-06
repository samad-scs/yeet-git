# Changelog

All notable changes to this project will be documented in this file.

## [1.2.2] - 2026-05-06

# Changelog

## [1.2.2] - 2026-05-06

### Improvements
* **Model Upgrade**: Updated the core system to support the Gemini 3 Flash model for enhanced performance.

### Documentation
* **Updated References**: Refreshed all documentation and technical references to reflect the transition to Gemini 3 Flash.
* **History Sync**: Updated the changelog to include details from previous releases.

### Maintenance
* **Release v1.2.2**: Official version bump and release preparation.
* **Project Setup**: Completed initial project initialization and repository configuration.

## [1.2.2] - 2026-05-06

# Changelog

## Improvements
- **Data Model:** Updated the core model to improve performance and data integrity.

## Project Setup
- **Initialization:** Established the initial project structure and baseline configuration.
- **Documentation:** Populated the changelog with historical release data to maintain comprehensive project tracking.

## [1.2.1] - 2026-02-24

*   **Features**
    *   Updated Changelog with previous releases.

## [1.2.1] - 2026-02-24

### Features

- **Global Config Store**: Migrated configuration (API keys, settings) from local `.env` files to a centralized global storage at `~/.yeet/config.json`. This ensures settings are shared across all repositories and keeps project directories clean.

### Improvements

- **Centralized Storage**: Standardized all persistent data storage in the `~/.yeet` directory.
- **Initialization**: Updated `yeet init` to save keys globally.

## [1.2.0] - 2026-02-08

## Changelog

### Features

- **New Confirmation Configuration:** Added a new configuration option that requires confirmation before performing potentially destructive operations.
- **Publishing Skill:** Implemented a new skill for easily publishing the package.
- **Parser Pipeline Reset:** The parser pipeline now resets on each `parse` call, ensuring consistent behavior across multiple parsing operations.

### Improvements

- **Project Renaming:** Renamed the project to `yeet-git` for better branding and clarity.
- **Skill Updates:** Updated the available skills to reflect the latest features and functionalities.

## [1.1.0] - 2026-01-30

### Added

- **Short Flags**: Added `yeet -cp` shorthand for Commit & Push workflow.
- **Update Checker**: Automatically checks for updates on startup and notifies if a new version is available.
- **PR Configuration**: Added `PR_LABELS_ENABLED` setting to toggle PR label prompts.
- **Skills**: Added `maintaining-changelog` skill to automate changelog generation.
- **Utilities**: Added "Toggle PR Labels" option in the interactive Utilities menu.

### Documentation

- Updated `README.md` with new commands.
- Updated `docs/setup.md` with new configuration options.
- Updated `docs/usage.md` with flag references.
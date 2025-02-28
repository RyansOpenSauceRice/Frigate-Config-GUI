# Release Checklist

This document outlines the steps required for releasing a new version of Frigate Config GUI.

## Pre-release Checklist

### Testing
- [ ] All tests pass
- [ ] End-to-end testing completed
- [ ] i18n strings verified
- [ ] All components render correctly
- [ ] Configuration validation works

### Documentation
- [ ] Documentation is up to date
- [ ] Release notes prepared
- [ ] Installation instructions verified
- [ ] Screenshots updated if UI changed
- [ ] Changelog updated

### Build
- [ ] Version numbers updated
- [ ] Dependencies updated
- [ ] Build completes successfully
- [ ] Flatpak package builds
- [ ] All artifacts properly signed

## Release Process

### 1. Version Update
- [ ] Update version in package.json
- [ ] Update version in flatpak manifest
- [ ] Update CHANGELOG.md
- [ ] Commit version changes

### 2. Build Verification
- [ ] Clean build environment
- [ ] Build all packages
- [ ] Test installation packages
- [ ] Verify auto-update mechanism

### 3. Flathub Release
- [ ] Submit to Flathub
- [ ] Update README badges:
  ```markdown
  [![Flatpak](https://img.shields.io/badge/Flatpak-available-green)](https://flathub.org)
  ```
- [ ] Test Flathub installation
- [ ] Verify update detection

### 4. Documentation Update
- [ ] Update installation instructions
- [ ] Update download links
- [ ] Update version numbers in docs
- [ ] Push documentation changes

### 5. Announcements
- [ ] Create GitHub release
- [ ] Update release notes
- [ ] Announce on relevant channels
- [ ] Update issue tracker

## Post-release Checklist

### Verification
- [ ] Installation works from Flathub
- [ ] Auto-update notification works
- [ ] Documentation links work
- [ ] Release notes accessible

### Cleanup
- [ ] Remove old release candidates
- [ ] Archive release artifacts
- [ ] Update roadmap
- [ ] Close related issues

## Notes

- Keep this checklist updated as release process evolves
- Document any issues encountered during release
- Update automation scripts as needed
- Test on all supported platforms
# Versioning

This project uses a date-based versioning scheme in the format `YYYY.MM.DD` based on Central Standard Time (CST). For example, a version released on March 8, 2024 (CST) would be `2024.03.08`.

## Automatic Version Updates

The version is automatically updated in both `package.json` and the Flatpak manifest using the `tools/update-version.js` script. This script:

1. Gets the current date in CST
2. Updates the version in `package.json`
3. Updates the version in `flatpak/com.frigateNVR.ConfigGUI.yml`

## Release Process

To create a new release:

1. Run the version update script:
   ```bash
   node tools/update-version.js
   ```

2. Commit the changes:
   ```bash
   git add package.json flatpak/com.frigateNVR.ConfigGUI.yml
   git commit -m "chore: Update version to YYYY.MM.DD"
   ```

3. Create and push a tag:
   ```bash
   git tag vYYYY.MM.DD
   git push origin vYYYY.MM.DD
   ```

This will trigger the release workflow which will:
- Build the Electron app for all platforms
- Build the Flatpak package
- Create a GitHub release with all artifacts
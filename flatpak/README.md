# Flatpak Packaging Guide

This directory contains the necessary files to build and distribute Frigate Config GUI as a Flatpak application.

## Prerequisites

1. Install Flatpak and development tools:
```bash
# Ubuntu/Debian
sudo apt install flatpak flatpak-builder

# Fedora
sudo dnf install flatpak flatpak-builder

# Arch Linux
sudo pacman -S flatpak flatpak-builder
```

2. Add Flathub repository:
```bash
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

3. Install KDE Platform runtime:
```bash
flatpak install flathub org.kde.Platform//6.5 org.kde.Sdk//6.5
```

## Building the Flatpak

1. Build the application:
```bash
flatpak-builder --force-clean build-dir com.frigateNVR.ConfigGUI.yml
```

2. Test the build:
```bash
flatpak-builder --run build-dir com.frigateNVR.ConfigGUI.yml frigate-config-gui
```

3. Create a repository and install locally:
```bash
flatpak-builder --repo=repo --force-clean build-dir com.frigateNVR.ConfigGUI.yml
flatpak --user remote-add --no-gpg-verify local-repo repo
flatpak --user install local-repo com.frigateNVR.ConfigGUI
```

## Distribution

### Create a Single-File Bundle
```bash
flatpak build-bundle repo frigate-config-gui.flatpak com.frigateNVR.ConfigGUI
```

### Publishing to Flathub
1. Fork the Flathub repository
2. Add your application manifest
3. Create a pull request

## File Structure
- `com.frigateNVR.ConfigGUI.yml`: Main Flatpak manifest
- `com.frigateNVR.ConfigGUI.desktop`: Desktop entry file
- `com.frigateNVR.ConfigGUI.appdata.xml`: AppStream metadata
- `icon.svg`: Application icon

## Permissions
The application requires the following permissions:
- X11/Wayland access for GUI
- Home directory access for config files
- Network access for OpenAI API (optional)

## Updating
To update the Flatpak package:
1. Update version numbers in manifest and appdata
2. Update dependencies and their SHA256 sums
3. Rebuild using the commands above

## Troubleshooting
- Check build logs in `build-dir/build.log`
- Verify dependencies in the manifest
- Test with `--verbose` flag for more information
- Use `flatpak run --devel` for development/debugging

## References
- [Flatpak Documentation](https://docs.flatpak.org)
- [Flathub Guidelines](https://github.com/flathub/flathub/wiki/App-Requirements)
- [Python Packaging Guide](https://docs.flatpak.org/en/latest/python.html)
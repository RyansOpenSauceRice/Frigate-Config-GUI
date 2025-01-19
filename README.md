# Frigate Config GUI

⚠️ **IMPORTANT: This project is in early development and NOT ready for production use** ⚠️

A desktop application for managing Frigate NVR configuration files through an intuitive graphical user interface. This project aims to be adopted by the Frigate NVR organization once it reaches maturity.

## Project Status

This project is currently in active development and is **NOT** ready for general use. Key points:

- ⏳ Early Development Stage
- 🚫 Not Production Ready
- 🔄 Rapidly Changing
- 📋 Core Features Under Development

## Overview

Frigate Config GUI is a desktop application designed to simplify the process of creating and managing configuration files for Frigate NVR systems. Instead of manually editing YAML files, users will be able to configure their Frigate setup through a user-friendly interface.

## Planned Features

- Create and edit Frigate configuration files
- GUI-based configuration management
- Real-time validation
- YAML file import/export
- Configuration backup and restore

## Project Goals

1. Create a user-friendly configuration interface for Frigate NVR
2. Simplify the process of setting up and managing Frigate configurations
3. Integrate with the main Frigate NVR project once mature
4. Provide a seamless experience for Frigate users of all technical levels

## Development

This project follows Test-Driven Development (TDD) practices. For detailed specifications and development guidelines, please refer to [SPECIFICATIONS.md](SPECIFICATIONS.md).

### Requirements

- Node.js (version 18 or higher)
- npm or yarn for package management

### Building from Source

The application is distributed as a Flatpak package. To build it:

1. Install build dependencies:
   ```bash
   # Ubuntu/Debian
   sudo apt install flatpak flatpak-builder curl

   # Fedora
   sudo dnf install flatpak flatpak-builder curl

   # Arch Linux
   sudo pacman -S flatpak flatpak-builder curl
   ```

2. Add Flathub repository:
   ```bash
   flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
   ```

3. Run the build script:
   ```bash
   chmod +x tools/build.sh
   ./tools/build.sh
   ```

The script will:
- Check for required dependencies
- Update Node.js SHA256 checksums automatically
- Build the Flatpak package
- Create a single-file bundle at `frigate-config-gui.flatpak`

### Installation

⚠️ Note: The application is still in early development and not ready for general use.

Once built, you can install the Flatpak bundle:
```bash
flatpak install frigate-config-gui.flatpak
```

## Contributing

Contributions are welcome! Please read our contributing guidelines (coming soon) before submitting pull requests.

## License

This project is licensed under the [MIT License](LICENSE)

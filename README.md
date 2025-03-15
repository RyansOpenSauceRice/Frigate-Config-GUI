# Frigate Config GUI

**DEVELOPMENT STATUS: ALPHA**

This project is in early alpha development and is currently:
- Under heavy development with frequent breaking changes
- Only available for Linux (Windows support planned)
- Not thoroughly tested in production environments
- Missing some planned features
- Subject to significant UI/UX changes

A professional desktop application for managing Frigate NVR configurations through an intuitive graphical interface. Built with modern web technologies and designed for reliability and ease of use.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/build.yml/badge.svg)](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/build.yml)
[![Flatpak Build](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/build-flatpak.yml/badge.svg)](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/build-flatpak.yml)
[![Release](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/release-build.yml/badge.svg)](https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions/workflows/release-build.yml)
[![Development Status](https://img.shields.io/badge/Status-Alpha-red)](https://github.com/your-org/frigate-config-gui)
[![Platform](https://img.shields.io/badge/Platform-Linux-green)](https://flathub.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)

<!-- 
Release checklist badge (add when available on Flathub):
[![Flatpak](https://img.shields.io/badge/Flatpak-available-green)](https://flathub.org)
-->

## Overview

Frigate Config GUI simplifies the configuration of Frigate NVR systems by providing a modern, intuitive interface for managing YAML configurations. Built with enterprise-grade technologies and designed for users of all technical levels.

### Planned Features

- **Visual Configuration**: Intuitive interface for all Frigate settings
- **Real-time Validation**: Immediate feedback on configuration changes
- **Multi-language Support**: Will support all UN official languages

Note: Many features are still under development. Please check the project status before using in any environment.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- For Linux: flatpak and flatpak-builder
- For Windows: WiX Toolset (for building MSI)

### Installation

⚠️ **Note: This application is in early alpha and not yet available on Flathub**

The application will be distributed through Flathub for Linux systems. For now, you must build from source:

1. Follow the [Building from Source](#building-from-source) instructions below
2. Use at your own risk - this is alpha software
3. Report issues on GitHub
4. Backup your Frigate configuration before using this tool

For detailed instructions, see our [Installation Guide](docs/user/installation.md).

### Building from Source

#### Quick Build (Recommended)

We provide a comprehensive build script that handles all prerequisites and builds both the app and Flatpak package:

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/frigate-config-gui.git
   cd frigate-config-gui
   ```

2. Run the build script:
   ```bash
   ./tools/build-all.sh
   ```

The script supports several options:
- `--app-only`: Build only the Electron app
- `--flatpak-only`: Build only the Flatpak package
- `--dev`: Start development environment

#### Manual Build

If you prefer to build manually:

1. Install dependencies:
   ```bash
   npm ci
   ```

2. Build the application:
   ```bash
   npm run build
   ```

3. For Flatpak, use the dedicated script:
   ```bash
   ./tools/build.sh
   ```

For detailed build instructions, see our [Build Guide](docs/dev/building.md).

## Documentation

All documentation is available in the [docs](docs/index.md) directory:

- [User Guide](docs/user/README.md)
- [Developer Documentation](docs/dev/README.md)
- [Contributing Guidelines](docs/contributing.md) (also available in [root directory](CONTRIBUTING.md))
- [Technical Specifications](docs/specifications.md) (also available in [root directory](SPECIFICATIONS.md))
- [Examples](docs/examples/README.md)

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting pull requests.

### Development Process

This project follows Test-Driven Development (TDD) practices and uses modern tooling:

- TypeScript for type safety
- React with Radix UI for components
- TailwindCSS for styling
- Vitest for testing
- Electron for cross-platform support

## Updates and Maintenance

- Updates are distributed through Flathub

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Frigate NVR](https://github.com/blakeblackshear/frigate) - The excellent NVR system this tool configures
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React](https://reactjs.org/) - UI framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component system

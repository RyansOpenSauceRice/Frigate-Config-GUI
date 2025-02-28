# Frigate Config GUI

A professional desktop application for managing Frigate NVR configurations through an intuitive graphical interface. Built with modern web technologies and designed for reliability and ease of use.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Flatpak](https://img.shields.io/badge/Flatpak-available-green)](https://flathub.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.0-blue)](https://reactjs.org/)

## Overview

Frigate Config GUI simplifies the configuration of Frigate NVR systems by providing a modern, intuitive interface for managing YAML configurations. Built with enterprise-grade technologies and designed for users of all technical levels.

### Key Features

- **Visual Configuration**: Intuitive interface for all Frigate settings
- **Real-time Validation**: Immediate feedback on configuration changes
- **Multi-language Support**: Available in all UN official languages
- **Enterprise Ready**: Supports automated deployment and silent installation
- **Cross-platform**: Available for Linux (Flatpak) and Windows (MSI)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- For Linux: flatpak and flatpak-builder
- For Windows: WiX Toolset (for building MSI)

### Installation

The application is distributed through Flathub for Linux systems:

```bash
flatpak install flathub dev.all-hands.frigate-config-gui
```

For other installation methods and detailed instructions, see our [Installation Guide](docs/user/installation.md).

### Building from Source

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/frigate-config-gui.git
   cd frigate-config-gui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the application:
   ```bash
   npm run build
   ```

For detailed build instructions, see our [Build Guide](docs/dev/building.md).

## Documentation

- [User Guide](docs/user/README.md)
- [Developer Documentation](docs/dev/README.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Technical Specifications](SPECIFICATIONS.md)

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
- Automatic update checks are built-in
- Security updates are prioritized
- LTS versions are supported for 24 months

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Frigate NVR](https://github.com/blakeblackshear/frigate) - The excellent NVR system this tool configures
- [Electron](https://www.electronjs.org/) - Cross-platform desktop framework
- [React](https://reactjs.org/) - UI framework
- [Radix UI](https://www.radix-ui.com/) - Accessible component system
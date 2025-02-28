# Frigate Config GUI Documentation

Welcome to the Frigate Config GUI documentation. This directory contains both user and developer documentation.

## Directory Structure

```
docs/
├── dev/              # Developer documentation
│   ├── architecture.md
│   ├── building.md
│   ├── components.md
│   ├── i18n.md
│   └── testing.md
├── user/             # User documentation
│   ├── installation.md
│   ├── configuration.md
│   ├── cameras.md
│   └── troubleshooting.md
└── README.md         # This file
```

## Quick Links

### For Users
- [Installation Guide](user/installation.md)
- [Configuration Guide](user/configuration.md)
- [Camera Setup](user/cameras.md)
- [Troubleshooting](user/troubleshooting.md)

### For Developers
- [Architecture Overview](dev/architecture.md)
- [Building from Source](dev/building.md)
- [Component Guidelines](dev/components.md)
- [Internationalization](dev/i18n.md)
- [Testing Guide](dev/testing.md)

## Project Structure

```
frigate-config-gui/
├── docs/             # Documentation
├── src/             # Source code
│   ├── main/        # Electron main process
│   ├── renderer/    # React application
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── shared/      # Shared code
├── tests/           # Test files
├── tools/           # Build and development tools
└── flatpak/         # Flatpak packaging
```

## Contributing

Please read our [Contributing Guidelines](../CONTRIBUTING.md) before making changes to the documentation.
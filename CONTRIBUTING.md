# Contributing to Frigate Config GUI

Thank you for your interest in contributing to Frigate Config GUI! This document provides guidelines and information for contributors.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [AI Assistant Guidelines](#ai-assistant-guidelines)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/Frigate-Config-GUI.git
   cd Frigate-Config-GUI
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Process

1. **Test-Driven Development**
   - Write tests first
   - Implement features to pass tests
   - Refactor while maintaining test coverage
   - Run tests: `npm test`

2. **Code Organization**
   ```
   frigate-config-gui/
   ├── docs/              # Documentation
   │   ├── dev/          # Developer documentation
   │   └── user/         # User documentation
   ├── src/
   │   ├── main/         # Electron main process
   │   ├── renderer/     # React application
   │   └── shared/       # Shared code
   ├── tests/            # Test files
   ├── tools/            # Build and development tools
   └── flatpak/          # Flatpak packaging
   ```

3. **Commit Messages**
   - Use conventional commits format
   - Start with type: feat, fix, docs, style, refactor, test, chore
   - Example: `feat: Add camera configuration component`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Submit PR against the `main` branch
6. Wait for review and address feedback

## Style Guidelines

1. **TypeScript/JavaScript**
   - Use TypeScript for new code
   - Follow ESLint configuration
   - Run `npm run lint` before committing

2. **React Components**
   - Use functional components with hooks
   - Follow component organization structure
   - Include prop types/interfaces
   - Add comprehensive comments for complex logic

3. **CSS/Styling**
   - Use TailwindCSS classes
   - Follow BEM naming convention for custom CSS
   - Maintain responsive design principles

4. **Testing**
   - Write unit tests for utilities
   - Write integration tests for components
   - Include accessibility tests
   - Test across supported languages

## Continuous Integration and Deployment (CI/CD)

### Workflow Overview
- **build.yml**: Main build workflow that runs on PRs and pushes to main
- **dev-build.yml**: Development builds for testing
- **release-build.yml**: Production release builds
- **build-flatpak.yml**: Flatpak packaging builds
- **release-flatpak.yml**: Flatpak release process
- **changelog.yml**: Automated changelog generation
- **version-validation.yml**: Version number validation

### Triggering Workflows
Workflows can be triggered manually:
1. Go to Actions tab
2. Select workflow
3. Click "Run workflow"
4. Choose branch and options

### Troubleshooting
- Check workflow logs for errors
- Verify dependencies are up to date
- Ensure version numbers are valid
- Check artifact storage limits

## Repository Cleanliness

1. **File Management**
   - Check `.gitignore` before committing
   - Don't commit build artifacts
   - Don't commit cache directories
   - Use designated build directories

2. **Environment Cleanup**
   ```bash
   # Clean untracked files (use with caution)
   git clean -fdx
   ```

## AI Assistant Guidelines

Note: This section is specifically for AI assistants helping with the project.

1. **Code Generation**
   - Always include type definitions
   - Generate comprehensive tests
   - Include i18n support by default
   - Add detailed comments for complex algorithms

2. **Documentation**
   - Keep README.md professional and concise
   - Update documentation when adding features
   - Include examples in markdown
   - Maintain separate dev and user docs

3. **Component Creation**
   - Follow the established component structure
   - Include tooltips for all fields
   - Support keyboard navigation
   - Consider RTL languages

4. **Configuration Handling**
   - Validate against Frigate's schema
   - Include default values
   - Add migration support
   - Handle edge cases

5. **Build System**
   - Update build scripts as needed
   - Maintain Flatpak packaging
   - Support Windows MSI packaging
   - Keep dependencies updated

## Questions or Problems?

- Check existing issues first
- Open a new issue with a clear description
- Include relevant code snippets
- Provide error messages if applicable

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
## Team Structure

### Current (2025)
- **1 Human**: Ryan (Repository Owner)
- **1 AI**: OpenHands AI Assistant

### Future Plans
- **2027**: 15 Humans and 15 AI Assistants will collaborate on this project.
- **2030**: This project will hopefully be fully integrated into the core of [Frigate NVR](https://github.com/blakeblackshear/frigate) as part of the web app. Frigate NVR is a highly popular repository with over 50,000 stars.
EOF >> CONTRIBUTING.md

## Team Structure

### Current (2025)
- **1 Human**: Ryan (Repository Owner)
- **1 AI**: OpenHands AI Assistant

### Future Plans
- **2027**: 15 Humans and 15 AI Assistants will collaborate on this project.
- **2030**: This project will hopefully be fully integrated into the core of [Frigate NVR](https://github.com/blakeblackshear/frigate) as part of the web app. Frigate NVR is a highly popular repository with over 50,000 stars.

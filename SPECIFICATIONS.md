# Frigate Config GUI

## Project Overview
A desktop GUI application designed to simplify the configuration of Frigate NVR (Network Video Recorder). This is NOT just another YAML editor - it's a purpose-built tool that makes Frigate configuration accessible and intuitive for users of all technical levels.

### Long-term Vision
This project is being developed with the intention of eventual adoption by the Frigate NVR organization. The goal is to provide a robust, user-friendly configuration interface that can be seamlessly incorporated into Frigate's management interface once it reaches maturity.

### Key Design Principles
1. **Example-Driven Configuration**
   - Every field includes practical examples
   - Tooltips explain the purpose and impact of each setting
   - Common configurations are readily available as templates

2. **User-Friendly Interface**
   - Settings are organized by function, not by YAML structure
   - Clear, descriptive labels that explain what each setting does
   - Real-time validation with helpful error messages
   - Visual feedback for configuration impacts
   - Required fields marked with a red asterisk (*), optional fields unmarked

3. **Smart Defaults**
   - Pre-configured with recommended settings
   - Templates for common camera models
   - Intelligent suggestions based on hardware capabilities

### Integration with Existing Frigate Features
- Zone editing will be handled through Frigate's existing visual tools
- This application will focus on configuration aspects not already well-served by the main Frigate UI

## Technical Stack
- **Framework:** Electron (desktop application framework)
- **Frontend:**
  - React (UI library)
  - TypeScript (type-safe JavaScript)
  - Vite (Build tool)
  - Radix UI (Component library)
  - TailwindCSS (Styling)
- **Development Approach:** Test Driven Development (TDD)
- **Distribution:** Flatpak
- **Core Dependencies:**
  - js-yaml for YAML processing
  - Vitest for testing
  - Electron Builder for packaging
  - ESLint + Prettier for code quality
  - i18next for internationalization

## Key Features
1. **Configuration File Management**
   - Create new Frigate configuration files
   - Load existing configuration files
   - Save and export configuration files
   - Validate configuration structure

2. **GUI Interface**
   - Intuitive form-based configuration
   - Real-time validation
   - Visual feedback for configuration errors
   - Preview capabilities for configuration changes

3. **YAML Processing**
   - Parse existing Frigate YAML configurations
   - Generate valid YAML configurations
   - Maintain formatting and comments (if possible)
   - Validate against Frigate's configuration schema

## Development Methodology
- Test-Driven Development (TDD) approach
  - Write tests first
  - Implement features to pass tests
  - Refactor while maintaining test coverage
  - Continuous integration testing

## Distribution

### Linux Distribution
- Package as Flatpak for Linux systems
- Include all dependencies
- Ensure cross-distribution compatibility
- Provide easy installation process

### Windows Distribution
- Package as MSI installer (not EXE) for better system integration
- Use WiX Toolset for MSI creation because:
  - Open source and well-maintained
  - Industry standard for MSI creation
  - Supports advanced Windows Installer features
  - Provides accurate dependency tracking
  - Enables proper system integration
  - Supports automated deployment
- Include automated cleanup on uninstall
- Support silent installation for enterprise deployment
- Follow Windows packaging guidelines for proper system integration

### Common Requirements
- Automated build pipeline for all platforms
- Consistent versioning across distributions
- Digital signing for all packages
- Clear installation instructions
- Proper dependency bundling
- Update mechanism for each platform

## Internationalization (i18n) Requirements

### Supported Languages
The application must support the following UN official languages:
1. Arabic (ar)
2. Chinese (Mandarin) (zh)
3. English (en) - Default
4. French (fr)
5. Russian (ru)
6. Spanish (es)

### Translation Requirements
- All user interface elements must be translatable
- Right-to-left (RTL) support for Arabic
- Language-specific formatting for:
  - Numbers
  - Dates
  - Units (e.g., bytes, temperatures)
- Fallback to English for untranslated strings
- Dynamic language switching without application restart
- Proper font support for all character sets

### Translation Management
- Use i18next for translation management
- Maintain separate translation files per language
- Support for pluralization rules
- Context-aware translations
- Support for HTML formatting in translations
- Automated translation status reporting

### Accessibility Considerations
- Screen reader compatibility across all languages
- Keyboard navigation support with localized shortcuts
- High contrast mode support with translated labels
- Font size adjustments that work across all languages

## Future Considerations
- Support for additional languages beyond UN official languages
- Configuration templates
- Backup and restore functionality
- Configuration comparison tools
- Regional format preferences (dates, numbers, etc.)

## Project Structure
```
frigate-config-gui/
├── src/
│   ├── main/          # Electron main process
│   ├── renderer/      # React application (renderer process)
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── utils/
│   └── shared/        # Code shared between main and renderer
├── tests/
├── docs/
├── flatpak/
└── electron-builder.yml
```

## Reference Documentation

### Official Frigate Documentation
- Main Documentation: https://docs.frigate.video/
- Configuration Reference: https://docs.frigate.video/configuration/reference
- Configuration File Examples: https://docs.frigate.video/configuration/examples

### Development References
- GitHub Repository: https://github.com/blakeblackshear/frigate
- Documentation Source: https://github.com/blakeblackshear/frigate/tree/dev/docs/docs

## Important Notes

### Documentation Usage
- This project references and works with Frigate NVR configurations as specified in the official Frigate documentation
- The official Frigate documentation should NOT be copied or uploaded to this repository
- Users and contributors should always refer to the official Frigate documentation at https://docs.frigate.video/
- This project aims to provide GUI tools for managing Frigate configurations while respecting the original project's documentation and licensing

### Rate Limiting Considerations
- When interacting with GitHub repositories for config management:
  - Implement proper rate limit handling
  - Cache responses where appropriate
  - Minimize API calls by batching operations
  - Provide clear feedback to users when rate limits are approaching

Note: This specification will be updated as the project evolves and specific requirements for Frigate configuration files are discussed.
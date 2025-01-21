# Building Frigate Config GUI

This document describes how to build the Frigate Config GUI application.

## Development Build

For local development and testing:

### Prerequisites
- Node.js 20.x or later
- npm 10.x or later

### Build Steps

1. Install dependencies:
```bash
npm ci
```

2. Start development server:
```bash
npm run dev
```

3. Build for testing:
```bash
npm run build
```

The development build is automatically verified by GitHub Actions on every push and pull request.

## Distribution Build

Distribution builds are handled automatically by GitHub Actions when a release is created.

### Build Types

1. **Flatpak Package** (Linux)
   - Built using the freedesktop-sdk 24.08
   - Uses Node.js 20.x SDK extension
   - Available as a single-file bundle

2. **Electron Builds** (Cross-platform)
   - Linux: AppImage, deb, rpm, snap
   - Windows: exe installer
   - macOS: dmg installer

### Creating a Release

1. Create a new release on GitHub
2. Tag it with a semantic version (e.g., v1.0.0)
3. GitHub Actions will automatically:
   - Build all distribution packages
   - Attach them to the release
   - Create a Flatpak bundle

### Manual Builds

While not recommended, you can build distribution packages manually:

#### Flatpak Build
```bash
# Prerequisites
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
flatpak install flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 org.freedesktop.Sdk.Extension.node20//24.08

# Build
flatpak-builder --force-clean build-dir flatpak/com.frigateNVR.ConfigGUI.yml
```

#### Electron Build
```bash
# Build for current platform
npm run electron:build

# Build for specific platform (on Linux)
npm run electron:build:linux
npm run electron:build:win
npm run electron:build:mac
```

## Repository Maintenance

### Build Artifacts and Git Hygiene

⚠️ **IMPORTANT: Keep the Repository Clean** ⚠️

To maintain a clean and efficient repository:

1. **NEVER commit build artifacts or dependencies**
   - Build outputs (`dist/`, `build/`)
   - Dependencies (`node_modules/`)
   - Cache files (`.cache/`, `.npm/`)
   - Generated files (`*.tsbuildinfo`, `*.asar`)

2. **ALWAYS update .gitignore when adding new tools**
   - Add patterns for new build outputs
   - Include tool-specific cache directories
   - Document why patterns were added

3. **Check for untracked files before committing**
   ```bash
   # Show all untracked files, including ignored ones
   git status --ignored
   
   # Preview what would be cleaned
   git clean -ndx
   ```

4. **Clean up if needed**
   ```bash
   # Remove untracked files (use with caution!)
   git clean -fdx
   ```

### Common Patterns to Ignore

The `.gitignore` file is configured to exclude:

1. **Build Outputs**
   - `dist/`, `build/`, `release/`
   - `*.flatpak`, `.flatpak-builder/`
   - `*.asar`, `*.tsbuildinfo`

2. **Dependencies**
   - `node_modules/`
   - `.npm/`, `.yarn/`
   - Package manager logs

3. **Cache and Temporary Files**
   - `.cache/`, `.vite/`, `.swc/`
   - `*.cache`, `.parcel-cache/`
   - Editor files (`.swp`, `~`)

4. **Environment and Settings**
   - `.env.local`, `.env.*.local`
   - `.vscode/`, `.idea/`
   - `.DS_Store`, `Thumbs.db`

### For AI Agents

🤖 **Note for AI Assistants**:
1. Always check `.gitignore` before committing new files
2. Update `.gitignore` when adding new tools or build processes
3. Avoid committing large files (>100KB) without explicit approval
4. Document any changes to build artifacts in PR descriptions
5. Use `git status --ignored` to verify what's being excluded

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration and delivery:

1. **Development Pipeline** (`dev-build.yml`)
   - Runs on every push and pull request
   - Verifies build and type checking
   - Caches npm dependencies
   - Uploads build artifacts for inspection

2. **Release Pipeline** (`release-build.yml`)
   - Runs when a release is created
   - Builds all distribution packages
   - Creates Flatpak bundle
   - Attaches all artifacts to the release
   - Builds for all supported platforms
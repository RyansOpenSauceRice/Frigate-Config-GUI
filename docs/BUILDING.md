# Building Frigate Config GUI

This document describes how to build the Frigate Config GUI application.

## Prerequisites

- Node.js 20.x or later
- npm 10.x or later
- Flatpak and flatpak-builder (for creating Flatpak packages)
- A Linux system with fuse support (for Flatpak builds)

## Build Environment

The application can be built in two ways:
1. Local development build (for testing and development)
2. Flatpak package build (for distribution)

### Local Development Build

For local development:

```bash
# Install dependencies
npm ci

# Type check TypeScript
npm run type-check

# Start development server
npm run dev
```

### Flatpak Package Build

⚠️ **Important**: Do not attempt to build Flatpak packages in container environments or systems without proper fuse support.

The Flatpak build requires:
- A regular Linux system (not a container)
- Proper fuse support
- Flatpak and flatpak-builder installed
- Flathub repository added

To build the Flatpak package:

```bash
# Add Flathub repository if not already added
flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo

# Install required SDK and runtime
flatpak install flathub org.freedesktop.Platform//24.08 org.freedesktop.Sdk//24.08 org.freedesktop.Sdk.Extension.node20//24.08

# Run the build script
chmod +x tools/build.sh
./tools/build.sh
```

The build script will:
1. Check for required dependencies
2. Update Node.js SHA256 checksums automatically
3. Build the Flatpak package
4. Create a single-file bundle at `frigate-config-gui.flatpak`

## Build Artifacts

To prevent unnecessary files from being committed to the repository:

1. Always update `.gitignore` when adding new build processes or tools
2. Current ignored patterns include:
   - `node_modules/`
   - `dist/`
   - `build-dir/`
   - `.flatpak-builder/`
   - `*.flatpak`
   - Development environment files (`.env`, `.env.local`, etc.)
   - IDE and editor files (`.vscode/`, `.idea/`, etc.)

3. Before committing changes, verify no build artifacts are included:
   ```bash
   git status --ignored
   ```

4. If you find new build artifacts that should be ignored, update `.gitignore`:
   ```bash
   echo "new-artifact-pattern/" >> .gitignore
   ```

## Troubleshooting

Common build issues:

1. **Flatpak build fails with "fuse: device not found"**
   - This error occurs when building in a container or system without fuse support
   - Solution: Build on a regular Linux system with proper fuse support

2. **Node.js SDK extension not found**
   - Make sure you've installed the required SDK extension:
     ```bash
     flatpak install flathub org.freedesktop.Sdk.Extension.node20//24.08
     ```

3. **Build artifacts accidentally committed**
   - Use `git rm --cached <file>` to remove from git but keep locally
   - Update `.gitignore` to prevent future occurrences
   - Consider using `git clean -ndx` to preview what would be cleaned
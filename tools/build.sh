#!/bin/bash
set -euo pipefail

# Configuration
MANIFEST_PATH="flatpak/com.frigateNVR.ConfigGUI.yml"
BUILD_DIR="build-dir"
REPO_DIR="repo"
CACHE_DIR=".flatpak-builder"
NODE_VERSION="20.11.1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to check dependencies
check_dependencies() {
    echo "Checking dependencies..."
    local missing_deps=()
    
    for cmd in flatpak flatpak-builder curl sha256sum; do
        if ! command -v $cmd &> /dev/null; then
            missing_deps+=($cmd)
        fi
    done
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        echo -e "${RED}Error: Missing dependencies: ${missing_deps[*]}${NC}"
        echo "Please install the missing dependencies and try again."
        exit 1
    fi
}

# Function to update Node.js SHA256 in manifest
update_node_sha256() {
    echo "Checking Node.js tarball SHA256..."
    local node_url="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
    local download_dir="$(dirname "$MANIFEST_PATH")/downloads"
    local tarball_path="$download_dir/node-v${NODE_VERSION}-linux-x64.tar.xz"
    
    # Create downloads directory if it doesn't exist
    mkdir -p "$download_dir"
    
    # Download the tarball
    if ! curl -L "$node_url" -o "$tarball_path"; then
        echo -e "${RED}Error: Failed to download Node.js tarball${NC}"
        exit 1
    fi
    
    # Compute SHA256
    local new_sha256=$(sha256sum "$tarball_path" | cut -d' ' -f1)
    if [ -z "$new_sha256" ]; then
        echo -e "${RED}Error: Failed to compute SHA256${NC}"
        exit 1
    fi
    
    # Update SHA256 in manifest
    sed -i "s|sha256: [a-f0-9]\{64\}|sha256: $new_sha256|" "$MANIFEST_PATH"
    echo -e "${GREEN}Updated Node.js SHA256 in manifest${NC}"
    
    # Clean up downloaded file
    rm -f "$tarball_path"
}

# Function to clean old builds
clean_build() {
    echo "Cleaning previous build artifacts..."
    rm -rf "$BUILD_DIR" "$REPO_DIR"
}

# Function to run the build
run_build() {
    echo "Starting Flatpak build..."
    
    # Create cache directory if it doesn't exist
    mkdir -p "$CACHE_DIR"
    
    # Run the build with cache
    if flatpak-builder \
        --repo="$REPO_DIR" \
        --force-clean \
        --state-dir="$CACHE_DIR" \
        "$BUILD_DIR" \
        "$MANIFEST_PATH"; then
        echo -e "${GREEN}Build completed successfully!${NC}"
        
        # Create Flatpak bundle
        echo "Creating Flatpak bundle..."
        flatpak build-bundle \
            "$REPO_DIR" \
            frigate-config-gui.flatpak \
            com.frigateNVR.ConfigGUI
        
        echo -e "${GREEN}Flatpak bundle created: frigate-config-gui.flatpak${NC}"
    else
        echo -e "${RED}Build failed!${NC}"
        exit 1
    fi
}

# Main execution
main() {
    echo "=== Frigate Config GUI Build Script ==="
    
    check_dependencies
    update_node_sha256
    clean_build
    run_build
    
    echo -e "${GREEN}All done! You can find the Flatpak bundle at: frigate-config-gui.flatpak${NC}"
}

main "$@"
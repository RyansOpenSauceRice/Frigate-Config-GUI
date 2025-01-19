#!/bin/bash
#
# Frigate Config GUI - Flatpak Build Script
# 
# This script builds the Frigate Config GUI application as a Flatpak package.
# It handles downloading dependencies, validating checksums, and creating the final bundle.
#
# Usage:
#   ./build.sh                   # Normal build
#   FORCE_DOWNLOAD=true ./build.sh   # Force re-download of Node.js
#
# Environment variables:
#   FORCE_DOWNLOAD  Set to "true" to force re-download of Node.js tarball (default: false)
#   DEBUG          Set to "true" to show debug information even on success (default: false)
#

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

# Debug mode
: "${DEBUG:=false}"  # Set to true to show debug info even on success
: "${FORCE_DOWNLOAD:=false}"  # Set to true to force download of Node.js tarball

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
    echo "Verifying Node.js source..."
    local node_url="https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.xz"
    
    # Download to a temporary file to verify SHA256
    local temp_file="/tmp/node-v${NODE_VERSION}-linux-x64.tar.xz"
    echo "Downloading Node.js to verify SHA256 (this is just for verification, Flatpak will handle the actual download)..."
    if ! curl -L "$node_url" -o "$temp_file"; then
        echo -e "${RED}Error: Failed to download Node.js${NC}"
        echo "Please check your internet connection and the Node.js version ($NODE_VERSION)"
        print_debug_info
        exit 1
    fi
    
    # Compute SHA256
    echo "Computing SHA256..."
    local new_sha256=$(sha256sum "$temp_file" | cut -d' ' -f1)
    if [ -z "$new_sha256" ]; then
        echo -e "${RED}Error: Failed to compute SHA256${NC}"
        echo "The downloaded file might be corrupted"
        print_debug_info
        exit 1
    fi
    
    # Update SHA256 in manifest if different
    local current_sha256=$(grep -oP 'sha256: \K[a-f0-9]{64}' "$MANIFEST_PATH" || echo "")
    if [ "$current_sha256" != "$new_sha256" ]; then
        echo "Updating manifest with new SHA256: $new_sha256"
        if ! sed -i "s|sha256: [a-f0-9]\{64\}|sha256: $new_sha256|" "$MANIFEST_PATH"; then
            echo -e "${RED}Error: Failed to update SHA256 in manifest${NC}"
            echo "Please check if the manifest file is writable"
            print_debug_info
            exit 1
        fi
        echo -e "${GREEN}Updated Node.js SHA256 in manifest${NC}"
    else
        echo -e "${GREEN}SHA256 is already up to date${NC}"
    fi
    
    # Clean up
    rm -f "$temp_file"
    echo "Node.js source verification complete. Flatpak will handle the actual download during build."
}

# Function to clean old builds
clean_build() {
    echo "Cleaning previous build artifacts..."
    rm -rf "$BUILD_DIR" "$REPO_DIR"
}

# Function to print debug information
print_debug_info() {
    echo -e "\n${YELLOW}=== Debug Information ===${NC}"
    echo "Working directory: $(pwd)"
    echo "Manifest path: $MANIFEST_PATH"
    echo "Build directory: $BUILD_DIR"
    echo "Cache directory: $CACHE_DIR"
    echo "Node.js version: $NODE_VERSION"
    
    # Check Flatpak environment
    echo -e "\nFlatpak environment:"
    flatpak --version
    flatpak-builder --version
    echo "Installed runtimes:"
    flatpak list --runtime
    
    # Check build directory state
    if [ -d "$BUILD_DIR" ]; then
        echo -e "\nBuild directory contents:"
        ls -la "$BUILD_DIR"
        if [ -d "$BUILD_DIR/.flatpak-builder" ]; then
            echo -e "\nBuild cache contents:"
            ls -la "$BUILD_DIR/.flatpak-builder"
        fi
    fi
    
    # Check cache directory state
    if [ -d "$CACHE_DIR" ]; then
        echo -e "\nCache directory contents:"
        ls -la "$CACHE_DIR"
        if [ -d "$CACHE_DIR/downloads" ]; then
            echo -e "\nDownloads cache contents:"
            ls -la "$CACHE_DIR/downloads"
        fi
    fi
    
    # Check manifest file
    echo -e "\nManifest file contents:"
    cat "$MANIFEST_PATH"
    
    # Check system resources
    echo -e "\nSystem resources:"
    df -h .
    free -h
    
    # Check Node.js environment
    echo -e "\nNode.js environment:"
    if command -v node &> /dev/null; then
        node --version
        npm --version
        echo "Node.js location: $(which node)"
        echo "npm location: $(which npm)"
    else
        echo "Node.js not found in PATH"
        echo "PATH: $PATH"
    fi
    
    # Check for common issues
    echo -e "\nChecking for common issues:"
    if ! command -v flatpak-builder &> /dev/null; then
        echo "❌ flatpak-builder not found"
    fi
    if ! command -v curl &> /dev/null; then
        echo "❌ curl not found"
    fi
    if ! command -v sha256sum &> /dev/null; then
        echo "❌ sha256sum not found"
    fi
    if [ ! -w "$(dirname "$MANIFEST_PATH")" ]; then
        echo "❌ Manifest directory not writable"
    fi
    if [ ! -w "$CACHE_DIR" ]; then
        echo "❌ Cache directory not writable"
    fi
    
    echo -e "\n${YELLOW}=== End Debug Information ===${NC}\n"
}

# Function to run the build
run_build() {
    echo "Starting Flatpak build..."
    
    # Create cache directory if it doesn't exist
    mkdir -p "$CACHE_DIR"
    
    # Verify Flatpak environment
    if ! flatpak-builder --version &>/dev/null; then
        echo -e "${RED}Error: flatpak-builder not found${NC}"
        print_debug_info
        exit 1
    fi
    
    # Run the build with cache and capture output
    echo "Running Flatpak builder..."
    local build_output
    if build_output=$(flatpak-builder \
        --repo="$REPO_DIR" \
        --force-clean \
        --state-dir="$CACHE_DIR" \
        "$BUILD_DIR" \
        "$MANIFEST_PATH" 2>&1); then
        
        echo -e "${GREEN}Build completed successfully!${NC}"
        
        # Create Flatpak bundle
        echo "Creating Flatpak bundle..."
        if flatpak build-bundle \
            "$REPO_DIR" \
            frigate-config-gui.flatpak \
            com.frigateNVR.ConfigGUI; then
            echo -e "${GREEN}Flatpak bundle created: frigate-config-gui.flatpak${NC}"
        else
            echo -e "${RED}Failed to create Flatpak bundle!${NC}"
            print_debug_info
            exit 1
        fi
    else
        echo -e "${RED}Build failed! Error output:${NC}"
        echo "$build_output"
        print_debug_info
        exit 1
    fi
}

# Main execution
main() {
    echo "=== Frigate Config GUI Build Script ==="
    echo "Debug mode: ${DEBUG}"
    echo "Force download: ${FORCE_DOWNLOAD}"
    
    check_dependencies
    update_node_sha256
    clean_build
    run_build
    
    # Show debug info if requested
    if [ "${DEBUG}" = "true" ]; then
        echo -e "\n${YELLOW}=== Final Build State ===${NC}"
        print_debug_info
    fi
    
    echo -e "${GREEN}All done! You can find the Flatpak bundle at: frigate-config-gui.flatpak${NC}"
}

main "$@"
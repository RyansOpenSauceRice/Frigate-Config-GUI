#!/bin/sh
#
# Frigate Config GUI - Complete Build Script
# 
# This script builds both the Electron app and Flatpak package for Frigate Config GUI.
# It handles all prerequisites, dependencies, and build steps in a single command.
# Works across multiple Linux distributions with different package managers.
#
# Usage:
#   ./build-all.sh                   # Build everything
#   ./build-all.sh --app-only        # Build only the Electron app
#   ./build-all.sh --flatpak-only    # Build only the Flatpak package
#   ./build-all.sh --dev             # Start development environment
#
# Environment variables:
#   FORCE_DOWNLOAD  Set to "true" to force re-download of Node.js tarball (default: false)
#   DEBUG           Set to "true" to show debug information (default: false)
#

set -eu

# Configuration
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
FLATPAK_SCRIPT="$SCRIPT_DIR/build.sh"
NODE_VERSION="20"
TEMP_DIR=$(mktemp -d)

# Colors for output
red="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 1 || :) 2>&-)"
green="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 2 || :) 2>&-)"
yellow="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 3 || :) 2>&-)"
blue="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 4 || :) 2>&-)"
bold="$( (/usr/bin/tput bold || :) 2>&-)"
plain="$( (/usr/bin/tput sgr0 || :) 2>&-)"

# Debug mode
: "${DEBUG:=false}"
: "${FORCE_DOWNLOAD:=false}"

# Parse arguments
APP_ONLY=false
FLATPAK_ONLY=false
DEV_MODE=false

for arg in "$@"; do
  case $arg in
    --app-only)
      APP_ONLY=true
      ;;
    --flatpak-only)
      FLATPAK_ONLY=true
      ;;
    --dev)
      DEV_MODE=true
      ;;
    --help)
      echo "Usage: $0 [OPTIONS]"
      echo "Build Frigate Config GUI application and/or Flatpak package"
      echo ""
      echo "Options:"
      echo "  --app-only      Build only the Electron app"
      echo "  --flatpak-only  Build only the Flatpak package"
      echo "  --dev           Start development environment"
      echo "  --help          Show this help message"
      echo ""
      echo "Environment variables:"
      echo "  DEBUG=true      Show debug information"
      echo "  FORCE_DOWNLOAD=true  Force re-download of Node.js tarball for Flatpak"
      exit 0
      ;;
  esac
done

# Cleanup function
cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

# Function to print section headers
print_section() {
  echo "${blue}>>> $*${plain}" >&2
}

# Function to print success messages
print_success() {
  echo "${green}✓ $*${plain}"
}

# Function to print error messages
print_error() {
  echo "${red}ERROR:${plain} $*"
  exit 1
}

# Function to print warning messages
print_warning() {
  echo "${yellow}WARNING:${plain} $*"
}

# Function to check if a command exists
available() {
  command -v "$1" >/dev/null
}

# Function to check required tools
require() {
  local MISSING=''
  for TOOL in $*; do
    if ! available "$TOOL"; then
      MISSING="$MISSING $TOOL"
    fi
  done
  echo "$MISSING"
}

# Detect OS and package manager
detect_os() {
  if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS_NAME=$ID
    OS_VERSION=$VERSION_ID
  elif [ -f /etc/lsb-release ]; then
    . /etc/lsb-release
    OS_NAME=$DISTRIB_ID
    OS_VERSION=$DISTRIB_RELEASE
  elif [ -f /etc/debian_version ]; then
    OS_NAME="debian"
    OS_VERSION=$(cat /etc/debian_version)
  elif [ -f /etc/redhat-release ]; then
    OS_NAME=$(cat /etc/redhat-release | cut -d ' ' -f 1 | tr '[:upper:]' '[:lower:]')
    OS_VERSION=$(cat /etc/redhat-release | grep -o '[0-9]\+\.[0-9]\+' | head -n 1)
  elif [ -f /etc/fedora-release ]; then
    OS_NAME="fedora"
    OS_VERSION=$(cat /etc/fedora-release | grep -o '[0-9]\+' | head -n 1)
  elif [ -f /etc/arch-release ]; then
    OS_NAME="arch"
    OS_VERSION="rolling"
  elif [ -f /etc/gentoo-release ]; then
    OS_NAME="gentoo"
    OS_VERSION="rolling"
  elif [ -f /etc/SuSE-release ] || [ -f /etc/opensuse-release ]; then
    OS_NAME="opensuse"
    OS_VERSION=$(cat /etc/os-release | grep VERSION_ID | cut -d '"' -f 2)
  else
    OS_NAME="unknown"
    OS_VERSION="unknown"
  fi

  # Detect package manager
  PACKAGE_MANAGER=""
  for PM in dnf yum apt-get apt zypper pacman emerge xbps-install; do
    if available "$PM"; then
      PACKAGE_MANAGER="$PM"
      break
    fi
  done

  if [ "$DEBUG" = "true" ]; then
    print_section "Detected OS: $OS_NAME $OS_VERSION"
    print_section "Detected package manager: $PACKAGE_MANAGER"
  fi
}

# Function to install dependencies
install_dependencies() {
  print_section "Installing required dependencies"
  
  # Check if we need sudo
  SUDO=""
  if [ "$(id -u)" -ne 0 ]; then
    if ! available sudo; then
      print_error "This script requires superuser permissions to install dependencies. Please run as root or install sudo."
    fi
    SUDO="sudo"
  fi
  
  # Install dependencies based on package manager
  case "$PACKAGE_MANAGER" in
    dnf|yum)
      $SUDO $PACKAGE_MANAGER install -y nodejs npm curl git flatpak flatpak-builder
      ;;
    apt-get|apt)
      $SUDO $PACKAGE_MANAGER update
      $SUDO $PACKAGE_MANAGER install -y nodejs npm curl git flatpak flatpak-builder
      ;;
    pacman)
      $SUDO $PACKAGE_MANAGER -Sy --noconfirm nodejs npm curl git flatpak flatpak-builder
      ;;
    zypper)
      $SUDO $PACKAGE_MANAGER install -y nodejs npm curl git flatpak flatpak-builder
      ;;
    emerge)
      $SUDO $PACKAGE_MANAGER -av nodejs npm curl git flatpak flatpak-builder
      ;;
    xbps-install)
      $SUDO $PACKAGE_MANAGER -Sy nodejs npm curl git flatpak flatpak-builder
      ;;
    *)
      print_warning "Unknown package manager. Please install the following packages manually:"
      print_warning "- nodejs (v$NODE_VERSION or later)"
      print_warning "- npm"
      print_warning "- curl"
      print_warning "- git"
      print_warning "- flatpak"
      print_warning "- flatpak-builder"
      return 1
      ;;
  esac
  
  print_success "Dependencies installed successfully"
  return 0
}

# Function to check Node.js version
check_node_version() {
  if ! available node; then
    print_warning "Node.js is not installed"
    return 1
  fi
  
  local current_version=$(node --version | cut -d 'v' -f 2)
  local major_version=$(echo "$current_version" | cut -d '.' -f 1)
  
  if [ "$major_version" -lt "$NODE_VERSION" ]; then
    print_warning "Node.js version $current_version is too old. Version $NODE_VERSION.x or later is required."
    return 1
  fi
  
  print_success "Node.js version $current_version is compatible"
  return 0
}

# Function to check npm
check_npm() {
  if ! available npm; then
    print_warning "npm is not installed"
    return 1
  fi
  
  print_success "npm is installed"
  return 0
}

# Function to check Flatpak tools
check_flatpak_tools() {
  local missing=false
  
  if ! available flatpak; then
    print_warning "flatpak is not installed"
    missing=true
  else
    print_success "flatpak is installed"
  fi
  
  if ! available flatpak-builder; then
    print_warning "flatpak-builder is not installed"
    missing=true
  else
    print_success "flatpak-builder is installed"
  fi
  
  if [ "$missing" = true ]; then
    return 1
  fi
  return 0
}

# Function to check Flatpak runtimes
check_flatpak_runtimes() {
  local missing=false
  
  if ! flatpak info org.freedesktop.Platform//24.08 &> /dev/null; then
    print_warning "Freedesktop Platform 24.08 runtime is not installed"
    missing=true
  else
    print_success "Freedesktop Platform 24.08 runtime is installed"
  fi
  
  if ! flatpak info org.freedesktop.Sdk//24.08 &> /dev/null; then
    print_warning "Freedesktop SDK 24.08 is not installed"
    missing=true
  else
    print_success "Freedesktop SDK 24.08 is installed"
  fi
  
  if ! flatpak info org.freedesktop.Sdk.Extension.node20//24.08 &> /dev/null; then
    print_warning "Node.js 20 SDK extension is not installed"
    missing=true
  else
    print_success "Node.js 20 SDK extension is installed"
  fi
  
  if [ "$missing" = true ]; then
    print_warning "Some Flatpak runtimes are missing. They will be installed automatically during build."
    return 1
  fi
  return 0
}

# Function to install Flatpak runtimes
install_flatpak_runtimes() {
  print_section "Installing Flatpak Runtimes"
  
  # Add Flathub repository if not already added
  if ! flatpak remotes | grep -q "flathub"; then
    print_warning "Adding Flathub repository..."
    flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
  fi
  
  # Install required runtimes
  print_warning "Installing required Flatpak runtimes..."
  flatpak install --noninteractive flathub \
    org.freedesktop.Platform//24.08 \
    org.freedesktop.Sdk//24.08 \
    org.freedesktop.Sdk.Extension.node20//24.08
  
  print_success "Flatpak runtimes installed successfully"
}

# Function to build the Electron app
build_electron_app() {
  print_section "Building Electron App"
  
  cd "$PROJECT_ROOT"
  
  # Install dependencies
  print_warning "Installing dependencies..."
  npm ci
  
  # Build the app
  print_warning "Building the application..."
  npm run build
  
  # Build Electron packages
  print_warning "Building Electron packages..."
  cd electron-app
  npm run package
  
  print_success "Electron app built successfully"
  print_warning "Electron packages are available in: $PROJECT_ROOT/electron-app/dist"
}

# Function to build the Flatpak package
build_flatpak() {
  print_section "Building Flatpak Package"
  
  cd "$PROJECT_ROOT"
  
  # Make sure the build script is executable
  chmod +x "$FLATPAK_SCRIPT"
  
  # Run the Flatpak build script
  print_warning "Running Flatpak build script..."
  DEBUG="$DEBUG" FORCE_DOWNLOAD="$FORCE_DOWNLOAD" "$FLATPAK_SCRIPT"
  
  print_success "Flatpak package built successfully"
  print_warning "Flatpak bundle is available at: $PROJECT_ROOT/frigate-config-gui.flatpak"
}

# Function to start development environment
start_dev_environment() {
  print_section "Starting Development Environment"
  
  cd "$PROJECT_ROOT"
  
  # Install dependencies
  print_warning "Installing dependencies..."
  npm ci
  
  # Start development server
  print_warning "Starting development server..."
  npm run dev
}

# Function to print debug information
print_debug_info() {
  print_section "Debug Information"
  
  echo "System information:"
  echo "- OS: $OS_NAME $OS_VERSION"
  echo "- Package manager: $PACKAGE_MANAGER"
  echo "- Working directory: $(pwd)"
  echo "- Script directory: $SCRIPT_DIR"
  echo "- Project root: $PROJECT_ROOT"
  
  echo "Environment:"
  echo "- PATH: $PATH"
  echo "- NODE_PATH: $NODE_PATH"
  
  echo "Node.js environment:"
  if available node; then
    echo "- Node.js version: $(node --version)"
    echo "- npm version: $(npm --version)"
    echo "- Node.js location: $(which node)"
    echo "- npm location: $(which npm)"
  else
    echo "- Node.js not found in PATH"
  fi
  
  echo "Flatpak environment:"
  if available flatpak; then
    echo "- Flatpak version: $(flatpak --version)"
    echo "- Flatpak remotes:"
    flatpak remotes
    echo "- Installed runtimes:"
    flatpak list --runtime
  else
    echo "- Flatpak not found in PATH"
  fi
  
  echo "Build configuration:"
  echo "- APP_ONLY: $APP_ONLY"
  echo "- FLATPAK_ONLY: $FLATPAK_ONLY"
  echo "- DEV_MODE: $DEV_MODE"
  echo "- DEBUG: $DEBUG"
  echo "- FORCE_DOWNLOAD: $FORCE_DOWNLOAD"
}

# Function to check for and fix Node.js installation issues
check_nodejs_installation_issues() {
  print_section "Checking for Node.js Installation Issues"
  
  # Check specifically for Fedora with the sqlite3session_attach error
  if [ "$OS_NAME" = "fedora" ]; then
    # Try to run a simple Node.js command
    if ! node -e "console.log('Node.js test')" 2>/dev/null; then
      local error_output
      error_output=$(node -e "console.log('Node.js test')" 2>&1 || true)
      
      if echo "$error_output" | grep -q "symbol lookup error" && echo "$error_output" | grep -q "sqlite3session_attach"; then
        print_warning "Detected the 'sqlite3session_attach' symbol lookup error on Fedora."
        print_warning "This is a known issue with the Fedora Node.js package."
        print_warning ""
        print_warning "Would you like to install Node.js from the NodeSource repository to fix this issue?"
        print_warning "This will require sudo access and will modify your system packages."
        print_warning ""
        print_warning "Options:"
        print_warning "1. Install Node.js from NodeSource (recommended)"
        print_warning "2. Install Node Version Manager (nvm)"
        print_warning "3. Skip and continue anyway (build will likely fail)"
        print_warning ""
        
        # Ask for user input
        echo -n "Enter your choice (1-3): "
        read -r choice
        
        case "$choice" in
          1)
            print_warning "Installing Node.js from NodeSource repository..."
            if ! available curl; then
              print_error "curl is required to install Node.js from NodeSource. Please install curl first."
            fi
            
            # Install NodeSource repository and Node.js
            print_warning "Downloading NodeSource setup script..."
            if curl -fsSL https://rpm.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh; then
              print_warning "Running NodeSource setup script (requires sudo)..."
              if sudo bash /tmp/nodesource_setup.sh; then
                print_warning "Installing Node.js from NodeSource repository..."
                if sudo dnf install -y nodejs; then
                  print_success "Node.js from NodeSource repository installed successfully!"
                  # Verify installation
                  if node -e "console.log('Node.js test')" 2>/dev/null; then
                    print_success "Node.js is now working correctly!"
                  else
                    print_error "Node.js installation completed, but there are still issues. Please try option 2 (nvm) instead."
                  fi
                else
                  print_error "Failed to install Node.js from NodeSource repository."
                fi
              else
                print_error "Failed to run NodeSource setup script."
              fi
              rm -f /tmp/nodesource_setup.sh
            else
              print_error "Failed to download NodeSource setup script."
            fi
            ;;
          
          2)
            print_warning "Installing Node Version Manager (nvm)..."
            print_warning "Please follow the instructions at: https://github.com/nvm-sh/nvm#installing-and-updating"
            print_warning "After installing nvm, run:"
            print_warning "  nvm install 20"
            print_warning "  nvm use 20"
            print_warning "Then try running this script again."
            exit 0
            ;;
          
          3)
            print_warning "Skipping Node.js installation fix. Build will likely fail."
            ;;
          
          *)
            print_error "Invalid choice. Please run the script again and select a valid option (1-3)."
            ;;
        esac
      fi
    fi
  fi
}

# Main function
main() {
  print_section "Frigate Config GUI Build Script"
  
  # Detect OS and package manager
  detect_os
  
  # Print build mode
  echo "Build mode:"
  if [ "$DEV_MODE" = true ]; then
    echo "- Development mode"
  elif [ "$APP_ONLY" = true ]; then
    echo "- Building Electron app only"
  elif [ "$FLATPAK_ONLY" = true ]; then
    echo "- Building Flatpak package only"
  else
    echo "- Building both Electron app and Flatpak package"
  fi
  
  # Check required tools
  NEEDS=$(require curl grep sed)
  if [ -n "$NEEDS" ]; then
    print_error "The following tools are required but missing:$NEEDS"
  fi
  
  # Print debug information if requested
  if [ "$DEBUG" = "true" ]; then
    print_debug_info
  fi
  
  # Check for Node.js installation issues
  check_nodejs_installation_issues
  
  # Check prerequisites
  print_section "Checking Prerequisites"
  
  # Check Node.js and npm
  if ! check_node_version || ! check_npm; then
    print_warning "Missing required dependencies for building the app"
    
    # Try to install dependencies
    if [ -n "$PACKAGE_MANAGER" ]; then
      print_warning "Attempting to install dependencies..."
      install_dependencies
      
      # Check again after installation
      if ! check_node_version || ! check_npm; then
        print_error "Failed to install or configure Node.js $NODE_VERSION and npm. Please install them manually."
      fi
    else
      print_error "Please install Node.js $NODE_VERSION.x or later and npm manually."
    fi
  fi
  
  # Check Flatpak tools if needed
  if [ "$APP_ONLY" = false ] && [ "$DEV_MODE" = false ]; then
    if ! check_flatpak_tools; then
      print_warning "Missing required dependencies for building the Flatpak package"
      
      # Try to install dependencies
      if [ -n "$PACKAGE_MANAGER" ]; then
        print_warning "Attempting to install Flatpak dependencies..."
        install_dependencies
        
        # Check again after installation
        if ! check_flatpak_tools; then
          print_error "Failed to install Flatpak tools. Please install flatpak and flatpak-builder manually."
        fi
      else
        print_error "Please install flatpak and flatpak-builder manually."
      fi
    fi
    
    # Check Flatpak runtimes
    if ! check_flatpak_runtimes; then
      print_warning "Installing missing Flatpak runtimes..."
      install_flatpak_runtimes
    fi
  fi
  
  # Build or start development environment
  if [ "$DEV_MODE" = true ]; then
    start_dev_environment
  else
    # Build Electron app if requested
    if [ "$FLATPAK_ONLY" = false ]; then
      build_electron_app
    fi
    
    # Build Flatpak if requested
    if [ "$APP_ONLY" = false ]; then
      build_flatpak
    fi
    
    print_section "Build Complete"
    echo "Build artifacts:"
    
    if [ "$FLATPAK_ONLY" = false ]; then
      echo "- Electron app: $PROJECT_ROOT/electron-app/dist"
    fi
    
    if [ "$APP_ONLY" = false ]; then
      echo "- Flatpak bundle: $PROJECT_ROOT/frigate-config-gui.flatpak"
    fi
    
    print_success "All builds completed successfully!"
  fi
}

# Run the main function
main
#!/bin/bash
#
# Frigate Config GUI - Release Creation Script
#
# This script creates a new release tag and pushes it to GitHub,
# which will trigger the GitHub Actions workflow to build and release the Flatpak.
#
# Usage:
#   ./tools/create-release.sh [--dry-run]
#
# Options:
#   --dry-run    Show what would be done without actually creating a release
#

set -e

# Colors for output
red="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 1 || :) 2>&-)"
green="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 2 || :) 2>&-)"
yellow="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 3 || :) 2>&-)"
blue="$( (/usr/bin/tput bold || :; /usr/bin/tput setaf 4 || :) 2>&-)"
plain="$( (/usr/bin/tput sgr0 || :) 2>&-)"

# Parse arguments
DRY_RUN=false
for arg in "$@"; do
  case $arg in
    --dry-run)
      DRY_RUN=true
      ;;
    *)
      echo "${red}Unknown argument: $arg${plain}"
      echo "Usage: $0 [--dry-run]"
      exit 1
      ;;
  esac
done

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

# Check if we're in a git repository
if [ ! -d .git ]; then
  print_error "Not in a git repository. Please run this script from the root of the repository."
fi

# Check if the working directory is clean
if [ -n "$(git status --porcelain)" ]; then
  print_warning "Working directory is not clean. Uncommitted changes will not be included in the release."
  print_warning "Consider committing your changes before creating a release."
  echo ""
  echo "Git status:"
  git status --short
  echo ""
  
  read -p "Continue anyway? (y/N) " -n 1 -r
  echo ""
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Aborted by user."
  fi
fi

# Get the current version from package.json
VERSION=$(node -p "require('./package.json').version")
if [ -z "$VERSION" ]; then
  print_error "Could not determine version from package.json"
fi

# Check if this version already has a tag
if git tag | grep -q "v$VERSION"; then
  print_error "Tag v$VERSION already exists. Please update the version in package.json first."
fi

# Create release notes
RELEASE_NOTES=$(cat <<EOF
# Frigate Config GUI v$VERSION

## Changes in this release:

<!-- Add your release notes here -->

## Installation

### Flatpak
Download the Flatpak package and install it:
\`\`\`bash
flatpak install frigate-config-gui.flatpak
\`\`\`

### From Source
Clone the repository and build from source:
\`\`\`bash
git clone https://github.com/RyansOpenSauceRice/Frigate-Config-GUI.git
cd Frigate-Config-GUI
./tools/build-all.sh
\`\`\`
EOF
)

# Show what we're about to do
print_section "Release Information"
echo "Version: $VERSION"
echo "Tag: v$VERSION"
echo ""
echo "Release Notes:"
echo "-------------"
echo "$RELEASE_NOTES"
echo "-------------"
echo ""

if [ "$DRY_RUN" = true ]; then
  print_warning "DRY RUN: No changes will be made."
  print_success "Release preparation complete. Run without --dry-run to create the release."
  exit 0
fi

# Confirm with the user
read -p "Create this release? (y/N) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  print_error "Aborted by user."
fi

# Create and push the tag
print_section "Creating and pushing tag v$VERSION"
git tag -a "v$VERSION" -m "Release v$VERSION"
git push origin "v$VERSION"

print_success "Tag v$VERSION created and pushed to GitHub."
print_success "GitHub Actions will now build and release the Flatpak package."
print_warning "Check the Actions tab on GitHub to monitor the progress."
print_warning "https://github.com/RyansOpenSauceRice/Frigate-Config-GUI/actions"
const fs = require('fs');
const path = require('path');

// Get current date in CST
const now = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago' });
const cstDate = new Date(now);
const version = `${cstDate.getFullYear()}.${String(cstDate.getMonth() + 1).padStart(2, '0')}.${String(cstDate.getDate()).padStart(2, '0')}`;

// Update package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
packageJson.version = version;
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

// Update flatpak manifest
const flatpakManifestPath = path.join(__dirname, '..', 'flatpak', 'com.frigateNVR.ConfigGUI.yml');
const flatpakManifest = fs.readFileSync(flatpakManifestPath, 'utf8');
const updatedManifest = flatpakManifest.replace(/version: ["'].*["']/, `version: '${version}'`);
fs.writeFileSync(flatpakManifestPath, updatedManifest);

console.log(`Updated version to ${version}`);
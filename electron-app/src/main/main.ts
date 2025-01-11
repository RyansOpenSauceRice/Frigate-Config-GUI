import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { FrigateConfig, FrigateConfigSchema } from '../shared/types/config';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js')
    }
  });

  // In development, load from Vite dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for file operations
ipcMain.handle('import-config', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'YAML', extensions: ['yml', 'yaml'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (canceled || filePaths.length === 0) {
    return null;
  }

  try {
    const fileContent = fs.readFileSync(filePaths[0], 'utf8');
    const config = yaml.load(fileContent) as FrigateConfig;
    
    // Validate the config
    FrigateConfigSchema.parse(config);
    
    return config;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to load configuration: ${message}`);
  }
});

ipcMain.handle('export-config', async (_, config: FrigateConfig) => {
  try {
    // Validate the config before saving
    FrigateConfigSchema.parse(config);

    const { canceled, filePath } = await dialog.showSaveDialog({
      filters: [
        { name: 'YAML', extensions: ['yml'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (canceled || !filePath) {
      return false;
    }

    const yamlString = yaml.dump(config, {
      indent: 2,
      lineWidth: -1,
      noRefs: true
    });

    fs.writeFileSync(filePath, yamlString, 'utf8');
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to save configuration: ${message}`);
  }
});

ipcMain.handle('validate-config', (_, config: FrigateConfig) => {
  try {
    FrigateConfigSchema.parse(config);
    return { valid: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { valid: false, error: message };
  }
});
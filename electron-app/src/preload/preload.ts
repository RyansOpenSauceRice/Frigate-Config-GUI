import { contextBridge, ipcRenderer } from 'electron';
import type { FrigateConfig } from '../shared/types/config';

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electronAPI', {
    importConfig: () => ipcRenderer.invoke('import-config'),
    exportConfig: (config: FrigateConfig) => ipcRenderer.invoke('export-config', config),
    validateConfig: (config: FrigateConfig) => ipcRenderer.invoke('validate-config', config)
  }
);
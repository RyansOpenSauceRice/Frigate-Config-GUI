import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Container,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert
} from '@mui/material';
import { FrigateConfig } from '../shared/types/config';
import CameraConfig from './components/CameraConfig';
import MQTTConfig from './components/MQTTConfig';
import AudioConfig from './components/AudioConfig';

declare global {
  interface Window {
    electronAPI: {
      importConfig: () => Promise<FrigateConfig>;
      exportConfig: (config: FrigateConfig) => Promise<boolean>;
      validateConfig: (config: FrigateConfig) => Promise<{ valid: boolean; error?: string }>;
    };
  }
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function App() {
  const [tabValue, setTabValue] = useState(0);
  const [config, setConfig] = useState<FrigateConfig | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleImport = async () => {
    try {
      const importedConfig = await window.electronAPI.importConfig();
      if (importedConfig) {
        setConfig(importedConfig);
        setSnackbar({
          open: true,
          message: 'Configuration imported successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to import configuration: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error'
      });
    }
  };

  const handleExport = async () => {
    if (!config) {
      setSnackbar({
        open: true,
        message: 'No configuration to export',
        severity: 'error'
      });
      return;
    }

    try {
      const success = await window.electronAPI.exportConfig(config);
      if (success) {
        setSnackbar({
          open: true,
          message: 'Configuration exported successfully',
          severity: 'success'
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to export configuration: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error'
      });
    }
  };

  const handleValidate = async () => {
    if (!config) {
      setSnackbar({
        open: true,
        message: 'No configuration to validate',
        severity: 'error'
      });
      return;
    }

    try {
      const result = await window.electronAPI.validateConfig(config);
      setSnackbar({
        open: true,
        message: result.valid ? 'Configuration is valid' : `Invalid configuration: ${result.error}`,
        severity: result.valid ? 'success' : 'error'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Frigate Config GUI
          </Typography>
          <Button color="inherit" onClick={handleImport}>Import</Button>
          <Button color="inherit" onClick={handleExport}>Export</Button>
          <Button color="inherit" onClick={handleValidate}>Validate</Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Cameras" />
          <Tab label="MQTT" />
          <Tab label="Audio" />
        </Tabs>
      </Box>

      <Container maxWidth="lg" sx={{ flexGrow: 1, overflow: 'auto' }}>
        <TabPanel value={tabValue} index={0}>
          <CameraConfig
            config={config?.cameras}
            onChange={(cameras) => setConfig((prev: FrigateConfig | null) => prev ? { ...prev, cameras } : null)}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <MQTTConfig
            config={config?.mqtt}
            onChange={(mqtt) => setConfig((prev: FrigateConfig | null) => prev ? { ...prev, mqtt } : null)}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <AudioConfig
            config={config?.audio}
            onChange={(audio) => setConfig((prev: FrigateConfig | null) => prev ? { ...prev, audio } : null)}
          />
        </TabPanel>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
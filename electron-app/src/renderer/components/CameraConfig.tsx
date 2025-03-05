import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  TextField,
  Typography,
  List,
  ListItem
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import type { CameraConfig as ICameraConfig } from '../../shared/types/config';

interface Props {
  config?: Record<string, ICameraConfig>;
  onChange: (config: Record<string, ICameraConfig>) => void;
}

export default function CameraConfig({ config, onChange }: Props) {
  const [newCameraName, setNewCameraName] = useState('');

  const handleAddCamera = () => {
    if (!newCameraName.trim()) return;

    const newConfig = {
      ...config,
      [newCameraName]: {
        ffmpeg: {
          inputs: [{
            path: '',
            roles: ['detect']
          }]
        }
      }
    };

    onChange(newConfig);
    setNewCameraName('');
  };

  const handleDeleteCamera = (cameraName: string) => {
    if (!config) return;

    const newConfig = { ...config };
    delete newConfig[cameraName];
    onChange(newConfig);
  };

  const handleUpdateCamera = (cameraName: string, cameraConfig: ICameraConfig) => {
    if (!config) return;

    onChange({
      ...config,
      [cameraName]: cameraConfig
    });
  };

  const handleInputChange = (
    cameraName: string,
    inputIndex: number,
    field: keyof ICameraConfig['ffmpeg']['inputs'][0],
    value: string | string[]
  ) => {
    if (!config) return;

    const camera = config[cameraName];
    const newInputs = [...camera.ffmpeg.inputs];
    newInputs[inputIndex] = {
      ...newInputs[inputIndex],
      [field]: value
    };

    handleUpdateCamera(cameraName, {
      ...camera,
      ffmpeg: {
        ...camera.ffmpeg,
        inputs: newInputs
      }
    });
  };

  if (!config) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          No configuration loaded
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Import a configuration file or add a new camera to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
        <Grid item xs>
          <TextField
            fullWidth
            label="New Camera Name"
            value={newCameraName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCameraName(e.target.value)}
            placeholder="Enter camera name"
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddCamera}
            disabled={!newCameraName.trim()}
          >
            Add Camera
          </Button>
        </Grid>
      </Grid>

      <List>
        {Object.entries(config).map(([cameraName, cameraConfig]) => (
          <ListItem key={cameraName} disablePadding>
            <Card sx={{ width: '100%', mb: 2 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" component="div">
                        {cameraName}
                      </Typography>
                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() => handleDeleteCamera(cameraName)}
                        sx={{ ml: 'auto' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>

                  {cameraConfig.ffmpeg.inputs.map((input: ICameraConfig['ffmpeg']['inputs'][0], index: number) => (
                    <Grid item xs={12} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            Input {index + 1}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Path"
                                value={input.path}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(cameraName, index, 'path', e.target.value)}
                                placeholder="rtsp://username:password@camera-ip:554/stream"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Roles (comma-separated)"
                                value={input.roles.join(',')}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(cameraName, index, 'roles', e.target.value.split(',').map((r: string) => r.trim()))}
                                placeholder="detect, record"
                                helperText="Available roles: detect, record, rtmp"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
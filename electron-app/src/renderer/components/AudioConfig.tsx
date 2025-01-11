
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import type { AudioConfig as IAudioConfig } from '../../shared/types/config';

interface Props {
  config?: IAudioConfig;
  onChange: (config: IAudioConfig) => void;
}

export default function AudioConfig({ config, onChange }: Props) {
  const handleChange = (field: keyof IAudioConfig, value: boolean | string | number) => {
    if (!config) {
      onChange({
        enabled: field === 'enabled' ? value as boolean : false,
        [field]: value
      });
      return;
    }

    onChange({
      ...config,
      [field]: value
    });
  };

  const defaultConfig: IAudioConfig = config || {
    enabled: false,
    device: 'default',
    threshold: 0.5,
    duration: 3.0
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Audio Detection Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={defaultConfig.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                  />
                }
                label="Enable Audio Detection"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Device"
                value={defaultConfig.device || ''}
                onChange={(e) => handleChange('device', e.target.value)}
                placeholder="default"
                helperText="Audio input device (default: 'default')"
                disabled={!defaultConfig.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Threshold"
                value={defaultConfig.threshold || ''}
                onChange={(e) => handleChange('threshold', parseFloat(e.target.value))}
                inputProps={{
                  step: 0.1,
                  min: 0,
                  max: 1
                }}
                placeholder="0.5"
                helperText="Detection threshold (0-1)"
                disabled={!defaultConfig.enabled}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration"
                value={defaultConfig.duration || ''}
                onChange={(e) => handleChange('duration', parseFloat(e.target.value))}
                inputProps={{
                  step: 0.1,
                  min: 0
                }}
                placeholder="3.0"
                helperText="Minimum duration in seconds"
                disabled={!defaultConfig.enabled}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
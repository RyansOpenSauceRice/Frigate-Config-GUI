
import {
  Box,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import type { MQTTConfig as IMQTTConfig } from '../../shared/types/config';

interface Props {
  config?: IMQTTConfig;
  onChange: (config: IMQTTConfig) => void;
}

export default function MQTTConfig({ config, onChange }: Props) {
  const handleChange = (field: keyof IMQTTConfig, value: string | number) => {
    if (!config) {
      onChange({
        host: '',
        [field]: value
      });
      return;
    }

    onChange({
      ...config,
      [field]: value
    });
  };

  const defaultConfig: IMQTTConfig = config || {
    host: '',
    port: 1883,
    topic_prefix: 'frigate',
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            MQTT Configuration
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                label="Host"
                value={defaultConfig.host}
                onChange={(e) => handleChange('host', e.target.value)}
                placeholder="mqtt.local"
                helperText="MQTT broker hostname or IP address"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Port"
                value={defaultConfig.port || ''}
                onChange={(e) => handleChange('port', parseInt(e.target.value, 10))}
                placeholder="1883"
                helperText="MQTT broker port (default: 1883)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Username"
                value={defaultConfig.user || ''}
                onChange={(e) => handleChange('user', e.target.value)}
                helperText="MQTT username (optional)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="password"
                label="Password"
                value={defaultConfig.password || ''}
                onChange={(e) => handleChange('password', e.target.value)}
                helperText="MQTT password (optional)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Topic Prefix"
                value={defaultConfig.topic_prefix || ''}
                onChange={(e) => handleChange('topic_prefix', e.target.value)}
                placeholder="frigate"
                helperText="MQTT topic prefix (default: frigate)"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Client ID"
                value={defaultConfig.client_id || ''}
                onChange={(e) => handleChange('client_id', e.target.value)}
                helperText="MQTT client ID (optional)"
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
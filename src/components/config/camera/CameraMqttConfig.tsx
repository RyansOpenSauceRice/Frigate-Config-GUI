import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../../utils/tooltip';
import { OptionalSlider } from '../../common/OptionalSlider';
import { CameraMqttConfig as MqttConfig } from '../../../schemas/frigate';

interface CameraMqttConfigProps {
  config: MqttConfig;
  onChange: (config: MqttConfig) => void;
}

export const CameraMqttConfig: React.FC<CameraMqttConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('mqtt.title')}</h3>
        <Form.Field name="enabled">
          <div className="flex items-center space-x-2">
            <Form.Control asChild>
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => onChange({ ...config, enabled: e.target.checked })}
                className="rounded border-input"
              />
            </Form.Control>
            <Form.Label className="text-sm font-medium">
              {t('mqtt.enabled.label')}
            </Form.Label>
            <Tooltip content={t('mqtt.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Snapshot Settings */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Field name="timestamp">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.timestamp}
                    onChange={(e) =>
                      onChange({ ...config, timestamp: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('mqtt.timestamp.label')}
                </Form.Label>
                <Tooltip content={t('mqtt.timestamp.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>

            <Form.Field name="bounding_box">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.bounding_box}
                    onChange={(e) =>
                      onChange({ ...config, bounding_box: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('mqtt.bounding_box.label')}
                </Form.Label>
                <Tooltip content={t('mqtt.bounding_box.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>

            <Form.Field name="crop">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.crop}
                    onChange={(e) => onChange({ ...config, crop: e.target.checked })}
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('mqtt.crop.label')}
                </Form.Label>
                <Tooltip content={t('mqtt.crop.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>
          </div>

          {/* Height Setting */}
          <OptionalSlider
            value={config.height}
            onChange={(value) => onChange({ ...config, height: value })}
            defaultValue={270}
            min={100}
            max={720}
            step={10}
            label={t('mqtt.height.label')}
            tooltip={t('mqtt.height.tooltip')}
            valueFormatter={(value) => t('mqtt.height.value', { value })}
          />

          {/* Quality Setting */}
          <OptionalSlider
            value={config.quality}
            onChange={(value) => onChange({ ...config, quality: value })}
            defaultValue={70}
            min={1}
            max={100}
            step={1}
            label={t('mqtt.quality.label')}
            tooltip={t('mqtt.quality.tooltip')}
            valueFormatter={(value) => t('mqtt.quality.value', { value })}
          />

          {/* Required Zones */}
          <Form.Field name="required_zones">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('mqtt.required_zones.label')}
                </Form.Label>
                <Tooltip content={t('mqtt.required_zones.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Form.Control asChild>
                <input
                  type="text"
                  value={(config.required_zones || []).join(',')}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      required_zones: e.target.value ? e.target.value.split(',') : [],
                    })
                  }
                  placeholder={t('mqtt.required_zones.placeholder')}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </Form.Control>
            </div>
          </Form.Field>
        </div>
      )}
    </div>
  );
};
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../../utils/tooltip';
import { AudioConfig } from '../../../schemas/frigate';
import { OptionalSlider } from '../../common/OptionalSlider';

interface CameraAudioConfigProps {
  config: AudioConfig;
  onChange: (config: AudioConfig) => void;
}

export const CameraAudioConfig: React.FC<CameraAudioConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  const handleListenChange = (type: string, checked: boolean) => {
    const listen = new Set(config.listen || []);
    if (checked) {
      listen.add(type);
    } else {
      listen.delete(type);
    }
    onChange({ ...config, listen: Array.from(listen) });
  };

  const handleFilterThresholdChange = (type: string, threshold: number | undefined) => {
    const filters = { ...config.filters };
    if (threshold === undefined) {
      delete filters[type];
      if (Object.keys(filters).length === 0) {
        onChange({ ...config, filters: undefined });
        return;
      }
    } else {
      filters[type] = { threshold };
    }
    onChange({ ...config, filters });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('audio.title')}</h3>
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
              {t('audio.enabled.label')}
            </Form.Label>
            <Tooltip content={t('audio.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Volume Threshold */}
          <OptionalSlider
            value={config.min_volume}
            onChange={(value) => onChange({ ...config, min_volume: value })}
            defaultValue={500}
            min={100}
            max={2000}
            step={100}
            label={t('audio.min_volume.label')}
            tooltip={t('audio.min_volume.tooltip')}
            valueFormatter={(value) => t('audio.min_volume.value', { value })}
          />

          {/* Max Not Heard */}
          <OptionalSlider
            value={config.max_not_heard}
            onChange={(value) => onChange({ ...config, max_not_heard: value })}
            defaultValue={30}
            min={5}
            max={120}
            step={5}
            label={t('audio.max_not_heard.label')}
            tooltip={t('audio.max_not_heard.tooltip')}
            valueFormatter={(value) => t('audio.max_not_heard.value', { value })}
          />

          {/* Audio Types */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('audio.listen.label')}
              </label>
              <Tooltip content={t('audio.listen.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {['bark', 'fire_alarm', 'scream', 'speech', 'yell'].map((type) => (
                <div key={type} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={config.listen?.includes(type) ?? false}
                      onChange={(e) => handleListenChange(type, e.target.checked)}
                      className="rounded border-input"
                    />
                    <label className="text-sm">{t(`audio.listen.types.${type}`)}</label>
                  </div>
                  {config.listen?.includes(type) && (
                    <OptionalSlider
                      value={config.filters?.[type]?.threshold}
                      onChange={(value) => handleFilterThresholdChange(type, value)}
                      defaultValue={0.8}
                      min={0.1}
                      max={1.0}
                      step={0.1}
                      label={t('audio.filters.threshold.label')}
                      tooltip={t('audio.filters.threshold.tooltip')}
                      valueFormatter={(value) =>
                        t('audio.filters.threshold.value', { value })
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
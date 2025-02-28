import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Slider from '@radix-ui/react-slider';
import { Tooltip } from '../../../utils/tooltip';
import { DetectConfig } from '../../../schemas/frigate';

interface CameraDetectConfigProps {
  config: DetectConfig;
  onChange: (config: DetectConfig) => void;
}

export const CameraDetectConfig: React.FC<CameraDetectConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('detect.title')}</h3>
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
              {t('detect.enabled.label')}
            </Form.Label>
            <Tooltip content={t('detect.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Resolution Settings */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Field name="width">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('detect.width.label')}
                  </Form.Label>
                  <Tooltip content={t('detect.width.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    value={config.width || ''}
                    onChange={(e) =>
                      onChange({ ...config, width: parseInt(e.target.value) || undefined })
                    }
                    placeholder={t('detect.width.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="height">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('detect.height.label')}
                  </Form.Label>
                  <Tooltip content={t('detect.height.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    value={config.height || ''}
                    onChange={(e) =>
                      onChange({ ...config, height: parseInt(e.target.value) || undefined })
                    }
                    placeholder={t('detect.height.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>
          </div>

          {/* FPS Setting */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">{t('detect.fps.label')}</label>
              <Tooltip content={t('detect.fps.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={[config.fps]}
              onValueChange={([value]) => onChange({ ...config, fps: value })}
              max={30}
              min={1}
              step={1}
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
                <Slider.Range className="absolute h-full rounded-full bg-primary" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="FPS"
              />
            </Slider.Root>
            <div className="text-sm text-muted-foreground">
              {t('detect.fps.value', { value: config.fps })}
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">{t('detect.advanced.title')}</h4>

            <Form.Field name="min_initialized">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('detect.min_initialized.label')}
                  </Form.Label>
                  <Tooltip content={t('detect.min_initialized.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    value={config.min_initialized || ''}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        min_initialized: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder={t('detect.min_initialized.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
                <p className="text-xs text-muted-foreground">
                  {t('detect.min_initialized.description')}
                </p>
              </div>
            </Form.Field>

            <Form.Field name="max_disappeared">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('detect.max_disappeared.label')}
                  </Form.Label>
                  <Tooltip content={t('detect.max_disappeared.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    value={config.max_disappeared || ''}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        max_disappeared: parseInt(e.target.value) || undefined,
                      })
                    }
                    placeholder={t('detect.max_disappeared.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
                <p className="text-xs text-muted-foreground">
                  {t('detect.max_disappeared.description')}
                </p>
              </div>
            </Form.Field>
          </div>
        </div>
      )}
    </div>
  );
};
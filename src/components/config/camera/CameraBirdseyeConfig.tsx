import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Tooltip } from '../../../utils/tooltip';
import { OptionalSlider } from '../../common/OptionalSlider';
import { BirdseyeConfig } from '../../../schemas/frigate';
import { ChevronDown } from 'lucide-react';

interface CameraBirdseyeConfigProps {
  config: BirdseyeConfig;
  onChange: (config: BirdseyeConfig) => void;
}

export const CameraBirdseyeConfig: React.FC<CameraBirdseyeConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('birdseye.title')}</h3>
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
              {t('birdseye.enabled.label')}
            </Form.Label>
            <Tooltip content={t('birdseye.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Restream Option */}
          <Form.Field name="restream">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.restream}
                  onChange={(e) => onChange({ ...config, restream: e.target.checked })}
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('birdseye.restream.label')}
              </Form.Label>
              <Tooltip content={t('birdseye.restream.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>

          {/* Resolution Settings */}
          <div className="grid grid-cols-2 gap-4">
            <OptionalSlider
              value={config.width}
              onChange={(value) => onChange({ ...config, width: value })}
              defaultValue={1280}
              min={640}
              max={3840}
              step={160}
              label={t('birdseye.width.label')}
              tooltip={t('birdseye.width.tooltip')}
              valueFormatter={(value) => t('birdseye.width.value', { value })}
            />

            <OptionalSlider
              value={config.height}
              onChange={(value) => onChange({ ...config, height: value })}
              defaultValue={720}
              min={360}
              max={2160}
              step={90}
              label={t('birdseye.height.label')}
              tooltip={t('birdseye.height.tooltip')}
              valueFormatter={(value) => t('birdseye.height.value', { value })}
            />
          </div>

          {/* Quality Setting */}
          <OptionalSlider
            value={config.quality}
            onChange={(value) => onChange({ ...config, quality: value })}
            defaultValue={8}
            min={1}
            max={31}
            step={1}
            label={t('birdseye.quality.label')}
            tooltip={t('birdseye.quality.tooltip')}
            valueFormatter={(value) => t('birdseye.quality.value', { value })}
          />

          {/* Mode Selection */}
          <Form.Field name="mode">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('birdseye.mode.label')}
                </Form.Label>
                <Tooltip content={t('birdseye.mode.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Select.Root
                value={config.mode || 'objects'}
                onValueChange={(value) =>
                  onChange({ ...config, mode: value as 'objects' | 'motion' | 'continuous' })
                }
              >
                <Select.Trigger className="w-full px-3 py-2 border rounded-md bg-background flex items-center justify-between">
                  <Select.Value />
                  <Select.Icon>
                    <ChevronDown className="w-4 h-4" />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-popover text-popover-foreground border rounded-md shadow-md">
                    <Select.Viewport>
                      <Select.Item
                        value="objects"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('birdseye.mode.options.objects')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="motion"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('birdseye.mode.options.motion')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="continuous"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('birdseye.mode.options.continuous')}
                        </Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </Form.Field>

          {/* Inactivity Threshold */}
          <OptionalSlider
            value={config.inactivity_threshold}
            onChange={(value) => onChange({ ...config, inactivity_threshold: value })}
            defaultValue={30}
            min={5}
            max={300}
            step={5}
            label={t('birdseye.inactivity_threshold.label')}
            tooltip={t('birdseye.inactivity_threshold.tooltip')}
            valueFormatter={(value) =>
              t('birdseye.inactivity_threshold.value', { value })
            }
          />

          {/* Layout Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">{t('birdseye.layout.title')}</h4>

            <OptionalSlider
              value={config.layout?.scaling_factor}
              onChange={(value) =>
                onChange({
                  ...config,
                  layout: { ...config.layout, scaling_factor: value },
                })
              }
              defaultValue={2.0}
              min={1.0}
              max={5.0}
              step={0.1}
              label={t('birdseye.layout.scaling_factor.label')}
              tooltip={t('birdseye.layout.scaling_factor.tooltip')}
              valueFormatter={(value) =>
                t('birdseye.layout.scaling_factor.value', { value })
              }
            />

            <Form.Field name="max_cameras">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('birdseye.layout.max_cameras.label')}
                  </Form.Label>
                  <Tooltip content={t('birdseye.layout.max_cameras.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    min={1}
                    value={config.layout?.max_cameras || ''}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        layout: {
                          ...config.layout,
                          max_cameras: parseInt(e.target.value) || undefined,
                        },
                      })
                    }
                    placeholder={t('birdseye.layout.max_cameras.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>
          </div>
        </div>
      )}
    </div>
  );
};
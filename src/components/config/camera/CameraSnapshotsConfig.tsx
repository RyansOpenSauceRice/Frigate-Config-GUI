import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Slider from '@radix-ui/react-slider';
import { Tooltip } from '../../../utils/tooltip';
import { SnapshotsConfig } from '../../../schemas/frigate';

interface CameraSnapshotsConfigProps {
  config: SnapshotsConfig;
  onChange: (config: SnapshotsConfig) => void;
}

export const CameraSnapshotsConfig: React.FC<CameraSnapshotsConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('snapshots.title')}</h3>
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
              {t('snapshots.enabled.label')}
            </Form.Label>
            <Tooltip content={t('snapshots.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Basic Settings */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Field name="clean_copy">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.clean_copy}
                    onChange={(e) =>
                      onChange({ ...config, clean_copy: e.target.checked })
                    }
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('snapshots.clean_copy.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.clean_copy.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>

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
                  {t('snapshots.timestamp.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.timestamp.tooltip')}>
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
                  {t('snapshots.bounding_box.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.bounding_box.tooltip')}>
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
                  {t('snapshots.crop.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.crop.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>
          </div>

          {/* Height Setting */}
          <Form.Field name="height">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('snapshots.height.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.height.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Form.Control asChild>
                <input
                  type="number"
                  value={config.height || ''}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      height: parseInt(e.target.value) || undefined,
                    })
                  }
                  placeholder={t('snapshots.height.placeholder')}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                />
              </Form.Control>
            </div>
          </Form.Field>

          {/* Quality Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('snapshots.quality.label')}
              </label>
              <Tooltip content={t('snapshots.quality.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={[config.quality]}
              onValueChange={([value]) => onChange({ ...config, quality: value })}
              max={100}
              min={1}
              step={1}
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
                <Slider.Range className="absolute h-full rounded-full bg-primary" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Quality"
              />
            </Slider.Root>
            <div className="text-sm text-muted-foreground">
              {t('snapshots.quality.value', { value: config.quality })}
            </div>
          </div>

          {/* Retention Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">{t('snapshots.retain.title')}</h4>

            <Form.Field name="retain_default">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('snapshots.retain.default.label')}
                  </Form.Label>
                  <Tooltip content={t('snapshots.retain.default.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    min={0}
                    value={config.retain?.default || 0}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        retain: {
                          ...config.retain,
                          default: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="retain_objects">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('snapshots.retain.objects.label')}
                  </Form.Label>
                  <Tooltip content={t('snapshots.retain.objects.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(config.retain?.objects || {}).map(([object, days]) => (
                    <div key={object} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={object}
                        onChange={(e) => {
                          const newObjects = { ...config.retain?.objects };
                          delete newObjects[object];
                          newObjects[e.target.value] = days;
                          onChange({
                            ...config,
                            retain: {
                              ...config.retain,
                              objects: newObjects,
                            },
                          });
                        }}
                        className="w-1/2 px-3 py-2 border rounded-md bg-background"
                        placeholder={t('snapshots.retain.objects.object_placeholder')}
                      />
                      <input
                        type="number"
                        min={0}
                        value={days}
                        onChange={(e) => {
                          onChange({
                            ...config,
                            retain: {
                              ...config.retain,
                              objects: {
                                ...config.retain?.objects,
                                [object]: parseInt(e.target.value),
                              },
                            },
                          });
                        }}
                        className="w-1/2 px-3 py-2 border rounded-md bg-background"
                        placeholder={t('snapshots.retain.objects.days_placeholder')}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const objects = config.retain?.objects || {};
                      onChange({
                        ...config,
                        retain: {
                          ...config.retain,
                          objects: {
                            ...objects,
                            '': 0,
                          },
                        },
                      });
                    }}
                    className="col-span-2 px-4 py-2 text-sm border rounded-md hover:bg-accent"
                  >
                    {t('snapshots.retain.objects.add')}
                  </button>
                </div>
              </div>
            </Form.Field>
          </div>

          {/* Required Zones */}
          <Form.Field name="required_zones">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('snapshots.required_zones.label')}
                </Form.Label>
                <Tooltip content={t('snapshots.required_zones.tooltip')}>
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
                  placeholder={t('snapshots.required_zones.placeholder')}
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
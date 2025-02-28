import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Tooltip } from '../../../utils/tooltip';
import { RecordConfig } from '../../../schemas/frigate';
import { ChevronDown } from 'lucide-react';

interface CameraRecordConfigProps {
  config: RecordConfig;
  onChange: (config: RecordConfig) => void;
}

export const CameraRecordConfig: React.FC<CameraRecordConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('record.title')}</h3>
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
              {t('record.enabled.label')}
            </Form.Label>
            <Tooltip content={t('record.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Retention Settings */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">{t('record.retain.title')}</h4>

            <Form.Field name="retain_days">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('record.retain.days.label')}
                  </Form.Label>
                  <Tooltip content={t('record.retain.days.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="number"
                    min={0}
                    value={config.retain?.days || 0}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        retain: {
                          ...config.retain,
                          days: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="retain_mode">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('record.retain.mode.label')}
                  </Form.Label>
                  <Tooltip content={t('record.retain.mode.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Select.Root
                  value={config.retain?.mode || 'all'}
                  onValueChange={(value) =>
                    onChange({
                      ...config,
                      retain: {
                        ...config.retain,
                        mode: value as 'all' | 'motion' | 'active_objects',
                      },
                    })
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
                          value="all"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>{t('record.retain.mode.all')}</Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="motion"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>
                            {t('record.retain.mode.motion')}
                          </Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="active_objects"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>
                            {t('record.retain.mode.active_objects')}
                          </Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </Form.Field>
          </div>

          {/* Events Settings */}
          <div className="space-y-4 pt-4 border-t">
            <h4 className="text-sm font-medium">{t('record.events.title')}</h4>

            <div className="grid grid-cols-2 gap-4">
              <Form.Field name="pre_capture">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Form.Label className="text-sm font-medium">
                      {t('record.events.pre_capture.label')}
                    </Form.Label>
                    <Tooltip content={t('record.events.pre_capture.tooltip')}>
                      <div className="text-muted-foreground">ⓘ</div>
                    </Tooltip>
                  </div>
                  <Form.Control asChild>
                    <input
                      type="number"
                      min={0}
                      value={config.events?.pre_capture || 0}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          events: {
                            ...config.events,
                            pre_capture: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    />
                  </Form.Control>
                </div>
              </Form.Field>

              <Form.Field name="post_capture">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Form.Label className="text-sm font-medium">
                      {t('record.events.post_capture.label')}
                    </Form.Label>
                    <Tooltip content={t('record.events.post_capture.tooltip')}>
                      <div className="text-muted-foreground">ⓘ</div>
                    </Tooltip>
                  </div>
                  <Form.Control asChild>
                    <input
                      type="number"
                      min={0}
                      value={config.events?.post_capture || 0}
                      onChange={(e) =>
                        onChange({
                          ...config,
                          events: {
                            ...config.events,
                            post_capture: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md bg-background"
                    />
                  </Form.Control>
                </div>
              </Form.Field>
            </div>

            <Form.Field name="required_zones">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('record.events.required_zones.label')}
                  </Form.Label>
                  <Tooltip content={t('record.events.required_zones.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={(config.events?.required_zones || []).join(',')}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        events: {
                          ...config.events,
                          required_zones: e.target.value
                            ? e.target.value.split(',')
                            : [],
                        },
                      })
                    }
                    placeholder={t('record.events.required_zones.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <Form.Field name="objects">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('record.events.objects.label')}
                  </Form.Label>
                  <Tooltip content={t('record.events.objects.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={(config.events?.objects || []).join(',')}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        events: {
                          ...config.events,
                          objects: e.target.value ? e.target.value.split(',') : [],
                        },
                      })
                    }
                    placeholder={t('record.events.objects.placeholder')}
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
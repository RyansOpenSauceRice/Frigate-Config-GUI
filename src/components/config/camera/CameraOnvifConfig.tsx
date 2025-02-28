import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Tooltip } from '../../../utils/tooltip';
import { OptionalSlider } from '../../common/OptionalSlider';
import { OnvifConfig } from '../../../schemas/frigate';
import { ChevronDown } from 'lucide-react';

interface CameraOnvifConfigProps {
  config: OnvifConfig;
  onChange: (config: OnvifConfig) => void;
  availableZones: string[];
}

export const CameraOnvifConfig: React.FC<CameraOnvifConfigProps> = ({
  config,
  onChange,
  availableZones,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('onvif.title')}</h3>
        <Tooltip content={t('onvif.info')}>
          <div className="text-muted-foreground">ⓘ</div>
        </Tooltip>
      </div>

      {/* Connection Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium">{t('onvif.connection.title')}</h4>

        <Form.Field name="host">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.host.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.host.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                value={config.host || ''}
                onChange={(e) => onChange({ ...config, host: e.target.value })}
                placeholder={t('onvif.connection.host.placeholder')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="port">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.port.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.port.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="number"
                value={config.port || ''}
                onChange={(e) =>
                  onChange({ ...config, port: parseInt(e.target.value) || undefined })
                }
                placeholder={t('onvif.connection.port.placeholder')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="user">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.user.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.user.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                value={config.user || ''}
                onChange={(e) => onChange({ ...config, user: e.target.value })}
                placeholder={t('onvif.connection.user.placeholder')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
          </div>
        </Form.Field>

        <Form.Field name="password">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.password.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.password.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="password"
                value={config.password || ''}
                onChange={(e) => onChange({ ...config, password: e.target.value })}
                placeholder={t('onvif.connection.password.placeholder')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
          </div>
        </Form.Field>

        <div className="grid grid-cols-2 gap-4">
          <Form.Field name="tls_insecure">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.tls_insecure}
                  onChange={(e) =>
                    onChange({ ...config, tls_insecure: e.target.checked })
                  }
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.tls_insecure.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.tls_insecure.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>

          <Form.Field name="ignore_time_mismatch">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.ignore_time_mismatch}
                  onChange={(e) =>
                    onChange({ ...config, ignore_time_mismatch: e.target.checked })
                  }
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('onvif.connection.ignore_time_mismatch.label')}
              </Form.Label>
              <Tooltip content={t('onvif.connection.ignore_time_mismatch.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>
        </div>
      </div>

      {/* Autotracking Settings */}
      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">{t('onvif.autotracking.title')}</h4>
          <Form.Field name="autotracking.enabled">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.autotracking?.enabled}
                  onChange={(e) =>
                    onChange({
                      ...config,
                      autotracking: {
                        ...config.autotracking,
                        enabled: e.target.checked,
                      },
                    })
                  }
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('onvif.autotracking.enabled.label')}
              </Form.Label>
              <Tooltip content={t('onvif.autotracking.enabled.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>
        </div>

        {config.autotracking?.enabled && (
          <div className="space-y-4">
            <Form.Field name="autotracking.calibrate_on_startup">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.autotracking?.calibrate_on_startup}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        autotracking: {
                          ...config.autotracking,
                          calibrate_on_startup: e.target.checked,
                        },
                      })
                    }
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('onvif.autotracking.calibrate_on_startup.label')}
                </Form.Label>
                <Tooltip content={t('onvif.autotracking.calibrate_on_startup.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>

            <Form.Field name="autotracking.zooming">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('onvif.autotracking.zooming.label')}
                  </Form.Label>
                  <Tooltip content={t('onvif.autotracking.zooming.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Select.Root
                  value={config.autotracking?.zooming || 'disabled'}
                  onValueChange={(value) =>
                    onChange({
                      ...config,
                      autotracking: {
                        ...config.autotracking,
                        zooming: value as 'disabled' | 'absolute' | 'relative',
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
                          value="disabled"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>
                            {t('onvif.autotracking.zooming.options.disabled')}
                          </Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="absolute"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>
                            {t('onvif.autotracking.zooming.options.absolute')}
                          </Select.ItemText>
                        </Select.Item>
                        <Select.Item
                          value="relative"
                          className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                        >
                          <Select.ItemText>
                            {t('onvif.autotracking.zooming.options.relative')}
                          </Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>
            </Form.Field>

            <OptionalSlider
              value={config.autotracking?.zoom_factor}
              onChange={(value) =>
                onChange({
                  ...config,
                  autotracking: {
                    ...config.autotracking,
                    zoom_factor: value,
                  },
                })
              }
              defaultValue={0.3}
              min={0.1}
              max={0.75}
              step={0.05}
              label={t('onvif.autotracking.zoom_factor.label')}
              tooltip={t('onvif.autotracking.zoom_factor.tooltip')}
              valueFormatter={(value) =>
                t('onvif.autotracking.zoom_factor.value', { value })
              }
            />

            <Form.Field name="autotracking.required_zones">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('onvif.autotracking.required_zones.label')}
                  </Form.Label>
                  <Tooltip content={t('onvif.autotracking.required_zones.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={(config.autotracking?.required_zones || []).join(',')}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        autotracking: {
                          ...config.autotracking,
                          required_zones: e.target.value ? e.target.value.split(',') : [],
                        },
                      })
                    }
                    placeholder={t('onvif.autotracking.required_zones.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
                <div className="text-xs text-muted-foreground">
                  {t('onvif.autotracking.required_zones.available')}: {availableZones.join(', ')}
                </div>
              </div>
            </Form.Field>

            <Form.Field name="autotracking.return_preset">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('onvif.autotracking.return_preset.label')}
                  </Form.Label>
                  <Tooltip content={t('onvif.autotracking.return_preset.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={config.autotracking?.return_preset || ''}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        autotracking: {
                          ...config.autotracking,
                          return_preset: e.target.value,
                        },
                      })
                    }
                    placeholder={t('onvif.autotracking.return_preset.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>

            <OptionalSlider
              value={config.autotracking?.timeout}
              onChange={(value) =>
                onChange({
                  ...config,
                  autotracking: {
                    ...config.autotracking,
                    timeout: value,
                  },
                })
              }
              defaultValue={10}
              min={1}
              max={60}
              step={1}
              label={t('onvif.autotracking.timeout.label')}
              tooltip={t('onvif.autotracking.timeout.tooltip')}
              valueFormatter={(value) =>
                t('onvif.autotracking.timeout.value', { value })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
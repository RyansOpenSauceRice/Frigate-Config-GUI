import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Tabs from '@radix-ui/react-tabs';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../../utils/tooltip';
import { CameraConfigType } from '../../../schemas/frigate';
import { CameraFFmpegConfig } from './CameraFFmpegConfig';
import { CameraDetectConfig } from './CameraDetectConfig';
import { CameraMotionConfig } from './CameraMotionConfig';
import { CameraZonesConfig } from './CameraZonesConfig';
import { CameraRecordConfig } from './CameraRecordConfig';
import { CameraSnapshotsConfig } from './CameraSnapshotsConfig';

interface CameraConfigProps {
  config: CameraConfigType;
  onChange: (config: CameraConfigType) => void;
}

export const CameraConfig: React.FC<CameraConfigProps> = ({ config, onChange }) => {
  const { t } = useTranslation('common');

  const handleChange = <K extends keyof CameraConfigType>(
    key: K,
    value: CameraConfigType[K]
  ) => {
    onChange({
      ...config,
      [key]: value,
    });
  };

  return (
    <div className="p-6">
      <Form.Root>
        <div className="space-y-4">
          {/* Basic Settings */}
          <div className="space-y-2">
            <Form.Field name="name">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('camera.fields.name.label')}
                </Form.Label>
                <Tooltip content={t('camera.fields.name.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  type="text"
                  value={config.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder={t('camera.fields.name.placeholder')}
                />
              </Form.Control>
            </Form.Field>

            <Form.Field name="enabled">
              <div className="flex items-center space-x-2">
                <Form.Control asChild>
                  <input
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                    className="rounded border-input"
                  />
                </Form.Control>
                <Form.Label className="text-sm font-medium">
                  {t('camera.fields.enabled.label')}
                </Form.Label>
                <Tooltip content={t('camera.fields.enabled.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
            </Form.Field>
          </div>

          {/* Configuration Tabs */}
          <Tabs.Root defaultValue="ffmpeg" className="mt-6">
            <Tabs.List className="flex border-b">
              <Tabs.Trigger
                value="ffmpeg"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.ffmpeg')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="detect"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.detect')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="motion"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.motion')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="zones"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.zones')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="record"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.record')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="snapshots"
                className="px-4 py-2 -mb-px text-sm border-b-2 border-transparent data-[state=active]:border-primary"
              >
                {t('camera.tabs.snapshots')}
              </Tabs.Trigger>
            </Tabs.List>

            <div className="p-4">
              <Tabs.Content value="ffmpeg">
                <CameraFFmpegConfig
                  config={config.ffmpeg}
                  onChange={(value) => handleChange('ffmpeg', value)}
                />
              </Tabs.Content>

              <Tabs.Content value="detect">
                <CameraDetectConfig
                  config={config.detect}
                  onChange={(value) => handleChange('detect', value)}
                />
              </Tabs.Content>

              <Tabs.Content value="motion">
                <CameraMotionConfig
                  config={config.motion}
                  onChange={(value) => handleChange('motion', value)}
                />
              </Tabs.Content>

              <Tabs.Content value="zones">
                <CameraZonesConfig
                  config={config.zones}
                  onChange={(value) => handleChange('zones', value)}
                />
              </Tabs.Content>

              <Tabs.Content value="record">
                <CameraRecordConfig
                  config={config.record}
                  onChange={(value) => handleChange('record', value)}
                />
              </Tabs.Content>

              <Tabs.Content value="snapshots">
                <CameraSnapshotsConfig
                  config={config.snapshots}
                  onChange={(value) => handleChange('snapshots', value)}
                />
              </Tabs.Content>
            </div>
          </Tabs.Root>
        </div>
      </Form.Root>
    </div>
  );
};
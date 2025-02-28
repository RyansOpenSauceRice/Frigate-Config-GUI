import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Tooltip } from '../../../utils/tooltip';
import { GenAIConfig } from '../../../schemas/frigate';
import { ChevronDown } from 'lucide-react';

interface CameraGenAIConfigProps {
  config: GenAIConfig;
  onChange: (config: GenAIConfig) => void;
  availableObjects: string[];
  availableZones: string[];
}

export const CameraGenAIConfig: React.FC<CameraGenAIConfigProps> = ({
  config,
  onChange,
  availableObjects,
  availableZones,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('genai.title')}</h3>
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
              {t('genai.enabled.label')}
            </Form.Label>
            <Tooltip content={t('genai.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Provider Selection */}
          <Form.Field name="provider">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('genai.provider.label')}
                </Form.Label>
                <Tooltip content={t('genai.provider.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Select.Root
                value={config.provider || 'ollama'}
                onValueChange={(value) =>
                  onChange({
                    ...config,
                    provider: value as 'ollama' | 'gemini' | 'openai',
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
                        value="ollama"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('genai.provider.options.ollama')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="gemini"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('genai.provider.options.gemini')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="openai"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('genai.provider.options.openai')}
                        </Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </Form.Field>

          {/* API Settings */}
          {config.provider !== 'ollama' && (
            <Form.Field name="api_key">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('genai.api_key.label')}
                  </Form.Label>
                  <Tooltip content={t('genai.api_key.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="password"
                    value={config.api_key || ''}
                    onChange={(e) => onChange({ ...config, api_key: e.target.value })}
                    placeholder={t('genai.api_key.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>
          )}

          {config.provider === 'ollama' && (
            <Form.Field name="base_url">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('genai.base_url.label')}
                  </Form.Label>
                  <Tooltip content={t('genai.base_url.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={config.base_url || ''}
                    onChange={(e) => onChange({ ...config, base_url: e.target.value })}
                    placeholder={t('genai.base_url.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
              </div>
            </Form.Field>
          )}

          {/* Prompt Settings */}
          <Form.Field name="prompt">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('genai.prompt.label')}
                </Form.Label>
                <Tooltip content={t('genai.prompt.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Form.Control asChild>
                <textarea
                  value={config.prompt || ''}
                  onChange={(e) => onChange({ ...config, prompt: e.target.value })}
                  placeholder={t('genai.prompt.placeholder')}
                  className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                />
              </Form.Control>
              <div className="text-xs text-muted-foreground">
                {t('genai.prompt.variables')}: {'{label}, {sub_label}, {camera}'}
              </div>
            </div>
          </Form.Field>

          {/* Object-Specific Prompts */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {t('genai.object_prompts.title')}
              </h4>
              <Tooltip content={t('genai.object_prompts.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(config.object_prompts || {}).map(([object, prompt]) => (
                <div key={object} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <select
                      value={object}
                      onChange={(e) => {
                        const newPrompts = { ...config.object_prompts };
                        delete newPrompts[object];
                        newPrompts[e.target.value] = prompt;
                        onChange({
                          ...config,
                          object_prompts: newPrompts,
                        });
                      }}
                      className="w-1/3 px-3 py-2 border rounded-md bg-background"
                    >
                      {availableObjects.map((obj) => (
                        <option key={obj} value={obj}>
                          {obj}
                        </option>
                      ))}
                    </select>
                    <textarea
                      value={prompt}
                      onChange={(e) => {
                        onChange({
                          ...config,
                          object_prompts: {
                            ...config.object_prompts,
                            [object]: e.target.value,
                          },
                        });
                      }}
                      placeholder={t('genai.object_prompts.placeholder')}
                      className="w-2/3 px-3 py-2 border rounded-md bg-background"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const object = availableObjects[0];
                  onChange({
                    ...config,
                    object_prompts: {
                      ...config.object_prompts,
                      [object]: '',
                    },
                  });
                }}
                className="px-4 py-2 text-sm border rounded-md hover:bg-accent"
              >
                {t('genai.object_prompts.add')}
              </button>
            </div>
          </div>

          {/* Objects and Zones */}
          <div className="grid grid-cols-2 gap-4">
            <Form.Field name="objects">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('genai.objects.label')}
                  </Form.Label>
                  <Tooltip content={t('genai.objects.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    type="text"
                    value={(config.objects || []).join(',')}
                    onChange={(e) =>
                      onChange({
                        ...config,
                        objects: e.target.value ? e.target.value.split(',') : [],
                      })
                    }
                    placeholder={t('genai.objects.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
                <div className="text-xs text-muted-foreground">
                  {t('genai.objects.available')}: {availableObjects.join(', ')}
                </div>
              </div>
            </Form.Field>

            <Form.Field name="required_zones">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('genai.required_zones.label')}
                  </Form.Label>
                  <Tooltip content={t('genai.required_zones.tooltip')}>
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
                    placeholder={t('genai.required_zones.placeholder')}
                    className="w-full px-3 py-2 border rounded-md bg-background"
                  />
                </Form.Control>
                <div className="text-xs text-muted-foreground">
                  {t('genai.required_zones.available')}: {availableZones.join(', ')}
                </div>
              </div>
            </Form.Field>
          </div>

          {/* Debug Options */}
          <Form.Field name="debug_save_thumbnails">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.debug_save_thumbnails}
                  onChange={(e) =>
                    onChange({ ...config, debug_save_thumbnails: e.target.checked })
                  }
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('genai.debug_save_thumbnails.label')}
              </Form.Label>
              <Tooltip content={t('genai.debug_save_thumbnails.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>
        </div>
      )}
    </div>
  );
};
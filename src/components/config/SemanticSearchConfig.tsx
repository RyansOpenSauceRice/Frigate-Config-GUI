import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { Tooltip } from '../../utils/tooltip';
import { SemanticSearchConfig } from '../../schemas/frigate';
import { ChevronDown } from 'lucide-react';

interface SemanticSearchConfigProps {
  config: SemanticSearchConfig;
  onChange: (config: SemanticSearchConfig) => void;
}

export const SemanticSearchConfig: React.FC<SemanticSearchConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('common');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('semantic_search.title')}</h3>
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
              {t('semantic_search.enabled.label')}
            </Form.Label>
            <Tooltip content={t('semantic_search.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Model Size */}
          <Form.Field name="model_size">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('semantic_search.model_size.label')}
                </Form.Label>
                <Tooltip content={t('semantic_search.model_size.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Select.Root
                value={config.model_size || 'small'}
                onValueChange={(value) =>
                  onChange({
                    ...config,
                    model_size: value as 'small' | 'large',
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
                        value="small"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('semantic_search.model_size.options.small')}
                        </Select.ItemText>
                      </Select.Item>
                      <Select.Item
                        value="large"
                        className="px-3 py-2 hover:bg-accent cursor-pointer outline-none"
                      >
                        <Select.ItemText>
                          {t('semantic_search.model_size.options.large')}
                        </Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </Form.Field>

          {/* Reindex Option */}
          <Form.Field name="reindex">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.reindex}
                  onChange={(e) => onChange({ ...config, reindex: e.target.checked })}
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('semantic_search.reindex.label')}
              </Form.Label>
              <Tooltip content={t('semantic_search.reindex.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>

          {/* Warning Message */}
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm">
                  {t('semantic_search.warning')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
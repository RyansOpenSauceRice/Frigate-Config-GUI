import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../../utils/tooltip';
import { CameraInput } from '../../../schemas/frigate';
import { PlusCircle, Trash2 } from 'lucide-react';

interface CameraFFmpegConfigProps {
  config: {
    inputs: CameraInput[];
    output_args?: {
      detect?: string;
      record?: string;
    };
    global_args?: string;
    hwaccel_args?: string;
    input_args?: string;
  };
  onChange: (config: CameraFFmpegConfigProps['config']) => void;
}

export const CameraFFmpegConfig: React.FC<CameraFFmpegConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('common');

  const handleInputChange = (index: number, input: CameraInput) => {
    const newInputs = [...config.inputs];
    newInputs[index] = input;
    onChange({ ...config, inputs: newInputs });
  };

  const handleAddInput = () => {
    onChange({
      ...config,
      inputs: [
        ...config.inputs,
        {
          path: '',
          roles: ['detect'],
          global_args: '',
          hwaccel_args: '',
          input_args: '',
        },
      ],
    });
  };

  const handleRemoveInput = (index: number) => {
    const newInputs = config.inputs.filter((_, i) => i !== index);
    onChange({ ...config, inputs: newInputs });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('camera.ffmpeg.title')}</h3>
        <Tooltip content={t('camera.ffmpeg.add_input')}>
          <button
            type="button"
            onClick={handleAddInput}
            className="p-2 text-primary hover:bg-primary/10 rounded-full"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      {/* Input Streams */}
      <div className="space-y-4">
        {config.inputs.map((input, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">
                {t('camera.ffmpeg.input')} #{index + 1}
              </h4>
              <Tooltip content={t('camera.ffmpeg.remove_input')}>
                <button
                  type="button"
                  onClick={() => handleRemoveInput(index)}
                  className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Tooltip>
            </div>

            {/* Stream Path */}
            <Form.Field name={`input-${index}-path`}>
              <div className="flex items-center justify-between">
                <Form.Label className="text-sm font-medium">
                  {t('camera.ffmpeg.path.label')}
                </Form.Label>
                <Tooltip content={t('camera.ffmpeg.path.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  type="text"
                  value={input.path}
                  onChange={(e) =>
                    handleInputChange(index, { ...input, path: e.target.value })
                  }
                  placeholder={t('camera.ffmpeg.path.placeholder')}
                />
              </Form.Control>
            </Form.Field>

            {/* Roles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {t('camera.ffmpeg.roles.label')}
                </span>
                <Tooltip content={t('camera.ffmpeg.roles.tooltip')}>
                  <div className="text-muted-foreground">ⓘ</div>
                </Tooltip>
              </div>
              <div className="flex gap-4">
                {(['detect', 'record', 'audio'] as const).map((role) => (
                  <label key={role} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={input.roles.includes(role)}
                      onChange={(e) => {
                        const newRoles = e.target.checked
                          ? [...input.roles, role]
                          : input.roles.filter((r) => r !== role);
                        handleInputChange(index, { ...input, roles: newRoles });
                      }}
                      className="rounded border-input"
                    />
                    <span className="text-sm">{t(`camera.ffmpeg.roles.${role}`)}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="space-y-4 pt-4 border-t">
              <Form.Field name={`input-${index}-global-args`}>
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('camera.ffmpeg.global_args.label')}
                  </Form.Label>
                  <Tooltip content={t('camera.ffmpeg.global_args.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    type="text"
                    value={input.global_args || ''}
                    onChange={(e) =>
                      handleInputChange(index, {
                        ...input,
                        global_args: e.target.value,
                      })
                    }
                    placeholder={t('camera.ffmpeg.global_args.placeholder')}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name={`input-${index}-hwaccel-args`}>
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('camera.ffmpeg.hwaccel_args.label')}
                  </Form.Label>
                  <Tooltip content={t('camera.ffmpeg.hwaccel_args.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    type="text"
                    value={input.hwaccel_args || ''}
                    onChange={(e) =>
                      handleInputChange(index, {
                        ...input,
                        hwaccel_args: e.target.value,
                      })
                    }
                    placeholder={t('camera.ffmpeg.hwaccel_args.placeholder')}
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name={`input-${index}-input-args`}>
                <div className="flex items-center justify-between">
                  <Form.Label className="text-sm font-medium">
                    {t('camera.ffmpeg.input_args.label')}
                  </Form.Label>
                  <Tooltip content={t('camera.ffmpeg.input_args.tooltip')}>
                    <div className="text-muted-foreground">ⓘ</div>
                  </Tooltip>
                </div>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    type="text"
                    value={input.input_args || ''}
                    onChange={(e) =>
                      handleInputChange(index, {
                        ...input,
                        input_args: e.target.value,
                      })
                    }
                    placeholder={t('camera.ffmpeg.input_args.placeholder')}
                  />
                </Form.Control>
              </Form.Field>
            </div>
          </div>
        ))}
      </div>

      {/* Global Output Arguments */}
      <div className="space-y-4 pt-6 border-t">
        <h4 className="text-sm font-medium">{t('camera.ffmpeg.output_args.title')}</h4>

        <Form.Field name="output-args-detect">
          <div className="flex items-center justify-between">
            <Form.Label className="text-sm font-medium">
              {t('camera.ffmpeg.output_args.detect.label')}
            </Form.Label>
            <Tooltip content={t('camera.ffmpeg.output_args.detect.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border rounded-md bg-background"
              type="text"
              value={config.output_args?.detect || ''}
              onChange={(e) =>
                onChange({
                  ...config,
                  output_args: {
                    ...config.output_args,
                    detect: e.target.value,
                  },
                })
              }
              placeholder={t('camera.ffmpeg.output_args.detect.placeholder')}
            />
          </Form.Control>
        </Form.Field>

        <Form.Field name="output-args-record">
          <div className="flex items-center justify-between">
            <Form.Label className="text-sm font-medium">
              {t('camera.ffmpeg.output_args.record.label')}
            </Form.Label>
            <Tooltip content={t('camera.ffmpeg.output_args.record.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
          <Form.Control asChild>
            <input
              className="w-full px-3 py-2 border rounded-md bg-background"
              type="text"
              value={config.output_args?.record || ''}
              onChange={(e) =>
                onChange({
                  ...config,
                  output_args: {
                    ...config.output_args,
                    record: e.target.value,
                  },
                })
              }
              placeholder={t('camera.ffmpeg.output_args.record.placeholder')}
            />
          </Form.Control>
        </Form.Field>
      </div>
    </div>
  );
};
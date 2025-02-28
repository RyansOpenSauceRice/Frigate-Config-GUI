import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Slider from '@radix-ui/react-slider';
import { Tooltip } from '../../../utils/tooltip';
import { MotionConfig } from '../../../schemas/frigate';

interface CameraMotionConfigProps {
  config: MotionConfig;
  onChange: (config: MotionConfig) => void;
}

export const CameraMotionConfig: React.FC<CameraMotionConfigProps> = ({
  config,
  onChange,
}) => {
  const { t } = useTranslation('camera');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('motion.title')}</h3>
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
              {t('motion.enabled.label')}
            </Form.Label>
            <Tooltip content={t('motion.enabled.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
        </Form.Field>
      </div>

      {config.enabled && (
        <div className="space-y-6">
          {/* Threshold Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('motion.threshold.label')}
              </label>
              <Tooltip content={t('motion.threshold.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={[config.threshold]}
              onValueChange={([value]) => onChange({ ...config, threshold: value })}
              max={255}
              min={1}
              step={1}
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
                <Slider.Range className="absolute h-full rounded-full bg-primary" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Threshold"
              />
            </Slider.Root>
            <div className="text-sm text-muted-foreground">
              {t('motion.threshold.value', { value: config.threshold })}
            </div>
          </div>

          {/* Contour Area Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('motion.contour_area.label')}
              </label>
              <Tooltip content={t('motion.contour_area.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={[config.contour_area]}
              onValueChange={([value]) => onChange({ ...config, contour_area: value })}
              max={100}
              min={1}
              step={1}
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
                <Slider.Range className="absolute h-full rounded-full bg-primary" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Contour Area"
              />
            </Slider.Root>
            <div className="text-sm text-muted-foreground">
              {t('motion.contour_area.value', { value: config.contour_area })}
            </div>
          </div>

          {/* Frame Alpha Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                {t('motion.frame_alpha.label')}
              </label>
              <Tooltip content={t('motion.frame_alpha.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Slider.Root
              className="relative flex items-center w-full h-5"
              value={[config.frame_alpha * 100]}
              onValueChange={([value]) =>
                onChange({ ...config, frame_alpha: value / 100 })
              }
              max={100}
              min={1}
              step={1}
            >
              <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
                <Slider.Range className="absolute h-full rounded-full bg-primary" />
              </Slider.Track>
              <Slider.Thumb
                className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label="Frame Alpha"
              />
            </Slider.Root>
            <div className="text-sm text-muted-foreground">
              {t('motion.frame_alpha.value', { value: config.frame_alpha })}
            </div>
          </div>

          {/* Frame Height */}
          <Form.Field name="frame_height">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('motion.frame_height.label')}
              </Form.Label>
              <Tooltip content={t('motion.frame_height.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="number"
                min={1}
                value={config.frame_height}
                onChange={(e) =>
                  onChange({ ...config, frame_height: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
          </Form.Field>

          {/* Improve Contrast */}
          <Form.Field name="improve_contrast">
            <div className="flex items-center space-x-2">
              <Form.Control asChild>
                <input
                  type="checkbox"
                  checked={config.improve_contrast}
                  onChange={(e) =>
                    onChange({ ...config, improve_contrast: e.target.checked })
                  }
                  className="rounded border-input"
                />
              </Form.Control>
              <Form.Label className="text-sm font-medium">
                {t('motion.improve_contrast.label')}
              </Form.Label>
              <Tooltip content={t('motion.improve_contrast.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
          </Form.Field>

          {/* Mask */}
          <Form.Field name="mask">
            <div className="flex items-center justify-between">
              <Form.Label className="text-sm font-medium">
                {t('motion.mask.label')}
              </Form.Label>
              <Tooltip content={t('motion.mask.tooltip')}>
                <div className="text-muted-foreground">ⓘ</div>
              </Tooltip>
            </div>
            <Form.Control asChild>
              <input
                type="text"
                value={config.mask || ''}
                onChange={(e) => onChange({ ...config, mask: e.target.value })}
                placeholder={t('motion.mask.placeholder')}
                className="w-full px-3 py-2 border rounded-md bg-background"
              />
            </Form.Control>
            <Form.Message match="valueMissing">
              {t('motion.mask.error.invalid')}
            </Form.Message>
          </Form.Field>
        </div>
      )}
    </div>
  );
};
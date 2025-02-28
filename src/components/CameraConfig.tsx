import React from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../utils/tooltip';
import { PlusCircle } from 'lucide-react';

export const CameraConfig: React.FC = () => {
  const { t } = useTranslation('common');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{t('camera.title')}</h2>
        <Tooltip content={t('tooltips.addCamera')}>
          <button
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            onClick={() => {/* Handle add camera */}}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {t('camera.add')}
          </button>
        </Tooltip>
      </div>

      {/* Camera List */}
      <div className="grid gap-4">
        {/* This would be mapped over your cameras */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold">Front Door Camera</h3>
              <p className="text-sm text-muted-foreground">rtsp://example.com/stream</p>
            </div>
            <div className="space-x-2">
              <Tooltip content={t('common.edit')}>
                <button className="p-2 hover:bg-accent rounded-md">
                  {/* Edit icon */}
                </button>
              </Tooltip>
              <Tooltip content={t('common.delete')}>
                <button className="p-2 hover:bg-destructive/10 rounded-md text-destructive">
                  {/* Delete icon */}
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Camera Form (could be in a modal) */}
      <Form.Root className="space-y-4 mt-6">
        <Form.Field name="name">
          <div className="space-y-2">
            <Form.Label className="text-sm font-medium">
              {t('camera.fields.name.label')}
            </Form.Label>
            <Tooltip content={t('camera.fields.name.tooltip')}>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  type="text"
                  placeholder={t('camera.fields.name.placeholder')}
                />
              </Form.Control>
            </Tooltip>
            <Form.Message className="text-sm text-destructive" match="valueMissing">
              {t('validation.required')}
            </Form.Message>
          </div>
        </Form.Field>

        <Form.Field name="url">
          <div className="space-y-2">
            <Form.Label className="text-sm font-medium">
              {t('camera.fields.url.label')}
            </Form.Label>
            <Tooltip content={t('camera.fields.url.tooltip')}>
              <Form.Control asChild>
                <input
                  className="w-full px-3 py-2 border rounded-md bg-background"
                  type="text"
                  placeholder={t('camera.fields.url.placeholder')}
                />
              </Form.Control>
            </Tooltip>
            <Form.Message className="text-sm text-destructive" match="valueMissing">
              {t('validation.required')}
            </Form.Message>
          </div>
        </Form.Field>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 border rounded-md hover:bg-accent"
          >
            {t('common.cancel')}
          </button>
          <Form.Submit asChild>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              {t('common.save')}
            </button>
          </Form.Submit>
        </div>
      </Form.Root>
    </div>
  );
};
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import * as Dialog from '@radix-ui/react-dialog';
import { Tooltip } from '../../../utils/tooltip';
import { ZoneConfig } from '../../../schemas/frigate';
import { PlusCircle, Trash2, Edit2 } from 'lucide-react';

interface CameraZonesConfigProps {
  config: Record<string, ZoneConfig>;
  onChange: (config: Record<string, ZoneConfig>) => void;
  availableObjects: string[]; // List of objects that can be tracked
}

interface ZoneEditorProps {
  name: string;
  zone: ZoneConfig;
  availableObjects: string[];
  onSave: (name: string, zone: ZoneConfig) => void;
  onClose: () => void;
}

const ZoneEditor: React.FC<ZoneEditorProps> = ({
  name,
  zone,
  availableObjects,
  onSave,
  onClose,
}) => {
  const { t } = useTranslation('camera');
  const [zoneName, setZoneName] = useState(name);
  const [zoneConfig, setZoneConfig] = useState(zone);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(zoneName, zoneConfig);
    onClose();
  };

  return (
    <Form.Root className="space-y-4" onSubmit={handleSave}>
      <Form.Field name="name">
        <div className="space-y-2">
          <Form.Label className="text-sm font-medium">
            {t('zones.editor.name.label')}
          </Form.Label>
          <Form.Control asChild>
            <input
              type="text"
              value={zoneName}
              onChange={(e) => setZoneName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder={t('zones.editor.name.placeholder')}
            />
          </Form.Control>
        </div>
      </Form.Field>

      <Form.Field name="coordinates">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Form.Label className="text-sm font-medium">
              {t('zones.editor.coordinates.label')}
            </Form.Label>
            <Tooltip content={t('zones.editor.coordinates.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
          <Form.Control asChild>
            <input
              type="text"
              value={zoneConfig.coordinates}
              onChange={(e) =>
                setZoneConfig({ ...zoneConfig, coordinates: e.target.value })
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
              placeholder={t('zones.editor.coordinates.placeholder')}
            />
          </Form.Control>
          <p className="text-xs text-muted-foreground">
            {t('zones.editor.coordinates.description')}
          </p>
        </div>
      </Form.Field>

      <div className="space-y-2">
        <label className="text-sm font-medium">
          {t('zones.editor.objects.label')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {availableObjects.map((obj) => (
            <label key={obj} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={zoneConfig.objects?.includes(obj) ?? false}
                onChange={(e) => {
                  const objects = zoneConfig.objects || [];
                  setZoneConfig({
                    ...zoneConfig,
                    objects: e.target.checked
                      ? [...objects, obj]
                      : objects.filter((o) => o !== obj),
                  });
                }}
                className="rounded border-input"
              />
              <span className="text-sm">{obj}</span>
            </label>
          ))}
        </div>
      </div>

      <Form.Field name="inertia">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Form.Label className="text-sm font-medium">
              {t('zones.editor.inertia.label')}
            </Form.Label>
            <Tooltip content={t('zones.editor.inertia.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
          <Form.Control asChild>
            <input
              type="number"
              min={0}
              value={zoneConfig.inertia}
              onChange={(e) =>
                setZoneConfig({ ...zoneConfig, inertia: parseInt(e.target.value) })
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </Form.Control>
        </div>
      </Form.Field>

      <Form.Field name="loitering_time">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Form.Label className="text-sm font-medium">
              {t('zones.editor.loitering_time.label')}
            </Form.Label>
            <Tooltip content={t('zones.editor.loitering_time.tooltip')}>
              <div className="text-muted-foreground">ⓘ</div>
            </Tooltip>
          </div>
          <Form.Control asChild>
            <input
              type="number"
              min={0}
              value={zoneConfig.loitering_time}
              onChange={(e) =>
                setZoneConfig({
                  ...zoneConfig,
                  loitering_time: parseInt(e.target.value),
                })
              }
              className="w-full px-3 py-2 border rounded-md bg-background"
            />
          </Form.Control>
        </div>
      </Form.Field>

      <div className="flex justify-end space-x-2 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border rounded-md hover:bg-accent"
        >
          {t('common.cancel')}
        </button>
        <Form.Submit asChild>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            {t('common.save')}
          </button>
        </Form.Submit>
      </div>
    </Form.Root>
  );
};

export const CameraZonesConfig: React.FC<CameraZonesConfigProps> = ({
  config,
  onChange,
  availableObjects,
}) => {
  const { t } = useTranslation('camera');
  const [editingZone, setEditingZone] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddZone = () => {
    setEditingZone(null);
    setIsDialogOpen(true);
  };

  const handleEditZone = (name: string) => {
    setEditingZone(name);
    setIsDialogOpen(true);
  };

  const handleDeleteZone = (name: string) => {
    const newConfig = { ...config };
    delete newConfig[name];
    onChange(newConfig);
  };

  const handleSaveZone = (name: string, zone: ZoneConfig) => {
    const newConfig = { ...config };
    if (editingZone && editingZone !== name) {
      delete newConfig[editingZone];
    }
    newConfig[name] = zone;
    onChange(newConfig);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t('zones.title')}</h3>
        <Tooltip content={t('zones.add')}>
          <button
            onClick={handleAddZone}
            className="p-2 text-primary hover:bg-primary/10 rounded-full"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </Tooltip>
      </div>

      <div className="space-y-4">
        {Object.entries(config).map(([name, zone]) => (
          <div
            key={name}
            className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{name}</h4>
                <p className="text-sm text-muted-foreground">
                  {zone.objects?.length
                    ? t('zones.tracking', { objects: zone.objects.join(', ') })
                    : t('zones.tracking_all')}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Tooltip content={t('common.edit')}>
                  <button
                    onClick={() => handleEditZone(name)}
                    className="p-2 text-primary hover:bg-primary/10 rounded-full"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </Tooltip>
                <Tooltip content={t('common.delete')}>
                  <button
                    onClick={() => handleDeleteZone(name)}
                    className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}

        {Object.keys(config).length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {t('zones.empty')}
          </div>
        )}
      </div>

      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg focus:outline-none">
            <div className="p-6">
              <Dialog.Title className="text-lg font-medium mb-4">
                {editingZone ? t('zones.edit_title') : t('zones.add_title')}
              </Dialog.Title>

              <ZoneEditor
                name={editingZone || ''}
                zone={
                  editingZone
                    ? config[editingZone]
                    : {
                        coordinates: '',
                        objects: [],
                        inertia: 3,
                        loitering_time: 0,
                      }
                }
                availableObjects={availableObjects}
                onSave={handleSaveZone}
                onClose={() => setIsDialogOpen(false)}
              />
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
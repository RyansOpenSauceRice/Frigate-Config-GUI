import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import { stringify } from 'yaml';
import { FrigateConfigType } from '../../schemas/frigate';
import { Eye, Copy, Check } from 'lucide-react';

interface ConfigPreviewProps {
  config: FrigateConfigType;
}

export const ConfigPreview: React.FC<ConfigPreviewProps> = ({ config }) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [yaml, setYaml] = useState('');

  useEffect(() => {
    // Format the config as YAML
    const formatted = stringify(config, {
      indent: 2,
      lineWidth: -1, // Disable line wrapping
      sortMapEntries: true, // Keep keys sorted
    });
    setYaml(formatted);
  }, [config]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yaml);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy config:', error);
    }
  };

  return (
    <>
      <Tooltip content={t('config.preview.button')}>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 text-primary hover:bg-primary/10 rounded-full"
        >
          <Eye className="w-5 h-5" />
        </button>
      </Tooltip>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[1000px] translate-x-[-50%] translate-y-[-50%] bg-background rounded-lg shadow-lg focus:outline-none">
            <div className="flex items-center justify-between p-4 border-b">
              <Dialog.Title className="text-lg font-medium">
                {t('config.preview.title')}
              </Dialog.Title>
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopy}
                  className="p-2 text-primary hover:bg-primary/10 rounded-full"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
                <Dialog.Close className="p-2 hover:bg-accent rounded-full">
                  ✕
                </Dialog.Close>
              </div>
            </div>

            <div className="p-4 overflow-auto max-h-[70vh]">
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code className="text-sm font-mono whitespace-pre">{yaml}</code>
              </pre>
            </div>

            <div className="p-4 border-t">
              <p className="text-sm text-muted-foreground">
                {t('config.preview.description')}
              </p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
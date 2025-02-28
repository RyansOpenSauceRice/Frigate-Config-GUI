import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as Dialog from '@radix-ui/react-dialog';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../utils/tooltip';
import { ConfigService } from '../../services/config';
import { FrigateConfigType } from '../../schemas/frigate';
import { Download, Upload, Github, Save } from 'lucide-react';

interface ConfigActionsProps {
  config: FrigateConfigType;
  onConfigLoad: (config: FrigateConfigType) => void;
}

export const ConfigActions: React.FC<ConfigActionsProps> = ({
  config,
  onConfigLoad,
}) => {
  const { t } = useTranslation('common');
  const [isGithubDialogOpen, setIsGithubDialogOpen] = useState(false);
  const [githubError, setGithubError] = useState<string | null>(null);
  const [githubForm, setGithubForm] = useState({
    owner: '',
    repo: '',
    path: 'config/frigate.yml',
    branch: 'main',
    message: 'Update Frigate configuration',
  });

  const configService = ConfigService.getInstance();

  const handleFileImport = async () => {
    try {
      const newConfig = await configService.loadFromFile();
      onConfigLoad(newConfig);
    } catch (error) {
      console.error('Failed to import config:', error);
      // TODO: Show error toast
    }
  };

  const handleFileExport = async () => {
    try {
      await configService.saveToFile(config);
    } catch (error) {
      console.error('Failed to export config:', error);
      // TODO: Show error toast
    }
  };

  const handleGithubImport = async () => {
    try {
      setGithubError(null);
      const newConfig = await configService.loadFromGithub(
        githubForm.owner,
        githubForm.repo,
        githubForm.path,
        githubForm.branch
      );
      onConfigLoad(newConfig);
      setIsGithubDialogOpen(false);
    } catch (error) {
      console.error('Failed to import from GitHub:', error);
      setGithubError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  const handleGithubExport = async () => {
    try {
      setGithubError(null);
      await configService.saveToGithub(
        config,
        githubForm.owner,
        githubForm.repo,
        githubForm.path,
        githubForm.message,
        githubForm.branch
      );
      setIsGithubDialogOpen(false);
    } catch (error) {
      console.error('Failed to export to GitHub:', error);
      setGithubError(error instanceof Error ? error.message : 'Unknown error');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Tooltip content={t('config.actions.import_file')}>
        <button
          onClick={handleFileImport}
          className="p-2 text-primary hover:bg-primary/10 rounded-full"
        >
          <Upload className="w-5 h-5" />
        </button>
      </Tooltip>

      <Tooltip content={t('config.actions.export_file')}>
        <button
          onClick={handleFileExport}
          className="p-2 text-primary hover:bg-primary/10 rounded-full"
        >
          <Download className="w-5 h-5" />
        </button>
      </Tooltip>

      <Dialog.Root open={isGithubDialogOpen} onOpenChange={setIsGithubDialogOpen}>
        <Tooltip content={t('config.actions.github')}>
          <Dialog.Trigger asChild>
            <button className="p-2 text-primary hover:bg-primary/10 rounded-full">
              <Github className="w-5 h-5" />
            </button>
          </Dialog.Trigger>
        </Tooltip>

        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg w-[400px]">
            <Dialog.Title className="text-lg font-medium mb-4">
              {t('config.github.title')}
            </Dialog.Title>

            <Form.Root className="space-y-4">
              <Form.Field name="owner">
                <Form.Label className="text-sm font-medium">
                  {t('config.github.owner')}
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={githubForm.owner}
                    onChange={(e) =>
                      setGithubForm({ ...githubForm, owner: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="repo">
                <Form.Label className="text-sm font-medium">
                  {t('config.github.repo')}
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={githubForm.repo}
                    onChange={(e) =>
                      setGithubForm({ ...githubForm, repo: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="path">
                <Form.Label className="text-sm font-medium">
                  {t('config.github.path')}
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={githubForm.path}
                    onChange={(e) =>
                      setGithubForm({ ...githubForm, path: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="branch">
                <Form.Label className="text-sm font-medium">
                  {t('config.github.branch')}
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={githubForm.branch}
                    onChange={(e) =>
                      setGithubForm({ ...githubForm, branch: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              <Form.Field name="message">
                <Form.Label className="text-sm font-medium">
                  {t('config.github.message')}
                </Form.Label>
                <Form.Control asChild>
                  <input
                    className="w-full px-3 py-2 border rounded-md bg-background"
                    value={githubForm.message}
                    onChange={(e) =>
                      setGithubForm({ ...githubForm, message: e.target.value })
                    }
                  />
                </Form.Control>
              </Form.Field>

              {githubError && (
                <div className="text-sm text-destructive">{githubError}</div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={handleGithubImport}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Upload className="w-4 h-4 mr-2 inline-block" />
                  {t('config.github.import')}
                </button>
                <button
                  type="button"
                  onClick={handleGithubExport}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  <Save className="w-4 h-4 mr-2 inline-block" />
                  {t('config.github.export')}
                </button>
              </div>
            </Form.Root>

            <Dialog.Close className="absolute top-4 right-4 p-2 rounded-full hover:bg-accent">
              ✕
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
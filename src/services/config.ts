import { parse, stringify } from 'yaml';
import { FrigateConfig, FrigateConfigType } from '../schemas/frigate';

export class ConfigService {
  private static instance: ConfigService;
  private githubToken: string | null = null;

  private constructor() {
    // Initialize with environment variable if available
    this.githubToken = process.env.GITHUB_TOKEN || null;
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  // Local Storage Operations
  public saveToLocalStorage(config: FrigateConfigType): void {
    try {
      localStorage.setItem('frigate_config', stringify(config));
    } catch (error) {
      console.error('Failed to save config to local storage:', error);
      throw error;
    }
  }

  public loadFromLocalStorage(): FrigateConfigType | null {
    try {
      const stored = localStorage.getItem('frigate_config');
      if (!stored) return null;
      
      const parsed = parse(stored);
      return FrigateConfig.parse(parsed);
    } catch (error) {
      console.error('Failed to load config from local storage:', error);
      return null;
    }
  }

  // File System Operations
  public async saveToFile(config: FrigateConfigType): Promise<void> {
    try {
      const yaml = stringify(config);
      const blob = new Blob([yaml], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'frigate_config.yml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to save config to file:', error);
      throw error;
    }
  }

  public async loadFromFile(): Promise<FrigateConfigType> {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.yml,.yaml';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        try {
          const text = await file.text();
          const parsed = parse(text);
          const config = FrigateConfig.parse(parsed);
          resolve(config);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }

  // GitHub Operations
  public async setGithubToken(token: string): Promise<void> {
    this.githubToken = token;
  }

  public async loadFromGithub(owner: string, repo: string, path: string, ref = 'main'): Promise<FrigateConfigType> {
    if (!this.githubToken) {
      throw new Error('GitHub token not set');
    }

    try {
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${ref}`,
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
            Accept: 'application/vnd.github.v3.raw',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }

      const text = await response.text();
      const parsed = parse(text);
      return FrigateConfig.parse(parsed);
    } catch (error) {
      console.error('Failed to load config from GitHub:', error);
      throw error;
    }
  }

  public async saveToGithub(
    config: FrigateConfigType,
    owner: string,
    repo: string,
    path: string,
    message: string,
    branch: string
  ): Promise<void> {
    if (!this.githubToken) {
      throw new Error('GitHub token not set');
    }

    try {
      // First, get the current file (if it exists) to get its SHA
      const currentFile = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
          },
        }
      ).then(res => res.json()).catch(() => null);

      const yaml = stringify(config);
      const content = Buffer.from(yaml).toString('base64');

      const body = {
        message,
        content,
        branch,
        ...(currentFile?.sha ? { sha: currentFile.sha } : {})
      };

      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.githubToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Failed to save config to GitHub:', error);
      throw error;
    }
  }

  // Validation
  public validateConfig(config: unknown): FrigateConfigType {
    return FrigateConfig.parse(config);
  }

  // Migration (for future version changes)
  public migrateConfig(config: FrigateConfigType): FrigateConfigType {
    // TODO: Implement version-specific migrations
    return config;
  }
}
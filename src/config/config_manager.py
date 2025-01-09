from pathlib import Path
from typing import Dict, Optional, Union
import yaml

class FrigateConfigManager:
    def __init__(self):
        self._current_config: Optional[Dict] = None
        self._config_path: Optional[Path] = None

    def load_config(self, path: Union[str, Path]) -> Dict:
        """Load a Frigate configuration file from the specified path."""
        path = Path(path)
        if not path.exists():
            raise FileNotFoundError(f"Configuration file not found: {path}")
        
        try:
            with path.open('r') as f:
                self._current_config = yaml.safe_load(f)
                self._config_path = path
                return self._current_config
        except yaml.YAMLError as e:
            raise ValueError(f"Invalid YAML format: {e}")

    def save_config(self, path: Optional[Union[str, Path]] = None) -> None:
        """Save the current configuration to a file."""
        if self._current_config is None:
            raise ValueError("No configuration loaded")

        save_path = Path(path) if path else self._config_path
        if save_path is None:
            raise ValueError("No save path specified")

        try:
            with save_path.open('w') as f:
                yaml.safe_dump(self._current_config, f, sort_keys=False)
            self._config_path = save_path
        except Exception as e:
            raise IOError(f"Failed to save configuration: {e}")

    def get_cameras(self) -> Dict:
        """Get the cameras section of the configuration."""
        if self._current_config is None:
            raise ValueError("No configuration loaded")
        return self._current_config.get('cameras', {})

    def update_camera(self, camera_name: str, config: Dict) -> None:
        """Update or add a camera configuration."""
        if self._current_config is None:
            raise ValueError("No configuration loaded")
        
        if 'cameras' not in self._current_config:
            self._current_config['cameras'] = {}
        
        self._current_config['cameras'][camera_name] = config

    def remove_camera(self, camera_name: str) -> None:
        """Remove a camera from the configuration."""
        if self._current_config is None:
            raise ValueError("No configuration loaded")
        
        if 'cameras' in self._current_config:
            self._current_config['cameras'].pop(camera_name, None)

    def validate_camera_config(self, config: Dict) -> bool:
        """
        Validate camera configuration against Frigate's schema.
        TODO: Implement actual validation against Frigate's schema
        """
        required_fields = {'ffmpeg', 'detect', 'snapshots'}
        return all(field in config for field in required_fields)
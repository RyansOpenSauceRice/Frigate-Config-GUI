import pytest
from pathlib import Path
from src.config.config_manager import FrigateConfigManager

@pytest.fixture
def sample_config():
    return {
        'cameras': {
            'back': {
                'ffmpeg': {
                    'inputs': [
                        {'path': 'rtsp://example.com/back', 'roles': ['detect', 'record']}
                    ]
                },
                'detect': {
                    'enabled': True,
                    'width': 1280,
                    'height': 720
                },
                'snapshots': {
                    'enabled': True
                }
            }
        }
    }

@pytest.fixture
def config_file(tmp_path, sample_config):
    config_path = tmp_path / "config.yml"
    with config_path.open('w') as f:
        yaml.safe_dump(sample_config, f)
    return config_path

def test_load_config(config_file, sample_config):
    manager = FrigateConfigManager()
    loaded_config = manager.load_config(config_file)
    assert loaded_config == sample_config

def test_save_config(tmp_path, sample_config):
    manager = FrigateConfigManager()
    manager._current_config = sample_config
    
    save_path = tmp_path / "saved_config.yml"
    manager.save_config(save_path)
    
    assert save_path.exists()
    with save_path.open('r') as f:
        loaded_config = yaml.safe_load(f)
    assert loaded_config == sample_config

def test_get_cameras(sample_config):
    manager = FrigateConfigManager()
    manager._current_config = sample_config
    cameras = manager.get_cameras()
    assert cameras == sample_config['cameras']

def test_update_camera():
    manager = FrigateConfigManager()
    manager._current_config = {'cameras': {}}
    
    camera_config = {
        'ffmpeg': {'inputs': []},
        'detect': {'enabled': True},
        'snapshots': {'enabled': True}
    }
    
    manager.update_camera('new_camera', camera_config)
    assert 'new_camera' in manager.get_cameras()
    assert manager.get_cameras()['new_camera'] == camera_config

def test_remove_camera(sample_config):
    manager = FrigateConfigManager()
    manager._current_config = sample_config
    
    manager.remove_camera('back')
    assert 'back' not in manager.get_cameras()

def test_validate_camera_config():
    manager = FrigateConfigManager()
    
    valid_config = {
        'ffmpeg': {'inputs': []},
        'detect': {'enabled': True},
        'snapshots': {'enabled': True}
    }
    assert manager.validate_camera_config(valid_config)
    
    invalid_config = {
        'ffmpeg': {'inputs': []}
    }
    assert not manager.validate_camera_config(invalid_config)
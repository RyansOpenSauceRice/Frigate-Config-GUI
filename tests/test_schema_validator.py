import pytest
from src.config.schema_validator import validate_config, get_camera_config_template

def test_validate_basic_config():
    config = {
        "cameras": {
            "back": {
                "ffmpeg": {
                    "inputs": [
                        {
                            "path": "rtsp://example.com/stream",
                            "roles": ["detect", "record"]
                        }
                    ]
                }
            }
        }
    }
    is_valid, error = validate_config(config)
    assert is_valid
    assert error is None

def test_validate_invalid_config():
    config = {
        "cameras": {
            "back": {
                "ffmpeg": {
                    "inputs": [
                        {
                            "path": "rtsp://example.com/stream",
                            # Missing required 'roles' field
                        }
                    ]
                }
            }
        }
    }
    is_valid, error = validate_config(config)
    assert not is_valid
    assert error is not None
    assert "roles" in error.lower()

def test_camera_template():
    template = get_camera_config_template()
    assert "ffmpeg" in template
    assert "inputs" in template["ffmpeg"]
    assert len(template["ffmpeg"]["inputs"]) == 1
    assert "detect" in template
    assert "snapshots" in template

def test_validate_full_config():
    config = {
        "cameras": {
            "back": {
                "ffmpeg": {
                    "inputs": [
                        {
                            "path": "rtsp://example.com/stream",
                            "roles": ["detect", "record"]
                        }
                    ]
                },
                "detect": {
                    "width": 1280,
                    "height": 720,
                    "fps": 5
                },
                "snapshots": {
                    "enabled": True,
                    "timestamp": True,
                    "bounding_box": True,
                    "retain": {
                        "default": 10,
                        "objects": {
                            "person": 15
                        }
                    }
                },
                "objects": {
                    "track": ["person"],
                    "filters": {
                        "person": {
                            "min_area": 5000,
                            "max_area": 100000,
                            "threshold": 0.7
                        }
                    }
                }
            }
        }
    }
    is_valid, error = validate_config(config)
    assert is_valid
    assert error is None
import pytest
from PyQt6.QtWidgets import QApplication
from src.gui.main_window import MainWindow
from src.gui.camera_config import CameraConfigWidget, CameraWidget

@pytest.fixture
def app():
    return QApplication([])

@pytest.fixture
def main_window(app):
    return MainWindow()

def test_main_window_creation(main_window):
    assert main_window.windowTitle() == 'Frigate Config GUI'
    assert main_window.minimumSize().width() >= 800
    assert main_window.minimumSize().height() >= 600

def test_camera_config_widget(app, main_window):
    camera_config = main_window.camera_config
    assert isinstance(camera_config, CameraConfigWidget)
    
    # Test adding a camera
    initial_count = len(camera_config.camera_widgets)
    camera_config.add_camera("test_camera")
    assert len(camera_config.camera_widgets) == initial_count + 1

def test_camera_widget(app):
    widget = CameraWidget(None, "test_camera", {
        'ffmpeg': {
            'inputs': [{
                'path': 'rtsp://test.com/stream',
                'roles': ['detect', 'record']
            }]
        },
        'detect': {
            'enabled': True,
            'width': 1280,
            'height': 720,
            'fps': 5
        }
    })
    
    assert widget.name_edit.text() == "test_camera"
    assert widget.rtsp_input.text() == "rtsp://test.com/stream"
    assert widget.detect_enabled.isChecked() is True
    assert widget.detect_width.value() == 1280
    assert widget.detect_height.value() == 720
    assert widget.detect_fps.value() == 5
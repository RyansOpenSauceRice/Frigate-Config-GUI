from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QFormLayout,
    QPushButton, QLineEdit, QSpinBox, QCheckBox,
    QLabel, QScrollArea, QFrame, QMessageBox,
    QDoubleSpinBox, QComboBox
)
from PyQt6.QtCore import Qt
from typing import Dict, Optional

class CameraConfigWidget(QWidget):
    def __init__(self, config_manager):
        super().__init__()
        self.config_manager = config_manager
        self.camera_widgets = {}
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)

        # Toolbar for camera operations
        toolbar = QHBoxLayout()
        add_camera_btn = QPushButton('Add Camera')
        add_camera_btn.clicked.connect(self.add_camera)
        toolbar.addWidget(add_camera_btn)
        toolbar.addStretch()
        layout.addLayout(toolbar)

        # Scrollable area for camera configs
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        
        self.scroll_content = QWidget()
        self.scroll_layout = QVBoxLayout(self.scroll_content)
        self.scroll_layout.addStretch()
        
        scroll.setWidget(self.scroll_content)
        layout.addWidget(scroll)

    def add_camera(self, name: str = "", config: Dict = None):
        camera_widget = CameraWidget(
            self.config_manager,
            name,
            config,
            self.remove_camera
        )
        self.camera_widgets[camera_widget] = name
        # Insert before the stretch
        self.scroll_layout.insertWidget(self.scroll_layout.count() - 1, camera_widget)

    def remove_camera(self, widget):
        name = self.camera_widgets.get(widget)
        if name:
            self.config_manager.remove_camera(name)
            self.camera_widgets.pop(widget)
            widget.deleteLater()

    def update_ui_from_config(self):
        # Clear existing widgets
        while self.scroll_layout.count() > 1:  # Keep the stretch
            item = self.scroll_layout.takeAt(0)
            if item.widget():
                item.widget().deleteLater()
        self.camera_widgets.clear()

        # Add widgets for each camera in config
        if self.config_manager._current_config:
            cameras = self.config_manager.get_cameras()
            for name, config in cameras.items():
                self.add_camera(name, config)

class CameraWidget(QFrame):
    def __init__(self, config_manager, name: str = "", config: Optional[Dict] = None, 
                 remove_callback=None):
        super().__init__()
        self.config_manager = config_manager
        self.remove_callback = remove_callback
        self.setFrameStyle(QFrame.Shape.Box | QFrame.Shadow.Raised)
        self.init_ui(name, config or {})

    def init_ui(self, name: str, config: Dict):
        layout = QVBoxLayout(self)

        # Header with camera name and remove button
        header = QHBoxLayout()
        self.name_edit = QLineEdit(name)
        self.name_edit.setPlaceholderText("Camera Name")
        self.name_edit.textChanged.connect(self.update_config)
        header.addWidget(self.name_edit)

        remove_btn = QPushButton('Remove')
        remove_btn.clicked.connect(lambda: self.remove_callback(self))
        header.addWidget(remove_btn)
        layout.addLayout(header)

        # Camera configuration form
        form = QFormLayout()

        # FFMPEG Input
        self.rtsp_input = QLineEdit()
        self.rtsp_input.setPlaceholderText("rtsp://example.com/stream")
        if config.get('ffmpeg', {}).get('inputs'):
            self.rtsp_input.setText(config['ffmpeg']['inputs'][0].get('path', ''))
        self.rtsp_input.textChanged.connect(self.update_config)
        form.addRow("RTSP Stream:", self.rtsp_input)

        # Detect settings
        detect_group = QFrame()
        detect_layout = QFormLayout(detect_group)

        self.detect_enabled = QCheckBox()
        self.detect_enabled.setChecked(config.get('detect', {}).get('enabled', True))
        detect_layout.addRow("Enable Detection:", self.detect_enabled)

        self.detect_width = QSpinBox()
        self.detect_width.setRange(0, 4096)
        self.detect_width.setValue(config.get('detect', {}).get('width', 1280))
        detect_layout.addRow("Width:", self.detect_width)

        self.detect_height = QSpinBox()
        self.detect_height.setRange(0, 4096)
        self.detect_height.setValue(config.get('detect', {}).get('height', 720))
        detect_layout.addRow("Height:", self.detect_height)

        self.detect_fps = QSpinBox()
        self.detect_fps.setRange(1, 30)
        self.detect_fps.setValue(config.get('detect', {}).get('fps', 5))
        detect_layout.addRow("FPS:", self.detect_fps)

        form.addRow("Detect Settings:", detect_group)

        # Object detection settings
        objects_group = QFrame()
        objects_layout = QFormLayout(objects_group)

        self.min_score = QDoubleSpinBox()
        self.min_score.setRange(0, 1)
        self.min_score.setSingleStep(0.1)
        self.min_score.setValue(
            config.get('objects', {}).get('filters', {}).get('person', {}).get('min_score', 0.5)
        )
        objects_layout.addRow("Min Score:", self.min_score)

        self.threshold = QDoubleSpinBox()
        self.threshold.setRange(0, 1)
        self.threshold.setSingleStep(0.1)
        self.threshold.setValue(
            config.get('objects', {}).get('filters', {}).get('person', {}).get('threshold', 0.7)
        )
        objects_layout.addRow("Threshold:", self.threshold)

        form.addRow("Object Detection:", objects_group)

        # Add form to layout
        layout.addLayout(form)

        # Connect all inputs to update_config
        self.detect_enabled.stateChanged.connect(self.update_config)
        self.detect_width.valueChanged.connect(self.update_config)
        self.detect_height.valueChanged.connect(self.update_config)
        self.detect_fps.valueChanged.connect(self.update_config)
        self.min_score.valueChanged.connect(self.update_config)
        self.threshold.valueChanged.connect(self.update_config)

    def update_config(self):
        if not self.name_edit.text():
            return

        config = {
            'ffmpeg': {
                'inputs': [{
                    'path': self.rtsp_input.text(),
                    'roles': ['detect', 'record']
                }]
            },
            'detect': {
                'enabled': self.detect_enabled.isChecked(),
                'width': self.detect_width.value(),
                'height': self.detect_height.value(),
                'fps': self.detect_fps.value()
            },
            'objects': {
                'track': ['person'],
                'filters': {
                    'person': {
                        'min_score': self.min_score.value(),
                        'threshold': self.threshold.value()
                    }
                }
            }
        }

        try:
            self.config_manager.update_camera(self.name_edit.text(), config)
        except Exception as e:
            QMessageBox.warning(
                self,
                "Configuration Error",
                f"Failed to update camera configuration:\n{str(e)}"
            )
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

    def show_rtsp_examples(self):
        examples = {
            "Reolink": {
                "format": "rtsp://admin:password@192.168.1.10:554/h264Preview_01_main",
                "notes": [
                    "Default substream: change _01_main to _01_sub",
                    "Some models use /h264Preview_01_ch01_main instead"
                ]
            },
            "Amcrest": {
                "format": "rtsp://admin:password@192.168.1.10:554/cam/realmonitor?channel=1&subtype=0",
                "notes": [
                    "subtype=0 is main stream, subtype=1 is substream",
                    "Default port is 554"
                ]
            },
            "Hikvision": {
                "format": "rtsp://admin:password@192.168.1.10:554/Streaming/Channels/101",
                "notes": [
                    "101 = channel 1, main stream",
                    "102 = channel 1, substream"
                ]
            }
        }
        
        msg = QMessageBox()
        msg.setWindowTitle("RTSP Stream Examples")
        
        text = "Common RTSP URL Formats:\n\n"
        for brand, info in examples.items():
            text += f"{brand}:\n"
            text += f"Format: {info['format']}\n"
            text += "Notes:\n"
            for note in info['notes']:
                text += f"- {note}\n"
            text += "\n"
            
        text += "\nRemember to:\n"
        text += "1. Replace admin:password with your camera credentials\n"
        text += "2. Replace 192.168.1.10 with your camera's IP address\n"
        text += "3. Adjust the stream type based on your needs"
        
        msg.setText(text)
        msg.setIcon(QMessageBox.Icon.Information)
        msg.exec()

    def update_camera_template(self, model: str):
        templates = {
            "Reolink RLC-810A": {
                "rtsp": "rtsp://admin:password@192.168.1.10:554/h264Preview_01_main",
                "resolution": (2560, 1920),
                "fps": 5
            },
            "Amcrest IP8M-2496EB": {
                "rtsp": "rtsp://admin:password@192.168.1.10:554/cam/realmonitor?channel=1&subtype=0",
                "resolution": (1920, 1080),
                "fps": 5
            },
            "Hikvision DS-2CD2385G1": {
                "rtsp": "rtsp://admin:password@192.168.1.10:554/Streaming/Channels/101",
                "resolution": (1920, 1080),
                "fps": 5
            },
            "Dahua IPC-HDW5831R-ZE": {
                "rtsp": "rtsp://admin:password@192.168.1.10:554/cam/realmonitor?channel=1&subtype=0",
                "resolution": (1920, 1080),
                "fps": 5
            }
        }
        
        if model in templates:
            template = templates[model]
            self.rtsp_input.setPlaceholderText(template["rtsp"])
            self.detect_width.setValue(template["resolution"][0])
            self.detect_height.setValue(template["resolution"][1])
            self.detect_fps.setValue(template["fps"])
            
            QMessageBox.information(
                self,
                "Camera Template Applied",
                f"Applied template for {model}.\n\n"
                "Remember to:\n"
                "1. Update the IP address\n"
                "2. Update the username/password\n"
                "3. Adjust settings based on your needs"
            )

    def apply_resolution_preset(self, preset: str):
        presets = {
            "HD (1280×720) - Recommended": (1280, 720),
            "Full HD (1920×1080)": (1920, 1080),
            "Low (854×480)": (854, 480)
        }
        
        if preset in presets:
            width, height = presets[preset]
            self.detect_width.setValue(width)
            self.detect_height.setValue(height)

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

        # Camera Stream Settings
        stream_group = QFrame()
        stream_layout = QFormLayout(stream_group)

        # Camera brand/model selection
        self.camera_model = QComboBox()
        self.camera_model.addItems([
            "Select Camera Type...",
            "Reolink RLC-810A",
            "Amcrest IP8M-2496EB",
            "Hikvision DS-2CD2385G1",
            "Dahua IPC-HDW5831R-ZE",
            "Generic RTSP Camera"
        ])
        self.camera_model.currentTextChanged.connect(self.update_camera_template)
        stream_layout.addRow("Camera Model:", self.camera_model)

        # RTSP Stream input with examples
        self.rtsp_input = QLineEdit()
        if config.get('ffmpeg', {}).get('inputs'):
            self.rtsp_input.setText(config['ffmpeg']['inputs'][0].get('path', ''))
        self.rtsp_input.textChanged.connect(self.update_config)
        
        # Add example button
        example_btn = QPushButton("Show Examples")
        example_btn.clicked.connect(self.show_rtsp_examples)
        
        rtsp_layout = QHBoxLayout()
        rtsp_layout.addWidget(self.rtsp_input)
        rtsp_layout.addWidget(example_btn)
        
        stream_layout.addRow("RTSP Stream:", rtsp_layout)
        
        # Add helpful tooltip
        self.rtsp_input.setToolTip(
            "The RTSP stream URL for your camera.\n\n"
            "Common formats:\n"
            "- Reolink: rtsp://admin:password@192.168.1.10:554/h264Preview_01_main\n"
            "- Amcrest: rtsp://admin:password@192.168.1.10:554/cam/realmonitor?channel=1&subtype=0\n"
            "- Hikvision: rtsp://admin:password@192.168.1.10:554/Streaming/Channels/101\n"
            "- Dahua: rtsp://admin:password@192.168.1.10:554/cam/realmonitor?channel=1&subtype=0\n\n"
            "Replace admin:password with your credentials and 192.168.1.10 with your camera's IP."
        )
        
        form.addRow("Stream Settings:", stream_group)

        # Detection Settings with Recommendations
        detect_group = QFrame()
        detect_layout = QFormLayout(detect_group)

        # Enable detection with explanation
        self.detect_enabled = QCheckBox()
        self.detect_enabled.setChecked(config.get('detect', {}).get('enabled', True))
        self.detect_enabled.setToolTip(
            "Enable object detection for this camera.\n"
            "Required for motion detection and object tracking."
        )
        detect_layout.addRow("Enable Detection:", self.detect_enabled)

        # Resolution settings with recommendations
        resolution_label = QLabel("Detection Resolution:")
        resolution_label.setToolTip(
            "The resolution used for object detection.\n\n"
            "Recommendations:\n"
            "- Higher resolution = better detection but more CPU usage\n"
            "- 1280x720 is a good balance for most cases\n"
            "- For distant objects, consider higher resolution\n"
            "- For close objects, lower resolution may work fine"
        )
        detect_layout.addRow(resolution_label)

        resolution_widget = QWidget()
        resolution_layout = QHBoxLayout(resolution_widget)
        
        self.detect_width = QSpinBox()
        self.detect_width.setRange(0, 4096)
        self.detect_width.setValue(config.get('detect', {}).get('width', 1280))
        self.detect_width.setSuffix(" px")
        
        self.detect_height = QSpinBox()
        self.detect_height.setRange(0, 4096)
        self.detect_height.setValue(config.get('detect', {}).get('height', 720))
        self.detect_height.setSuffix(" px")
        
        resolution_layout.addWidget(self.detect_width)
        resolution_layout.addWidget(QLabel("×"))
        resolution_layout.addWidget(self.detect_height)
        
        # Add resolution presets
        resolution_presets = QComboBox()
        resolution_presets.addItems([
            "Select preset...",
            "HD (1280×720) - Recommended",
            "Full HD (1920×1080)",
            "Low (854×480)",
            "Custom"
        ])
        resolution_presets.currentTextChanged.connect(self.apply_resolution_preset)
        detect_layout.addRow("Resolution Preset:", resolution_presets)
        detect_layout.addRow("Custom Resolution:", resolution_widget)

        # FPS settings with explanation
        fps_widget = QWidget()
        fps_layout = QHBoxLayout(fps_widget)
        
        self.detect_fps = QSpinBox()
        self.detect_fps.setRange(1, 30)
        self.detect_fps.setValue(config.get('detect', {}).get('fps', 5))
        self.detect_fps.setSuffix(" FPS")
        self.detect_fps.setToolTip(
            "Frames per second for object detection.\n\n"
            "Recommendations:\n"
            "- 5 FPS is good for most cases\n"
            "- Higher FPS = more CPU usage\n"
            "- Lower FPS might miss fast-moving objects\n"
            "- Consider your CPU capabilities"
        )
        
        fps_layout.addWidget(self.detect_fps)
        fps_layout.addStretch()
        
        detect_layout.addRow("Detection Speed:", fps_layout)

        # Add a performance impact indicator
        perf_label = QLabel("💡 Tip: Start with recommended values and adjust based on performance")
        perf_label.setStyleSheet("color: #666; font-style: italic;")
        detect_layout.addRow(perf_label)

        form.addRow("Detection Settings:", detect_group)

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
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

    # Removed camera template and example methods to focus on core functionality

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

        # Required Fields Group
        required_group = QFrame()
        required_layout = QFormLayout(required_group)

        # RTSP Stream input (Required)
        self.rtsp_input = QLineEdit()
        if config.get('ffmpeg', {}).get('inputs'):
            self.rtsp_input.setText(config['ffmpeg']['inputs'][0].get('path', ''))
        self.rtsp_input.setPlaceholderText("rtsp://username:password@ip:port/path")
        self.rtsp_input.textChanged.connect(self.update_config)
        self.rtsp_input.setToolTip(
            "Required: The RTSP stream URL for your camera\n"
            "Format: rtsp://username:password@ip:port/path"
        )
        required_layout.addRow("RTSP Stream URL*:", self.rtsp_input)

        # Stream Roles (Required)
        roles_widget = QWidget()
        roles_layout = QHBoxLayout(roles_widget)
        roles_layout.setContentsMargins(0, 0, 0, 0)

        self.role_detect = QCheckBox("detect")
        self.role_record = QCheckBox("record")
        self.role_audio = QCheckBox("audio")

        # Set initial values from config
        if config.get('ffmpeg', {}).get('inputs'):
            roles = config['ffmpeg']['inputs'][0].get('roles', [])
            self.role_detect.setChecked('detect' in roles)
            self.role_record.setChecked('record' in roles)
            self.role_audio.setChecked('audio' in roles)

        roles_layout.addWidget(self.role_detect)
        roles_layout.addWidget(self.role_record)
        roles_layout.addWidget(self.role_audio)
        roles_layout.addStretch()

        roles_label = QLabel("Stream Roles*:")
        roles_label.setToolTip(
            "Required: Select at least one role for this stream\n"
            "- detect: Use this stream for object detection\n"
            "- record: Use this stream for recordings\n"
            "- audio: Use this stream for audio"
        )
        required_layout.addRow(roles_label, roles_widget)

        # Add required fields group to form
        form.addRow(required_group)

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

        # Add recording settings
        record_group = self.create_recording_section(config)
        form.addRow("Recording:", record_group)

        # Add ONVIF settings
        onvif_group = self.create_onvif_section(config)
        form.addRow("ONVIF Settings:", onvif_group)

        # Add autotracking settings
        autotrack_group = self.create_autotracking_section(config)
        form.addRow("Camera Autotracking:", autotrack_group)

        # Add form to layout
        layout.addLayout(form)

        # Connect all inputs to update_config
        self.detect_enabled.stateChanged.connect(self.update_config)
        self.detect_width.valueChanged.connect(self.update_config)
        self.detect_height.valueChanged.connect(self.update_config)
        self.detect_fps.valueChanged.connect(self.update_config)
        self.min_score.valueChanged.connect(self.update_config)
        self.threshold.valueChanged.connect(self.update_config)
        # Connect recording inputs
        self.record_enabled.stateChanged.connect(self.update_config)
        self.record_retain_days.valueChanged.connect(self.update_config)
        self.record_retain_mode.currentTextChanged.connect(self.update_config)
        self.record_sync.stateChanged.connect(self.update_config)
        self.event_retain_days.valueChanged.connect(self.update_config)
        self.event_retain_mode.currentTextChanged.connect(self.update_config)
        self.timelapse_args.textChanged.connect(self.update_config)
        # Connect ONVIF inputs
        self.onvif_host.textChanged.connect(self.update_config)
        self.onvif_port.valueChanged.connect(self.update_config)
        self.onvif_username.textChanged.connect(self.update_config)
        self.onvif_password.textChanged.connect(self.update_config)
        # Connect autotracking inputs
        self.autotrack_enabled.stateChanged.connect(self.update_config)
        self.calibrate_startup.stateChanged.connect(self.update_config)
        self.zoom_mode.currentTextChanged.connect(self.update_config)
        self.zoom_factor.valueChanged.connect(self.update_config)
        self.return_preset.textChanged.connect(self.update_config)
        self.timeout.valueChanged.connect(self.update_config)
        self.track_person.stateChanged.connect(self.update_config)
        self.track_vehicle.stateChanged.connect(self.update_config)
        self.track_animal.stateChanged.connect(self.update_config)

    def create_recording_section(self, config: Dict) -> QFrame:
        """Create the recording configuration section."""
        group = QFrame()
        layout = QFormLayout(group)

        # Get recording config
        record_config = config.get('record', {})

        # Enable recording
        self.record_enabled = QCheckBox()
        self.record_enabled.setChecked(record_config.get('enabled', False))
        self.record_enabled.setToolTip(
            "Enable/disable recording for this camera.\n"
            "Recordings are stored at /media/frigate/recordings"
        )
        layout.addRow("Enable Recording:", self.record_enabled)

        # Continuous recording settings
        retain_group = QFrame()
        retain_layout = QFormLayout(retain_group)

        # Retain days
        self.record_retain_days = QDoubleSpinBox()
        self.record_retain_days.setRange(0, 365)
        self.record_retain_days.setDecimals(1)
        self.record_retain_days.setSingleStep(0.5)
        self.record_retain_days.setValue(record_config.get('retain', {}).get('days', 0))
        self.record_retain_days.setSuffix(" days")
        self.record_retain_days.setToolTip(
            "Number of days to retain continuous recordings.\n"
            "Set to 0 to only keep event recordings.\n"
            "Supports decimals (e.g., 0.5 for 12 hours)"
        )
        retain_layout.addRow("Retain Period:", self.record_retain_days)

        # Retain mode
        self.record_retain_mode = QComboBox()
        self.record_retain_mode.addItems(['all', 'motion', 'active_objects'])
        self.record_retain_mode.setCurrentText(record_config.get('retain', {}).get('mode', 'all'))
        self.record_retain_mode.setToolTip(
            "Recording retention mode:\n"
            "- all: Keep all recordings for the retention period\n"
            "- motion: Only keep segments with motion\n"
            "- active_objects: Only keep segments with active objects"
        )
        retain_layout.addRow("Retain Mode:", self.record_retain_mode)

        layout.addRow("Continuous Recording:", retain_group)

        # Event recording settings
        event_group = QFrame()
        event_layout = QFormLayout(event_group)

        # Event retain days
        self.event_retain_days = QDoubleSpinBox()
        self.event_retain_days.setRange(0, 365)
        self.event_retain_days.setDecimals(1)
        self.event_retain_days.setSingleStep(0.5)
        self.event_retain_days.setValue(record_config.get('events', {}).get('retain', {}).get('default', 10))
        self.event_retain_days.setSuffix(" days")
        self.event_retain_days.setToolTip(
            "Number of days to retain event recordings.\n"
            "Supports decimals (e.g., 0.5 for 12 hours)"
        )
        event_layout.addRow("Event Retain Period:", self.event_retain_days)

        # Event retain mode
        self.event_retain_mode = QComboBox()
        self.event_retain_mode.addItems(['all', 'motion', 'active_objects'])
        self.event_retain_mode.setCurrentText(
            record_config.get('events', {}).get('retain', {}).get('mode', 'active_objects')
        )
        self.event_retain_mode.setToolTip(
            "Event recording retention mode:\n"
            "- all: Keep all segments during events\n"
            "- motion: Keep segments with motion during events\n"
            "- active_objects: Keep segments with active objects"
        )
        event_layout.addRow("Event Retain Mode:", self.event_retain_mode)

        layout.addRow("Event Recording:", event_group)

        # Advanced settings
        advanced_group = QFrame()
        advanced_layout = QFormLayout(advanced_group)

        # Sync recordings
        self.record_sync = QCheckBox()
        self.record_sync.setChecked(record_config.get('sync_recordings', False))
        self.record_sync.setToolTip(
            "Enable recording sync with disk.\n"
            "WARNING: Uses considerable CPU resources.\n"
            "Only enable when necessary."
        )
        advanced_layout.addRow("Sync Recordings:", self.record_sync)

        # Timelapse args
        self.timelapse_args = QLineEdit()
        self.timelapse_args.setText(record_config.get('export', {}).get('timelapse_args', ''))
        self.timelapse_args.setPlaceholderText("-vf setpts=PTS/25 -r 30")
        self.timelapse_args.setToolTip(
            "FFmpeg arguments for timelapse export.\n"
            "Default: 25x speed-up with 30 FPS\n"
            "Example: -vf setpts=PTS/60 -r 25 for 60x speed"
        )
        advanced_layout.addRow("Timelapse Args:", self.timelapse_args)

        layout.addRow("Advanced Settings:", advanced_group)

        # Add a note about storage
        note = QLabel("💡 Note: Recordings are stored at /media/frigate/recordings in UTC time")
        note.setStyleSheet("color: #666; font-style: italic;")
        layout.addRow(note)

        return group

    def create_onvif_section(self, config: Dict) -> QFrame:
        """Create the ONVIF configuration section."""
        group = QFrame()
        layout = QFormLayout(group)

        # Get ONVIF config
        onvif_config = config.get('onvif', {})

        # Host
        self.onvif_host = QLineEdit()
        self.onvif_host.setText(onvif_config.get('host', ''))
        self.onvif_host.setPlaceholderText("0.0.0.0")
        self.onvif_host.setToolTip(
            "Required: Host/IP address of the camera for ONVIF connection.\n"
            "Example: 192.168.1.100"
        )
        layout.addRow("ONVIF Host*:", self.onvif_host)

        # Port
        self.onvif_port = QSpinBox()
        self.onvif_port.setRange(1, 65535)
        self.onvif_port.setValue(onvif_config.get('port', 8000))
        self.onvif_port.setToolTip(
            "Optional: ONVIF port for the camera.\n"
            "Default: 8000"
        )
        layout.addRow("ONVIF Port:", self.onvif_port)

        # Username
        self.onvif_username = QLineEdit()
        self.onvif_username.setText(onvif_config.get('user', ''))
        self.onvif_username.setPlaceholderText("admin")
        self.onvif_username.setToolTip(
            "Optional: Username for ONVIF login.\n"
            "Note: Some devices require admin access for ONVIF."
        )
        layout.addRow("Username:", self.onvif_username)

        # Password
        self.onvif_password = QLineEdit()
        self.onvif_password.setText(onvif_config.get('password', ''))
        self.onvif_password.setPlaceholderText("admin")
        self.onvif_password.setEchoMode(QLineEdit.EchoMode.Password)
        self.onvif_password.setToolTip(
            "Optional: Password for ONVIF login."
        )
        layout.addRow("Password:", self.onvif_password)

        # Add a note about ONVIF requirements
        note = QLabel("💡 Note: ONVIF settings are required for autotracking")
        note.setStyleSheet("color: #666; font-style: italic;")
        layout.addRow(note)

        return group

    def create_autotracking_section(self, config: Dict) -> QFrame:
        """Create the autotracking configuration section."""
        group = QFrame()
        layout = QFormLayout(group)

        # Get autotracking config
        onvif_config = config.get('onvif', {})
        autotrack_config = onvif_config.get('autotracking', {})

        # Enable autotracking
        self.autotrack_enabled = QCheckBox()
        self.autotrack_enabled.setChecked(autotrack_config.get('enabled', False))
        self.autotrack_enabled.setToolTip(
            "Enable/disable object autotracking.\n"
            "Requires an ONVIF-capable PTZ camera that supports relative movement."
        )
        layout.addRow("Enable Autotracking:", self.autotrack_enabled)

        # Calibrate on startup
        self.calibrate_startup = QCheckBox()
        self.calibrate_startup.setChecked(autotrack_config.get('calibrate_on_startup', False))
        self.calibrate_startup.setToolTip(
            "Calibrate the camera on startup.\n"
            "A calibration will move the PTZ in increments and measure movement time.\n"
            "The results help estimate tracked object positions after camera moves.\n"
            "Set to False after first calibration to preserve movement weights."
        )
        layout.addRow("Calibrate on Startup:", self.calibrate_startup)

        # Zooming mode
        self.zoom_mode = QComboBox()
        self.zoom_mode.addItems(['disabled', 'absolute', 'relative'])
        self.zoom_mode.setCurrentText(autotrack_config.get('zooming', 'disabled'))
        self.zoom_mode.setToolTip(
            "Zooming mode for autotracking:\n"
            "- disabled: pan/tilt only, no zoom\n"
            "- absolute: separate zoom movements (most cameras)\n"
            "- relative: concurrent pan/tilt/zoom (some cameras)"
        )
        layout.addRow("Zooming Mode:", self.zoom_mode)

        # Zoom factor
        self.zoom_factor = QDoubleSpinBox()
        self.zoom_factor.setRange(0.1, 0.75)
        self.zoom_factor.setSingleStep(0.05)
        self.zoom_factor.setValue(autotrack_config.get('zoom_factor', 0.3))
        self.zoom_factor.setToolTip(
            "Zoom factor for autotracking (0.1 to 0.75).\n"
            "Lower: more scene visible around tracked object\n"
            "Higher: more zoom on object (may lose tracking)\n"
            "Default 0.3 is recommended for most cases"
        )
        layout.addRow("Zoom Factor:", self.zoom_factor)

        # Objects to track
        self.track_objects = QWidget()
        track_layout = QHBoxLayout(self.track_objects)
        track_layout.setContentsMargins(0, 0, 0, 0)

        self.track_person = QCheckBox("person")
        self.track_vehicle = QCheckBox("vehicle")
        self.track_animal = QCheckBox("animal")

        track_objects = autotrack_config.get('track', ['person'])
        self.track_person.setChecked('person' in track_objects)
        self.track_vehicle.setChecked('vehicle' in track_objects)
        self.track_animal.setChecked('animal' in track_objects)

        track_layout.addWidget(self.track_person)
        track_layout.addWidget(self.track_vehicle)
        track_layout.addWidget(self.track_animal)
        track_layout.addStretch()

        track_label = QLabel("Objects to Track:")
        track_label.setToolTip("Select which types of objects to autotrack")
        layout.addRow(track_label, self.track_objects)

        # Return preset
        self.return_preset = QLineEdit()
        self.return_preset.setText(autotrack_config.get('return_preset', 'home'))
        self.return_preset.setPlaceholderText("home")
        self.return_preset.setToolTip(
            "Name of ONVIF preset to return to when tracking ends.\n"
            "Must be configured in your camera's firmware."
        )
        layout.addRow("Return Preset*:", self.return_preset)

        # Timeout
        self.timeout = QSpinBox()
        self.timeout.setRange(1, 300)
        self.timeout.setValue(autotrack_config.get('timeout', 10))
        self.timeout.setSuffix(" seconds")
        self.timeout.setToolTip(
            "Seconds to delay before returning to preset position\n"
            "after tracking has ended."
        )
        layout.addRow("Return Timeout:", self.timeout)

        # Add a note about ONVIF requirements
        note = QLabel("💡 Note: Requires ONVIF-capable PTZ camera with relative movement support")
        note.setStyleSheet("color: #666; font-style: italic;")
        layout.addRow(note)

        return group

    def update_config(self):
        """Update the configuration with the current values from the GUI."""
        if not self.name_edit.text():
            return

        # Collect selected roles
        roles = []
        if self.role_detect.isChecked():
            roles.append('detect')
        if self.role_record.isChecked():
            roles.append('record')
        if self.role_audio.isChecked():
            roles.append('audio')

        # Basic required configuration
        config = {
            'ffmpeg': {
                'inputs': [{
                    'path': self.rtsp_input.text(),
                    'roles': roles
                }]
            }
        }

        # Add recording configuration if enabled
        if self.record_enabled.isChecked():
            record_config = {
                'enabled': True,
                'retain': {
                    'days': self.record_retain_days.value(),
                    'mode': self.record_retain_mode.currentText()
                },
                'events': {
                    'retain': {
                        'default': self.event_retain_days.value(),
                        'mode': self.event_retain_mode.currentText()
                    }
                },
                'sync_recordings': self.record_sync.isChecked()
            }

            # Add timelapse args if provided
            if self.timelapse_args.text():
                record_config['export'] = {
                    'timelapse_args': self.timelapse_args.text()
                }

            config['record'] = record_config

        # Add ONVIF configuration
        onvif_config = {}
        
        # Add ONVIF host if provided
        if self.onvif_host.text():
            onvif_config.update({
                'host': self.onvif_host.text(),
                'port': self.onvif_port.value(),
                'user': self.onvif_username.text(),
                'password': self.onvif_password.text()
            })

        # Add autotracking configuration if enabled
        if self.autotrack_enabled.isChecked():
            # Validate ONVIF host when autotracking is enabled
            if not self.onvif_host.text():
                QMessageBox.warning(
                    self,
                    "Required Field Missing",
                    "ONVIF Host is required when autotracking is enabled."
                )
                return

            # Collect tracked objects
            track_objects = []
            if self.track_person.isChecked():
                track_objects.append('person')
            if self.track_vehicle.isChecked():
                track_objects.append('vehicle')
            if self.track_animal.isChecked():
                track_objects.append('animal')

            # Validate return preset
            if not self.return_preset.text():
                QMessageBox.warning(
                    self,
                    "Required Field Missing",
                    "Return Preset is required when autotracking is enabled."
                )
                return

            onvif_config['autotracking'] = {
                'enabled': True,
                'calibrate_on_startup': self.calibrate_startup.isChecked(),
                'zooming': self.zoom_mode.currentText(),
                'zoom_factor': self.zoom_factor.value(),
                'track': track_objects,
                'return_preset': self.return_preset.text(),
                'timeout': self.timeout.value()
            }

        # Add ONVIF config to main config if any settings are present
        if onvif_config:
            config['onvif'] = onvif_config

        # Validate required fields
        if not config['ffmpeg']['inputs'][0]['path']:
            QMessageBox.warning(
                self,
                "Required Field Missing",
                "RTSP Stream URL is required."
            )
            return

        if not roles:
            QMessageBox.warning(
                self,
                "Required Field Missing",
                "At least one stream role must be selected."
            )
            return

        try:
            self.config_manager.update_camera(self.name_edit.text(), config)
        except Exception as e:
            QMessageBox.warning(
                self,
                "Configuration Error",
                f"Failed to update camera configuration:\n{str(e)}"
            )
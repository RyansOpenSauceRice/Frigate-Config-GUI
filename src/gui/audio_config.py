from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QFormLayout, QCheckBox,
    QSpinBox, QGroupBox, QLabel, QDoubleSpinBox,
    QListWidget, QListWidgetItem, QHBoxLayout,
    QPushButton
)
from PyQt6.QtCore import Qt

class AudioConfigWidget(QWidget):
    def __init__(self, config_manager):
        super().__init__()
        self.config_manager = config_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)

        # Main group box
        group_box = QGroupBox("Audio Detection Configuration")
        form = QFormLayout()

        # Enable/Disable audio detection
        self.enabled = QCheckBox()
        self.enabled.setToolTip(
            "Enable or disable audio event detection.\n"
            "When enabled, Frigate will detect various audio events\n"
            "like barks, screams, and fire alarms."
        )
        form.addRow("Enable Audio Detection:", self.enabled)

        # Basic Settings Group
        basic_group = QGroupBox("Basic Settings")
        basic_layout = QFormLayout()

        # Max not heard setting
        self.max_not_heard = QSpinBox()
        self.max_not_heard.setRange(1, 300)
        self.max_not_heard.setValue(30)
        self.max_not_heard.setSuffix(" seconds")
        self.max_not_heard.setToolTip(
            "Number of seconds without detected audio to end the event.\n"
            "Default: 30 seconds"
        )
        basic_layout.addRow("Max Not Heard:", self.max_not_heard)

        # Min volume setting
        self.min_volume = QSpinBox()
        self.min_volume.setRange(0, 2000)
        self.min_volume.setValue(500)
        self.min_volume.setToolTip(
            "Minimum RMS volume required to run audio detection.\n"
            "Rule of thumb:\n"
            "- 200: high sensitivity\n"
            "- 500: medium sensitivity (default)\n"
            "- 1000: low sensitivity"
        )
        basic_layout.addRow("Min Volume:", self.min_volume)

        basic_group.setLayout(basic_layout)
        form.addRow(basic_group)

        # Audio Events Group
        events_group = QGroupBox("Audio Events")
        events_layout = QVBoxLayout()

        # Available events list
        self.events_list = QListWidget()
        self.events_list.setSelectionMode(QListWidget.SelectionMode.MultiSelection)
        
        # Add available events
        available_events = [
            ("bark", "Dog barking detection"),
            ("fire_alarm", "Fire/smoke alarm sounds"),
            ("scream", "Human screaming"),
            ("speech", "Human speech"),
            ("yell", "Human yelling")
        ]
        
        for event, description in available_events:
            item = QListWidgetItem(event)
            item.setToolTip(description)
            item.setFlags(item.flags() | Qt.ItemFlag.ItemIsUserCheckable)
            item.setCheckState(Qt.CheckState.Unchecked)
            self.events_list.addItem(item)

        events_layout.addWidget(QLabel("Select audio events to detect:"))
        events_layout.addWidget(self.events_list)
        events_group.setLayout(events_layout)
        form.addRow(events_group)

        # Thresholds Group
        thresholds_group = QGroupBox("Detection Thresholds")
        thresholds_layout = QFormLayout()

        self.thresholds = {}
        for event, _ in available_events:
            threshold = QDoubleSpinBox()
            threshold.setRange(0.1, 1.0)
            threshold.setSingleStep(0.1)
            threshold.setValue(0.8)
            threshold.setToolTip(
                f"Minimum score (0.1-1.0) that triggers a {event} event.\n"
                "Higher values mean more confident detections but might miss some events.\n"
                "Default: 0.8"
            )
            self.thresholds[event] = threshold
            thresholds_layout.addRow(f"{event} threshold:", threshold)

        thresholds_group.setLayout(thresholds_layout)
        form.addRow(thresholds_group)

        # Add form to group box
        group_box.setLayout(form)
        layout.addWidget(group_box)

        # Add a note about audio detection
        note = QLabel(
            "💡 Note: Audio detection requires a camera stream with audio enabled.\n"
            "Make sure to enable the 'audio' role in your camera's RTSP stream configuration."
        )
        note.setStyleSheet("color: #666; font-style: italic;")
        layout.addWidget(note)

        # Connect signals
        self.enabled.stateChanged.connect(self.update_config)
        self.max_not_heard.valueChanged.connect(self.update_config)
        self.min_volume.valueChanged.connect(self.update_config)
        self.events_list.itemChanged.connect(self.update_config)
        for threshold in self.thresholds.values():
            threshold.valueChanged.connect(self.update_config)

    def update_config(self):
        """Update the configuration with current values."""
        config = {
            'audio': {
                'enabled': self.enabled.isChecked(),
                'max_not_heard': self.max_not_heard.value(),
                'min_volume': self.min_volume.value(),
                'listen': [],
                'filters': {}
            }
        }

        # Collect selected events
        for i in range(self.events_list.count()):
            item = self.events_list.item(i)
            if item.checkState() == Qt.CheckState.Checked:
                event_name = item.text()
                config['audio']['listen'].append(event_name)
                # Add threshold for selected event
                config['audio']['filters'][event_name] = {
                    'threshold': self.thresholds[event_name].value()
                }

        try:
            # Update the configuration
            if 'audio' not in self.config_manager._current_config:
                self.config_manager._current_config['audio'] = {}
            self.config_manager._current_config['audio'].update(config['audio'])
        except Exception as e:
            print(f"Error updating audio configuration: {e}")

    def load_config(self, config):
        """Load configuration values into the UI."""
        if not config or 'audio' not in config:
            return

        audio_config = config['audio']
        self.enabled.setChecked(audio_config.get('enabled', False))
        self.max_not_heard.setValue(audio_config.get('max_not_heard', 30))
        self.min_volume.setValue(audio_config.get('min_volume', 500))

        # Load selected events
        enabled_events = audio_config.get('listen', [])
        for i in range(self.events_list.count()):
            item = self.events_list.item(i)
            item.setCheckState(
                Qt.CheckState.Checked if item.text() in enabled_events
                else Qt.CheckState.Unchecked
            )

        # Load thresholds
        filters = audio_config.get('filters', {})
        for event, threshold in self.thresholds.items():
            if event in filters:
                threshold.setValue(filters[event].get('threshold', 0.8))
from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout,
    QLineEdit, QSpinBox, QCheckBox, QGroupBox,
    QFormLayout
)
from PyQt6.QtCore import Qt
from .utils import create_label

class MQTTConfigWidget(QWidget):
    def __init__(self, config_manager):
        super().__init__()
        self.config_manager = config_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)

        # Create MQTT connection group
        connection_group = QGroupBox("MQTT Connection")
        connection_layout = QFormLayout()

        # Host field (required when MQTT is used)
        self.host_input = QLineEdit()
        self.host_input.setPlaceholderText("mqtt.example.com")
        connection_layout.addRow(create_label("Host", required=True), self.host_input)

        # Port field (optional, has default)
        self.port_input = QSpinBox()
        self.port_input.setRange(1, 65535)
        self.port_input.setValue(1883)
        connection_layout.addRow(create_label("Port"), self.port_input)

        # Topic prefix field (optional, has default)
        self.topic_prefix_input = QLineEdit()
        self.topic_prefix_input.setPlaceholderText("frigate")
        connection_layout.addRow(create_label("Topic Prefix"), self.topic_prefix_input)

        # Client ID field (optional, has default)
        self.client_id_input = QLineEdit()
        self.client_id_input.setPlaceholderText("frigate")
        connection_layout.addRow(create_label("Client ID"), self.client_id_input)

        # User field (optional)
        self.user_input = QLineEdit()
        connection_layout.addRow(create_label("Username"), self.user_input)

        # Password field (required if username is set)
        self.password_input = QLineEdit()
        self.password_input.setEchoMode(QLineEdit.EchoMode.Password)
        connection_layout.addRow(create_label("Password"), self.password_input)

        # TLS options (optional)
        self.tls_enabled = QCheckBox("Enable TLS")
        connection_layout.addRow(create_label("TLS"), self.tls_enabled)

        # TLS verify (optional, has default)
        self.tls_verify = QCheckBox("Verify TLS Certificate")
        self.tls_verify.setChecked(True)
        connection_layout.addRow(create_label("TLS Verify"), self.tls_verify)

        # TLS CA Certs field (required if TLS verify is enabled)
        self.tls_ca_certs_input = QLineEdit()
        self.tls_ca_certs_input.setPlaceholderText("/etc/ssl/certs/ca-certificates.crt")
        connection_layout.addRow(create_label("TLS CA Certs"), self.tls_ca_certs_input)

        # MQTT stats interval (optional, has default)
        self.stats_interval_input = QSpinBox()
        self.stats_interval_input.setRange(0, 3600)
        self.stats_interval_input.setValue(60)
        self.stats_interval_input.setSuffix(" seconds")
        connection_layout.addRow(create_label("Stats Interval"), self.stats_interval_input)

        connection_group.setLayout(connection_layout)
        layout.addWidget(connection_group)

        # Add stretch to push everything to the top
        layout.addStretch()

        # Connect signals
        self.host_input.textChanged.connect(self.update_config)
        self.port_input.valueChanged.connect(self.update_config)
        self.topic_prefix_input.textChanged.connect(self.update_config)
        self.client_id_input.textChanged.connect(self.update_config)
        self.user_input.textChanged.connect(self.update_config)
        self.password_input.textChanged.connect(self.update_config)
        self.tls_enabled.stateChanged.connect(self.update_config)
        self.tls_verify.stateChanged.connect(self.update_config)
        self.tls_ca_certs_input.textChanged.connect(self.update_config)
        self.stats_interval_input.valueChanged.connect(self.update_config)

    def update_ui_from_config(self):
        config = self.config_manager.get_config()
        if not config:
            return

        mqtt_config = config.get('mqtt', {})
        self.host_input.setText(mqtt_config.get('host', ''))
        self.port_input.setValue(mqtt_config.get('port', 1883))
        self.topic_prefix_input.setText(mqtt_config.get('topic_prefix', 'frigate'))
        self.client_id_input.setText(mqtt_config.get('client_id', 'frigate'))
        self.user_input.setText(mqtt_config.get('user', ''))
        self.password_input.setText(mqtt_config.get('password', ''))
        
        tls_config = mqtt_config.get('tls', {})
        self.tls_enabled.setChecked(bool(tls_config))
        self.tls_verify.setChecked(tls_config.get('verify', True) if tls_config else True)
        self.tls_ca_certs_input.setText(tls_config.get('ca_certs', '') if tls_config else '')

        self.stats_interval_input.setValue(mqtt_config.get('stats_interval', 60))

    def update_config(self):
        mqtt_config = {}
        
        # Only add non-empty values
        if self.host_input.text():
            mqtt_config['host'] = self.host_input.text()
        
        if self.port_input.value() != 1883:
            mqtt_config['port'] = self.port_input.value()
        
        if self.topic_prefix_input.text() and self.topic_prefix_input.text() != 'frigate':
            mqtt_config['topic_prefix'] = self.topic_prefix_input.text()
        
        if self.client_id_input.text() and self.client_id_input.text() != 'frigate':
            mqtt_config['client_id'] = self.client_id_input.text()
        
        if self.user_input.text():
            mqtt_config['user'] = self.user_input.text()
        
        if self.password_input.text():
            mqtt_config['password'] = self.password_input.text()

        # Add TLS config if enabled
        if self.tls_enabled.isChecked():
            tls_config = {}
            if not self.tls_verify.isChecked():
                tls_config['verify'] = False
            if self.tls_ca_certs_input.text():
                tls_config['ca_certs'] = self.tls_ca_certs_input.text()
            if tls_config:
                mqtt_config['tls'] = tls_config

        # Add stats interval if different from default
        if self.stats_interval_input.value() != 60:
            mqtt_config['stats_interval'] = self.stats_interval_input.value()

        # Update the config only if we have MQTT settings
        if mqtt_config:
            config = self.config_manager.get_config() or {}
            config['mqtt'] = mqtt_config
            self.config_manager.update_config(config)
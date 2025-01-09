from PyQt6.QtWidgets import (
    QWidget, QVBoxLayout, QFormLayout, QCheckBox,
    QLabel, QFrame, QSpinBox, QComboBox, QLineEdit,
    QGroupBox
)
from PyQt6.QtCore import Qt

class SemanticSearchWidget(QWidget):
    def __init__(self, config_manager):
        super().__init__()
        self.config_manager = config_manager
        self.init_ui()

    def init_ui(self):
        layout = QVBoxLayout(self)

        # Main group box
        group_box = QGroupBox("Semantic Search Configuration")
        form = QFormLayout()

        # Enable/Disable semantic search
        self.enabled = QCheckBox()
        self.enabled.setToolTip(
            "Enable or disable semantic search functionality.\n"
            "When enabled, Frigate will generate embeddings for events\n"
            "allowing natural language search."
        )
        form.addRow("Enable Semantic Search:", self.enabled)

        # Model selection
        self.model = QComboBox()
        self.model.addItems([
            "all-MiniLM-L6-v2",  # Default model
            "all-mpnet-base-v2",
            "multi-qa-MiniLM-L6-cos-v1"
        ])
        self.model.setToolTip(
            "Select the model to use for generating embeddings.\n"
            "Default: all-MiniLM-L6-v2\n"
            "Other options may provide better results at the cost of performance."
        )
        form.addRow("Model:", self.model)

        # Provider selection
        self.provider = QComboBox()
        self.provider.addItems([
            "transformers",  # Default
            "openai"
        ])
        self.provider.setToolTip(
            "Select the provider for the embedding model.\n"
            "transformers: Uses local CPU/GPU\n"
            "openai: Uses OpenAI's API (requires API key)"
        )
        form.addRow("Provider:", self.provider)

        # OpenAI settings group
        openai_group = QGroupBox("OpenAI Settings")
        openai_layout = QFormLayout()

        self.api_key = QLineEdit()
        self.api_key.setPlaceholderText("sk-...")
        self.api_key.setEchoMode(QLineEdit.EchoMode.Password)
        self.api_key.setToolTip("Your OpenAI API key (required if using OpenAI provider)")
        openai_layout.addRow("API Key:", self.api_key)

        self.model_name = QLineEdit()
        self.model_name.setPlaceholderText("text-embedding-ada-002")
        self.model_name.setToolTip("OpenAI model name to use for embeddings")
        openai_layout.addRow("Model Name:", self.model_name)

        openai_group.setLayout(openai_layout)
        form.addRow(openai_group)

        # Advanced settings group
        advanced_group = QGroupBox("Advanced Settings")
        advanced_layout = QFormLayout()

        self.batch_size = QSpinBox()
        self.batch_size.setRange(1, 100)
        self.batch_size.setValue(50)  # Default value
        self.batch_size.setToolTip(
            "Number of events to process in each batch.\n"
            "Higher values may be faster but use more memory."
        )
        advanced_layout.addRow("Batch Size:", self.batch_size)

        self.refresh_interval = QSpinBox()
        self.refresh_interval.setRange(0, 3600)
        self.refresh_interval.setValue(60)  # Default value
        self.refresh_interval.setSuffix(" seconds")
        self.refresh_interval.setToolTip(
            "How often to check for new events to process.\n"
            "0 to disable automatic processing."
        )
        advanced_layout.addRow("Refresh Interval:", self.refresh_interval)

        advanced_group.setLayout(advanced_layout)
        form.addRow(advanced_group)

        group_box.setLayout(form)
        layout.addWidget(group_box)
        layout.addStretch()

        # Connect signals
        self.enabled.stateChanged.connect(self.update_config)
        self.model.currentTextChanged.connect(self.update_config)
        self.provider.currentTextChanged.connect(self.update_config)
        self.api_key.textChanged.connect(self.update_config)
        self.model_name.textChanged.connect(self.update_config)
        self.batch_size.valueChanged.connect(self.update_config)
        self.refresh_interval.valueChanged.connect(self.update_config)

        # Update provider visibility
        self.provider.currentTextChanged.connect(self.update_openai_visibility)
        self.update_openai_visibility(self.provider.currentText())

    def update_openai_visibility(self, provider):
        """Show/hide OpenAI settings based on selected provider."""
        openai_visible = provider.lower() == "openai"
        for i in range(self.layout().count()):
            widget = self.layout().itemAt(i).widget()
            if isinstance(widget, QGroupBox) and widget.title() == "OpenAI Settings":
                widget.setVisible(openai_visible)

    def update_config(self):
        """Update the configuration with current values."""
        config = {
            'semantic_search': {
                'enabled': self.enabled.isChecked(),
                'model': self.model.currentText(),
                'provider': self.provider.currentText().lower(),
                'batch_size': self.batch_size.value(),
                'refresh_interval': self.refresh_interval.value()
            }
        }

        # Add OpenAI settings if using OpenAI provider
        if self.provider.currentText().lower() == "openai":
            config['semantic_search']['openai'] = {
                'api_key': self.api_key.text(),
                'model': self.model_name.text() or "text-embedding-ada-002"
            }

        try:
            # Update the configuration
            if 'semantic_search' not in self.config_manager._current_config:
                self.config_manager._current_config['semantic_search'] = {}
            self.config_manager._current_config['semantic_search'].update(config['semantic_search'])
        except Exception as e:
            print(f"Error updating semantic search configuration: {e}")

    def load_config(self, config):
        """Load configuration values into the UI."""
        if not config or 'semantic_search' not in config:
            return

        semantic_config = config['semantic_search']
        self.enabled.setChecked(semantic_config.get('enabled', False))
        
        model = semantic_config.get('model', 'all-MiniLM-L6-v2')
        index = self.model.findText(model)
        if index >= 0:
            self.model.setCurrentIndex(index)

        provider = semantic_config.get('provider', 'transformers')
        index = self.provider.findText(provider)
        if index >= 0:
            self.provider.setCurrentIndex(index)

        self.batch_size.setValue(semantic_config.get('batch_size', 50))
        self.refresh_interval.setValue(semantic_config.get('refresh_interval', 60))

        if 'openai' in semantic_config:
            openai_config = semantic_config['openai']
            self.api_key.setText(openai_config.get('api_key', ''))
            self.model_name.setText(openai_config.get('model', 'text-embedding-ada-002'))
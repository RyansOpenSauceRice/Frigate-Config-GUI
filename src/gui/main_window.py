from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout,
    QPushButton, QFileDialog, QMessageBox, QTabWidget
)
from PyQt6.QtCore import Qt
from ..config.config_manager import FrigateConfigManager
from ..config.schema_validator import validate_config
from .camera_config import CameraConfigWidget
from .semantic_search import SemanticSearchWidget
from .audio_config import AudioConfigWidget

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.config_manager = FrigateConfigManager()
        self.init_ui()

    def init_ui(self):
        self.setWindowTitle('Frigate Config GUI')
        self.setMinimumSize(800, 600)

        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)

        # Create toolbar
        toolbar = QHBoxLayout()
        layout.addLayout(toolbar)

        # Add toolbar buttons
        import_btn = QPushButton('Import Config')
        export_btn = QPushButton('Export Config')
        validate_btn = QPushButton('Validate Config')

        import_btn.clicked.connect(self.import_config)
        export_btn.clicked.connect(self.export_config)
        validate_btn.clicked.connect(self.validate_current_config)

        toolbar.addWidget(import_btn)
        toolbar.addWidget(export_btn)
        toolbar.addWidget(validate_btn)
        toolbar.addStretch()

        # Create tab widget
        self.tab_widget = QTabWidget()
        layout.addWidget(self.tab_widget)

        # Add camera configuration tab
        self.camera_config = CameraConfigWidget(self.config_manager)
        self.tab_widget.addTab(self.camera_config, "Cameras")

        # Add semantic search configuration tab
        self.semantic_search = SemanticSearchWidget(self.config_manager)
        self.tab_widget.addTab(self.semantic_search, "Semantic Search")

        # Add audio configuration tab
        self.audio_config = AudioConfigWidget(self.config_manager)
        self.tab_widget.addTab(self.audio_config, "Audio Detection")

    def import_config(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Import Frigate Configuration",
            "",
            "YAML Files (*.yml *.yaml);;All Files (*)"
        )
        if file_path:
            try:
                config = self.config_manager.load_config(file_path)
                is_valid, error = validate_config(config)
                if not is_valid:
                    QMessageBox.warning(
                        self,
                        "Invalid Configuration",
                        f"The imported configuration is invalid:\n{error}"
                    )
                else:
                    self.camera_config.update_ui_from_config()
                    QMessageBox.information(
                        self,
                        "Success",
                        "Configuration imported successfully!"
                    )
            except Exception as e:
                QMessageBox.critical(
                    self,
                    "Error",
                    f"Failed to import configuration:\n{str(e)}"
                )

    def export_config(self):
        if not self.config_manager._current_config:
            QMessageBox.warning(
                self,
                "No Configuration",
                "Please import or create a configuration first."
            )
            return

        file_path, _ = QFileDialog.getSaveFileName(
            self,
            "Export Frigate Configuration",
            "",
            "YAML Files (*.yml);;All Files (*)"
        )
        if file_path:
            try:
                self.config_manager.save_config(file_path)
                QMessageBox.information(
                    self,
                    "Success",
                    "Configuration exported successfully!"
                )
            except Exception as e:
                QMessageBox.critical(
                    self,
                    "Error",
                    f"Failed to export configuration:\n{str(e)}"
                )

    def validate_current_config(self):
        if not self.config_manager._current_config:
            QMessageBox.warning(
                self,
                "No Configuration",
                "Please import or create a configuration first."
            )
            return

        is_valid, error = validate_config(self.config_manager._current_config)
        if is_valid:
            QMessageBox.information(
                self,
                "Validation Success",
                "The current configuration is valid!"
            )
        else:
            QMessageBox.warning(
                self,
                "Validation Error",
                f"The current configuration is invalid:\n{error}"
            )
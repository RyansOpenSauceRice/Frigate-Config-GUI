from PyQt6.QtWidgets import QLabel
from PyQt6.QtGui import QColor
from PyQt6.QtCore import Qt

class RequiredFieldLabel(QLabel):
    def __init__(self, text, required=False, parent=None):
        """Create a label with an optional red asterisk for required fields.
        
        Args:
            text (str): The label text
            required (bool): Whether the field is required
            parent (QWidget): Parent widget
        """
        # Remove any existing asterisk to avoid duplicates
        text = text.replace('*', '').strip()
        
        # Add asterisk for required fields
        if required:
            text = f"{text} *"
        
        super().__init__(text, parent)
        
        if required:
            # Create rich text with red asterisk
            plain_text = text[:-2]  # Remove the asterisk
            self.setText(f"{plain_text} <span style='color: red;'>*</span>")

def create_label(text, required=False):
    """Helper function to create a label with optional required field marking.
    
    Args:
        text (str): The label text
        required (bool): Whether the field is required
    
    Returns:
        RequiredFieldLabel: The created label
    """
    return RequiredFieldLabel(text, required)
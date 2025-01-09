from typing import Dict, List, Optional, Union
from pydantic import BaseModel, Field, validator
from enum import Enum

class FFmpegInput(BaseModel):
    path: str
    roles: List[str]
    global_args: Optional[str] = None
    hwaccel_args: Optional[str] = None
    input_args: Optional[str] = None

class FFmpegConfig(BaseModel):
    inputs: List[FFmpegInput]
    global_args: Optional[str] = None
    hwaccel_args: Optional[str] = None
    input_args: Optional[str] = None
    output_args: Optional[Dict[str, str]] = None

class ObjectFilter(BaseModel):
    min_area: Optional[int] = 0
    max_area: Optional[int] = 24000000
    min_ratio: Optional[float] = 0
    max_ratio: Optional[float] = 24000000
    min_score: Optional[float] = 0.5
    threshold: Optional[float] = 0.7
    mask: Optional[str] = None

class ObjectConfig(BaseModel):
    track: List[str] = Field(default_factory=lambda: ["person"])
    filters: Dict[str, ObjectFilter] = Field(default_factory=dict)
    mask: Optional[str] = None

class DetectConfig(BaseModel):
    width: Optional[int] = None
    height: Optional[int] = None
    fps: int = 5
    enabled: bool = True
    min_initialized: Optional[int] = None
    max_disappeared: Optional[int] = None

class SnapshotRetention(BaseModel):
    default: int = 10
    objects: Dict[str, int] = Field(default_factory=dict)

class SnapshotConfig(BaseModel):
    enabled: bool = False
    clean_copy: bool = True
    timestamp: bool = False
    bounding_box: bool = True
    crop: bool = False
    height: Optional[int] = 175
    required_zones: List[str] = Field(default_factory=list)
    retain: SnapshotRetention = Field(default_factory=SnapshotRetention)
    quality: int = 70

class ZoneFilter(BaseModel):
    min_area: Optional[int] = None
    max_area: Optional[int] = None
    threshold: Optional[float] = None

class Zone(BaseModel):
    coordinates: str
    objects: Optional[List[str]] = None
    filters: Dict[str, ZoneFilter] = Field(default_factory=dict)
    inertia: Optional[int] = 3
    loitering_time: Optional[int] = 0

class CameraConfig(BaseModel):
    ffmpeg: FFmpegConfig
    detect: DetectConfig = Field(default_factory=DetectConfig)
    snapshots: SnapshotConfig = Field(default_factory=SnapshotConfig)
    objects: ObjectConfig = Field(default_factory=ObjectConfig)
    zones: Dict[str, Zone] = Field(default_factory=dict)
    enabled: bool = True
    best_image_timeout: int = 60

class OpenAIConfig(BaseModel):
    api_key: str
    model: str = "text-embedding-ada-002"

class SemanticSearchConfig(BaseModel):
    enabled: bool = False
    model: str = "all-MiniLM-L6-v2"
    provider: str = "transformers"
    batch_size: int = 50
    refresh_interval: int = 60
    openai: Optional[OpenAIConfig] = None

    @validator('provider')
    def validate_provider(cls, v):
        if v.lower() not in ['transformers', 'openai']:
            raise ValueError('Provider must be either "transformers" or "openai"')
        return v.lower()

    @validator('openai')
    def validate_openai(cls, v, values):
        if values.get('provider') == 'openai' and not v:
            raise ValueError('OpenAI configuration is required when using OpenAI provider')
        return v

class FrigateConfig(BaseModel):
    cameras: Dict[str, CameraConfig]
    semantic_search: Optional[SemanticSearchConfig] = None

def validate_config(config: Dict) -> tuple[bool, Optional[str]]:
    """
    Validate a Frigate configuration dictionary against the schema.
    
    Args:
        config: Dictionary containing the Frigate configuration
        
    Returns:
        tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    try:
        FrigateConfig(**config)
        return True, None
    except Exception as e:
        return False, str(e)

def get_camera_config_template() -> Dict:
    """
    Get a template for a camera configuration with default values.
    """
    camera = CameraConfig(
        ffmpeg=FFmpegConfig(
            inputs=[
                FFmpegInput(
                    path="rtsp://example.com/stream",
                    roles=["detect", "record"]
                )
            ]
        )
    )
    return camera.dict(exclude_none=True)
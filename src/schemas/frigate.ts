import { z } from 'zod';

// Basic types
const PortNumber = z.number().int().min(1).max(65535);
const NonEmptyString = z.string().min(1);
const Percentage = z.number().min(0).max(100);

// MQTT Configuration
export const MQTTConfig = z.object({
  enabled: z.boolean().default(true),
  host: NonEmptyString,
  port: PortNumber.default(1883),
  topic_prefix: z.string().default('frigate'),
  client_id: z.string().default('frigate'),
  user: z.string().optional(),
  password: z.string().optional(),
  tls_ca_certs: z.string().optional(),
  tls_client_cert: z.string().optional(),
  tls_client_key: z.string().optional(),
  tls_insecure: z.boolean().optional(),
  stats_interval: z.number().int().positive().default(60)
});

// Camera Input Configuration
export const CameraInput = z.object({
  path: NonEmptyString,
  roles: z.array(z.enum(['detect', 'record', 'audio'])),
  global_args: z.string().optional(),
  hwaccel_args: z.string().optional(),
  input_args: z.string().optional()
});

// Camera FFmpeg Configuration
export const CameraFfmpegConfig = z.object({
  inputs: z.array(CameraInput),
  output_args: z.object({
    detect: z.string().optional(),
    record: z.string().optional()
  }).optional(),
  global_args: z.string().optional(),
  hwaccel_args: z.string().optional(),
  input_args: z.string().optional()
});

// Motion Detection Configuration
export const MotionConfig = z.object({
  enabled: z.boolean().default(true),
  threshold: z.number().int().min(1).max(255).default(30),
  contour_area: z.number().int().positive().default(10),
  frame_alpha: z.number().min(0).max(1).default(0.01),
  frame_height: z.number().int().positive().default(100),
  mask: z.string().optional(),
  improve_contrast: z.boolean().default(true)
});

// Object Detection Configuration
export const DetectConfig = z.object({
  enabled: z.boolean().default(true),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  fps: z.number().int().positive().default(5),
  min_initialized: z.number().int().positive().optional(),
  max_disappeared: z.number().int().positive().optional()
});

// Zone Configuration
export const ZoneConfig = z.object({
  coordinates: NonEmptyString,
  objects: z.array(z.string()).optional(),
  inertia: z.number().int().nonnegative().default(3),
  loitering_time: z.number().nonnegative().default(0),
  filters: z.record(z.string(), z.object({
    min_area: z.number().optional(),
    max_area: z.number().optional(),
    threshold: z.number().optional()
  })).optional()
});

// Record Configuration
export const RecordConfig = z.object({
  enabled: z.boolean().default(false),
  retain: z.object({
    days: z.number().int().nonnegative().default(0),
    mode: z.enum(['all', 'motion', 'active_objects']).default('all')
  }).optional(),
  events: z.object({
    pre_capture: z.number().int().nonnegative().default(5),
    post_capture: z.number().int().nonnegative().default(5),
    required_zones: z.array(z.string()).optional(),
    objects: z.array(z.string()).optional()
  }).optional()
});

// Snapshots Configuration
export const SnapshotsConfig = z.object({
  enabled: z.boolean().default(false),
  timestamp: z.boolean().default(false),
  bounding_box: z.boolean().default(true),
  crop: z.boolean().default(false),
  height: z.number().int().positive().optional(),
  retain: z.object({
    default: z.number().int().nonnegative().default(10),
    objects: z.record(z.string(), z.number()).optional()
  }).optional(),
  quality: Percentage.default(70)
});

// Camera Configuration
export const CameraConfig = z.object({
  name: z.string().regex(/^[a-zA-Z0-9_-]+$/),
  enabled: z.boolean().default(true),
  ffmpeg: CameraFfmpegConfig,
  detect: DetectConfig.optional(),
  motion: MotionConfig.optional(),
  zones: z.record(z.string(), ZoneConfig).optional(),
  record: RecordConfig.optional(),
  snapshots: SnapshotsConfig.optional(),
  best_image_timeout: z.number().int().positive().default(60),
  webui_url: z.string().optional()
});

// Main Frigate Configuration
export const FrigateConfig = z.object({
  mqtt: MQTTConfig,
  cameras: z.record(z.string(), CameraConfig),
  detectors: z.record(z.string(), z.object({
    type: z.string(),
    device: z.string().optional()
  })).optional(),
  database: z.object({
    path: z.string().default('/config/frigate.db')
  }).optional()
});

export type FrigateConfigType = z.infer<typeof FrigateConfig>;
export type CameraConfigType = z.infer<typeof CameraConfig>;
export type MQTTConfigType = z.infer<typeof MQTTConfig>;
export type DetectConfigType = z.infer<typeof DetectConfig>;
export type RecordConfigType = z.infer<typeof RecordConfig>;
export type SnapshotsConfigType = z.infer<typeof SnapshotsConfig>;
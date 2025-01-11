import { z } from 'zod';

// Camera configuration schema
export const CameraConfigSchema = z.object({
  ffmpeg: z.object({
    inputs: z.array(z.object({
      path: z.string(),
      roles: z.array(z.string()),
      global_args: z.string().optional(),
      input_args: z.string().optional()
    }))
  }),
  detect: z.object({
    width: z.number(),
    height: z.number(),
    fps: z.number()
  }).optional(),
  objects: z.object({
    track: z.array(z.string())
  }).optional(),
  snapshots: z.object({
    enabled: z.boolean(),
    timestamp: z.boolean().optional(),
    bounding_box: z.boolean().optional()
  }).optional()
});

// MQTT configuration schema
export const MQTTConfigSchema = z.object({
  host: z.string(),
  port: z.number().optional(),
  user: z.string().optional(),
  password: z.string().optional(),
  topic_prefix: z.string().optional(),
  client_id: z.string().optional()
});

// Audio configuration schema
export const AudioConfigSchema = z.object({
  enabled: z.boolean(),
  device: z.string().optional(),
  threshold: z.number().optional(),
  duration: z.number().optional()
});

// Main configuration schema
export const FrigateConfigSchema = z.object({
  mqtt: MQTTConfigSchema.optional(),
  cameras: z.record(CameraConfigSchema),
  audio: AudioConfigSchema.optional()
});

// TypeScript types derived from the schemas
export type CameraConfig = z.infer<typeof CameraConfigSchema>;
export type MQTTConfig = z.infer<typeof MQTTConfigSchema>;
export type AudioConfig = z.infer<typeof AudioConfigSchema>;
export type FrigateConfig = z.infer<typeof FrigateConfigSchema>;
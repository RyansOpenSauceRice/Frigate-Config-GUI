import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import * as Form from '@radix-ui/react-form';
import { Tooltip } from '../../../utils/tooltip';
import { Upload, Play, Pause, Trash2 } from 'lucide-react';

interface Point {
  x: number;
  y: number;
}

interface ZoneVisualEditorProps {
  coordinates: string;
  onChange: (coordinates: string) => void;
  width?: number;
  height?: number;
}

export const ZoneVisualEditor: React.FC<ZoneVisualEditorProps> = ({
  coordinates,
  onChange,
  width = 640,
  height = 360,
}) => {
  const { t } = useTranslation('camera');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);

  // Convert string coordinates to points
  useEffect(() => {
    if (coordinates) {
      const coords = coordinates.split(',').map(Number);
      const newPoints: Point[] = [];
      for (let i = 0; i < coords.length; i += 2) {
        newPoints.push({
          x: coords[i] * width,
          y: coords[i + 1] * height,
        });
      }
      setPoints(newPoints);
    }
  }, [coordinates, width, height]);

  // Convert points to string coordinates
  const updateCoordinates = (newPoints: Point[]) => {
    const coords = newPoints
      .map((p) => [p.x / width, p.y / height])
      .flat()
      .map((n) => n.toFixed(3))
      .join(',');
    onChange(coords);
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setMediaUrl(url);

    if (file.type.startsWith('image/')) {
      setMediaType('image');
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, width, height);
      };
      img.src = url;
    } else if (file.type.startsWith('video/')) {
      setMediaType('video');
      const video = videoRef.current;
      if (video) {
        video.src = url;
        video.onloadedmetadata = () => {
          video.currentTime = 0;
        };
      }
    }
  };

  // Handle video playback
  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Clear media
  const clearMedia = () => {
    if (mediaUrl) {
      URL.revokeObjectURL(mediaUrl);
    }
    setMediaUrl(null);
    setMediaType('none');
    setIsPlaying(false);
  };

  // Canvas event handlers
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newPoints = [...points, { x, y }];
    setPoints(newPoints);
    updateCoordinates(newPoints);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingIndex === null) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, height));

    const newPoints = [...points];
    newPoints[draggingIndex] = { x, y };
    setPoints(newPoints);
    updateCoordinates(newPoints);
  };

  // Draw the zone
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background
    if (mediaType === 'video' && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    }

    // Draw zone
    if (points.length > 0) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => {
        ctx.lineTo(point.x, point.y);
      });
      if (points.length > 2) {
        ctx.closePath();
      }
      ctx.strokeStyle = '#00ff00';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
      ctx.fill();

      // Draw points
      points.forEach((point, index) => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = draggingIndex === index ? '#ff0000' : '#00ff00';
        ctx.fill();
      });
    }
  }, [points, draggingIndex, mediaType, width, height]);

  // Update canvas when video frame changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mediaType !== 'video') return;

    const updateCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, width, height);
    };

    video.addEventListener('timeupdate', updateCanvas);
    return () => video.removeEventListener('timeupdate', updateCanvas);
  }, [mediaType, width, height]);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <Form.Field name="media">
          <Form.Control asChild>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
              id="media-upload"
            />
          </Form.Control>
          <Tooltip content={t('zones.visual.upload')}>
            <label
              htmlFor="media-upload"
              className="p-2 text-primary hover:bg-primary/10 rounded-full cursor-pointer"
            >
              <Upload className="w-5 h-5" />
            </label>
          </Tooltip>
        </Form.Field>

        {mediaType === 'video' && (
          <Tooltip content={isPlaying ? t('zones.visual.pause') : t('zones.visual.play')}>
            <button
              onClick={togglePlayback}
              className="p-2 text-primary hover:bg-primary/10 rounded-full"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </button>
          </Tooltip>
        )}

        {mediaType !== 'none' && (
          <Tooltip content={t('zones.visual.clear')}>
            <button
              onClick={clearMedia}
              className="p-2 text-destructive hover:bg-destructive/10 rounded-full"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </Tooltip>
        )}
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseDown={(e) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            points.forEach((point, index) => {
              const dx = point.x - x;
              const dy = point.y - y;
              if (Math.sqrt(dx * dx + dy * dy) < 10) {
                setDraggingIndex(index);
              }
            });
          }}
          onMouseUp={() => setDraggingIndex(null)}
          className="border rounded-lg cursor-crosshair"
        />

        {mediaType === 'video' && (
          <video
            ref={videoRef}
            width={width}
            height={height}
            className="hidden"
            onEnded={() => setIsPlaying(false)}
          />
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        {t('zones.visual.instructions')}
      </div>
    </div>
  );
};
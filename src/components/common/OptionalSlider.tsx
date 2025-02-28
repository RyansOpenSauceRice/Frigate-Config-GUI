import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Tooltip } from '../../utils/tooltip';
import { X } from 'lucide-react';

interface OptionalSliderProps {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  defaultValue: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  tooltip: string;
  valueFormatter?: (value: number) => string;
}

export const OptionalSlider: React.FC<OptionalSliderProps> = ({
  value,
  onChange,
  defaultValue,
  min,
  max,
  step = 1,
  label,
  tooltip,
  valueFormatter = (v) => v.toString(),
}) => {
  const isCustomValue = value !== undefined;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">{label}</label>
          <Tooltip content={tooltip}>
            <div className="text-muted-foreground">ⓘ</div>
          </Tooltip>
        </div>
        {isCustomValue && (
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="p-1 text-muted-foreground hover:text-foreground rounded-full"
            title="Reset to default"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isCustomValue ? (
        <button
          type="button"
          onClick={() => onChange(defaultValue)}
          className="w-full px-3 py-2 text-sm text-left text-muted-foreground border border-dashed rounded-md hover:bg-accent"
        >
          Using default: {valueFormatter(defaultValue)}
        </button>
      ) : (
        <>
          <Slider.Root
            className="relative flex items-center w-full h-5"
            value={[value]}
            onValueChange={([v]) => onChange(v)}
            max={max}
            min={min}
            step={step}
          >
            <Slider.Track className="relative h-2 grow rounded-full bg-secondary">
              <Slider.Range className="absolute h-full rounded-full bg-primary" />
            </Slider.Track>
            <Slider.Thumb
              className="block w-5 h-5 bg-background border-2 border-primary rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              aria-label={label}
            />
          </Slider.Root>
          <div className="text-sm text-muted-foreground">
            {valueFormatter(value)}
          </div>
        </>
      )}
    </div>
  );
};
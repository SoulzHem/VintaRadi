import React, { useRef, useState, useEffect } from 'react';
import { ThemeConfig } from '../utils/themeConfig';

interface VintageRotaryKnobProps {
  value: number; // 0 to 100 or current frequency
  min: number;
  max: number;
  step: number;
  onChange: (val: number) => void;
  label: string;
  size?: 'sm' | 'md' | 'lg';
  theme: ThemeConfig;
  unit?: string;
}

export const VintageRotaryKnob: React.FC<VintageRotaryKnobProps> = ({
  value,
  min,
  max,
  step,
  onChange,
  label,
  size = 'md',
  theme,
  unit = '',
}) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const startYRef = useRef(0);
  const startValRef = useRef(value);

  // Map value to angle (-135 deg to +135 deg => 270 deg span)
  const percent = (value - min) / (max - min);
  const angle = -135 + percent * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsInteracting(true);
    startYRef.current = e.clientY;
    startValRef.current = value;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isInteracting) return;
    const deltaY = startYRef.current - e.clientY; // drag up = increase, drag down = decrease
    const sensitivity = (max - min) / 200;
    const newVal = startValRef.current + deltaY * sensitivity;
    const clamped = Math.max(min, Math.min(max, newVal));
    const stepped = Math.round(clamped / step) * step;
    onChange(Number(stepped.toFixed(2)));
  };

  const handlePointerUp = () => {
    setIsInteracting(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const dir = e.deltaY < 0 ? 1 : -1;
    const newVal = value + dir * step * 2;
    const clamped = Math.max(min, Math.min(max, newVal));
    onChange(Number(clamped.toFixed(2)));
  };

  const sizeClasses = {
    sm: 'w-11 h-11 sm:w-14 sm:h-14',
    md: 'w-16 h-16 sm:w-24 sm:h-24',
    lg: 'w-24 h-24 sm:w-32 sm:h-32',
  }[size];

  return (
    <div className="flex flex-col items-center select-none">
      {/* Knob Dial Container */}
      <div
        ref={knobRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onWheel={handleWheel}
        className={`relative ${sizeClasses} rounded-full cursor-ns-resize touch-none flex items-center justify-center p-1.5 sm:p-2 group transition-transform active:scale-95`}
      >
        {/* Outer Calibrated Ring Ticks */}
        <div className="absolute inset-0 rounded-full border border-amber-900/30 flex items-center justify-center pointer-events-none">
          {Array.from({ length: 11 }).map((_, i) => {
            const tickAngle = -135 + (i / 10) * 270;
            return (
              <div
                key={i}
                className="absolute w-[1.5px] sm:w-[2px] h-1 sm:h-1.5 bg-amber-600/60"
                style={{
                  transform: `rotate(${tickAngle}deg) translateY(-${size === 'lg' ? 52 : size === 'md' ? 40 : 25}px)`,
                }}
              />
            );
          })}
        </div>

        {/* Heavy Bakelite / Brass Fluted Outer Rim */}
        <div
          className={`w-full h-full rounded-full bg-gradient-to-b ${theme.knobStyle} shadow-[0_6px_16px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_8px_rgba(0,0,0,0.7)] flex items-center justify-center border-2 border-black/40`}
          style={{
            transform: `rotate(${angle}deg)`,
            transition: isInteracting ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {/* Fluting ridges on knob edge */}
          <div className="absolute inset-1 rounded-full border border-white/10" />
          
          {/* Brass Center Cap */}
          <div className="w-1/2 h-1/2 rounded-full bg-gradient-to-br from-amber-400 via-amber-700 to-amber-950 border border-amber-300/40 shadow-inner flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-amber-900/60" />
          </div>

          {/* Rotary Notch Indicator Dot */}
          <div className="absolute top-1.5 w-1.5 h-3 rounded-full bg-amber-300 shadow-[0_0_6px_#f59e0b] -translate-x-1/2 left-1/2" />
        </div>
      </div>

      {/* Label and Value Badge */}
      <span className="mt-1 text-[11px] font-mono-vintage font-bold uppercase tracking-wider text-amber-300/80">
        {label}
      </span>
      <span className="text-[10px] font-sans font-medium text-amber-200/60">
        {typeof value === 'number' ? (Number.isInteger(value) ? value : value.toFixed(1)) : value} {unit}
      </span>
    </div>
  );
};

import React, { useEffect, useRef } from 'react';
import { ThemeConfig } from '../utils/themeConfig';

interface AnalogVuMeterProps {
  level: number; // 0 to 1
  label: string;
  theme: ThemeConfig;
  batterySaver?: boolean;
}

export const AnalogVuMeter: React.FC<AnalogVuMeterProps> = ({ level, label, theme, batterySaver }) => {
  const needleRef = useRef<HTMLDivElement>(null);
  const smoothedLevelRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (batterySaver) {
      // In battery saver, skip high-fps RAF
      if (needleRef.current) {
        const deg = -45 + Math.min(1, Math.max(0, level)) * 90;
        needleRef.current.style.transform = `rotate(${deg}deg)`;
      }
      return;
    }

    const updateNeedle = () => {
      // Ballistic inertia calculation for vintage needle bounce
      const target = Math.max(0, Math.min(1, level));
      const diff = target - smoothedLevelRef.current;
      smoothedLevelRef.current += diff * 0.18; // smooth spring damping

      // Micro needle jitter
      const jitter = (Math.random() - 0.5) * 0.015 * target;
      const finalLevel = Math.max(0, Math.min(1.05, smoothedLevelRef.current + jitter));

      // Map 0 -> -42 deg, 1 -> +42 deg
      const deg = -42 + finalLevel * 84;

      if (needleRef.current) {
        needleRef.current.style.transform = `rotate(${deg}deg)`;
      }

      animFrameRef.current = requestAnimationFrame(updateNeedle);
    };

    animFrameRef.current = requestAnimationFrame(updateNeedle);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [level, batterySaver]);

  return (
    <div className="relative w-36 h-20 sm:w-44 sm:h-24 rounded-t-xl overflow-hidden border border-amber-950/40 shadow-inner bg-[#f4ebd0] dark:bg-[#1a1614] flex flex-col items-center justify-between p-1.5 select-none">
      {/* Background Faceplate Scale */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#faebd7] via-[#efe0c8] to-[#dfcfb4] opacity-95 pointer-events-none" />
      
      {/* Subtle Dial Glass Reflection */}
      <div className="absolute inset-0 glass-reflection z-20 pointer-events-none" />

      {/* Curved Scale Markings SVG */}
      <svg className="absolute inset-0 w-full h-full z-10" viewBox="0 0 160 90">
        {/* Arc Track */}
        <path
          d="M 22 75 A 65 65 0 0 1 138 75"
          fill="none"
          stroke="#4a3728"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Red Overload Zone */}
        <path
          d="M 112 34 A 65 65 0 0 1 138 75"
          fill="none"
          stroke="#b91c1c"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="1 1"
        />
        {/* Scale Ticks */}
        {[-40, -30, -20, -10, -5, 0, 10, 20, 30, 40].map((angle, i) => {
          const rad = ((angle - 90) * Math.PI) / 180;
          const cx = 80;
          const cy = 85;
          const r1 = 65;
          const r2 = angle > 15 ? 56 : 58;
          const x1 = cx + r1 * Math.cos(rad);
          const y1 = cy + r1 * Math.sin(rad);
          const x2 = cx + r2 * Math.cos(rad);
          const y2 = cy + r2 * Math.sin(rad);
          const isRed = angle > 15;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isRed ? '#b91c1c' : '#3d2817'}
              strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
            />
          );
        })}
        {/* Scale Text */}
        <text x="32" y="78" fill="#5c4028" fontSize="6" fontFamily="Share Tech Mono" fontWeight="bold">-20</text>
        <text x="56" y="50" fill="#5c4028" fontSize="6" fontFamily="Share Tech Mono" fontWeight="bold">-7</text>
        <text x="76" y="40" fill="#5c4028" fontSize="6.5" fontFamily="Share Tech Mono" fontWeight="bold">0 dB</text>
        <text x="100" y="50" fill="#b91c1c" fontSize="6" fontFamily="Share Tech Mono" fontWeight="bold">+2</text>
        <text x="122" y="78" fill="#b91c1c" fontSize="6" fontFamily="Share Tech Mono" fontWeight="bold">+3</text>
        <text x="80" y="65" fill="#4a3728" fontSize="6" textAnchor="middle" fontFamily="Playfair Display" fontStyle="italic">VU LEVEL</text>
      </svg>

      {/* The Mechanical Needle */}
      <div className="absolute left-1/2 bottom-0 w-0 h-0 z-15">
        <div
          ref={needleRef}
          className="absolute bottom-0 left-[-1px] w-[2px] h-[64px] sm:h-[76px] origin-bottom transition-transform duration-75 ease-out"
          style={{
            backgroundColor: theme.vuMeterNeedle,
            boxShadow: '0 0 2px rgba(0,0,0,0.5)',
            transform: 'rotate(-42deg)'
          }}
        >
          {/* Needle Pin Cap */}
          <div className="absolute top-0 left-[-1px] w-1 h-3 rounded-full bg-[#1c1917]" />
        </div>
        {/* Pivot Hub */}
        <div className="absolute bottom-[-10px] left-[-12px] w-6 h-6 rounded-full bg-gradient-to-b from-[#4a3525] via-[#24170e] to-[#0c0805] border border-[#7a5538] shadow-md z-20 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#d4af37]" />
        </div>
      </div>

      {/* Meter Label Badge */}
      <div className="absolute bottom-1 right-2 z-25">
        <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#5c4028]">
          {label}
        </span>
      </div>
    </div>
  );
};

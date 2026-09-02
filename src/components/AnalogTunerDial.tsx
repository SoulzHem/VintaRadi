import React, { useRef } from 'react';
import { FrequencyBand, RadioStation, LanguageCode } from '../types';
import { FREQUENCY_RANGES } from '../data/curatedStations';
import { ThemeConfig } from '../utils/themeConfig';
import { getTranslation } from '../i18n/translations';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

interface AnalogTunerDialProps {
  band: FrequencyBand;
  frequency: number;
  onFrequencyChange: (freq: number) => void;
  stations: RadioStation[];
  activeStation: RadioStation | null;
  isTuned: boolean;
  theme: ThemeConfig;
  language?: LanguageCode;
  onSelectStation: (station: RadioStation) => void;
  onScanNext?: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
}

export const AnalogTunerDial: React.FC<AnalogTunerDialProps> = ({
  band,
  frequency,
  onFrequencyChange,
  stations,
  activeStation,
  isTuned,
  theme,
  language = 'tr',
  onSelectStation,
  onScanNext,
  onStepPrev,
  onStepNext,
}) => {
  const scaleRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation((language || 'tr') as LanguageCode, key);

  const range = FREQUENCY_RANGES[band];
  const percent = Math.max(0, Math.min(100, ((frequency - range.min) / (range.max - range.min)) * 100));

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    handlePointerMove(e);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingRef.current || !scaleRef.current) return;
    const rect = scaleRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newPercent = x / rect.width;
    const rawFreq = range.min + newPercent * (range.max - range.min);
    
    // Step quantization
    let quantized = Math.round(rawFreq / range.step) * range.step;
    if (band === 'FM') quantized = Number(quantized.toFixed(1));
    else if (band === 'AM') quantized = Math.round(quantized);
    else quantized = Number(quantized.toFixed(2));

    onFrequencyChange(Math.max(range.min, Math.min(range.max, quantized)));
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Filter stations belonging to current band
  const bandStations = stations.filter((s) => s.band === band);

  // Generate scale ticks
  const generateTicks = () => {
    const ticks: { freq: number; label?: string; isMajor: boolean }[] = [];
    const span = range.max - range.min;
    const numMajor = band === 'AM' ? 10 : band === 'FM' ? 8 : 8;
    const stepMajor = span / numMajor;

    for (let i = 0; i <= numMajor; i++) {
      const f = range.min + i * stepMajor;
      const formatted = band === 'AM' ? Math.round(f).toString() : f.toFixed(1);
      ticks.push({ freq: f, label: formatted, isMajor: true });
    }
    return ticks;
  };

  const ticks = generateTicks();

  return (
    <div className="relative w-full rounded-xl sm:rounded-2xl overflow-hidden border-2 border-[#5c3e28] shadow-[inset_0_3px_12px_rgba(0,0,0,0.9),0_3px_10px_rgba(0,0,0,0.6)] p-2 sm:p-4 select-none transition-colors duration-500">
      {/* Illuminated Dial Glass Backlight */}
      <div
        className={`absolute inset-0 ${theme.dialBackground} transition-all duration-500`}
        style={{
          boxShadow: `inset 0 0 25px ${theme.dialGlowColor}`,
        }}
      />

      {/* Warm Ambient Valve Lamp Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-amber-500/5 to-transparent pointer-events-none animate-tube-glow" />

      {/* Dial Glass Reflection Sheen */}
      <div className="absolute inset-0 glass-reflection pointer-events-none z-30" />

      {/* Top Header: Current Band & Tuner Signal Indicator */}
      <div className="relative z-20 flex items-center justify-between pb-1 sm:pb-2 border-b border-amber-900/40 text-[10px] sm:text-xs font-mono-vintage">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="px-1.5 py-0.5 rounded bg-black/60 border border-amber-800/40 text-amber-300 font-bold tracking-wider text-[9px] sm:text-[11px]">
            {band} BAND
          </span>
          <span className="hidden sm:inline text-amber-200/70 text-[11px]">
            {range.min} - {range.max} {range.unit}
          </span>
        </div>

        {/* Magic Eye / Stereo Tuning Lamp */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[9px] sm:text-[11px] uppercase tracking-wider sm:tracking-widest text-amber-200/80 font-bold truncate">
            {isTuned ? t('signalLocked') : t('scanning')}
          </span>
          <div
            className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 border border-black/80 shrink-0 ${
              isTuned
                ? 'bg-emerald-400 shadow-[0_0_10px_#34d399,inset_0_0_3px_#fff]'
                : 'bg-amber-950/80 shadow-none opacity-40'
            }`}
            title={isTuned ? 'Signal locked' : 'Scan frequency'}
          />
        </div>
      </div>

      {/* Main Analog Frequency Glass Track - Ultra-sleek and compact for mobile */}
      <div
        ref={scaleRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="relative z-20 h-14 sm:h-32 my-1 sm:my-2 cursor-ew-resize touch-none flex flex-col justify-between py-1 sm:py-2 group"
      >
        {/* Horizontal Guide Lines */}
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-amber-700/30 -translate-y-1/2" />
        <div className="absolute top-[28%] left-0 right-0 h-[1px] bg-amber-800/20" />
        <div className="absolute top-[72%] left-0 right-0 h-[1px] bg-amber-800/20" />

        {/* Frequency Numbers & Major Tick Marks */}
        <div className="relative w-full h-4 sm:h-8 flex justify-between items-end px-1 sm:px-2">
          {ticks.map((t, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className={`text-[7.5px] sm:text-xs font-mono-vintage font-bold tracking-tight ${theme.dialScaleColor} drop-shadow`}>
                {t.label}
              </span>
              <div className="w-[1px] sm:w-[1.5px] h-1.5 sm:h-3 bg-amber-500/80 mt-0.5" />
            </div>
          ))}
        </div>

        {/* Station Markers on Dial (Dots representing real stations) */}
        <div className="relative w-full h-3 sm:h-5 px-1 sm:px-2">
          {bandStations.map((st) => {
            const stPercent = ((st.frequency - range.min) / (range.max - range.min)) * 100;
            const isCurrent = activeStation?.id === st.id;
            return (
              <button
                key={st.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStation(st);
                }}
                className="absolute top-0 -translate-x-1/2 flex flex-col items-center group/marker transition-transform hover:scale-125 z-25 cursor-pointer"
                style={{ left: `${Math.max(2, Math.min(98, stPercent))}%` }}
                title={`${st.name} (${st.frequency} ${st.band})`}
              >
                <div
                  className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b] scale-125'
                      : 'bg-amber-600/70 hover:bg-amber-300 hover:shadow-[0_0_5px_#f59e0b]'
                  }`}
                />
                <span className="hidden group-hover/marker:block absolute bottom-3.5 text-[8.5px] font-sans font-semibold bg-black/90 text-amber-200 px-1.5 py-0.5 rounded shadow whitespace-nowrap z-50 pointer-events-none border border-amber-700/50">
                  {st.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Minor Micro Ticks */}
        <div className="relative w-full h-1.5 sm:h-2.5 flex justify-between items-center px-1 sm:px-2 opacity-60">
          {Array.from({ length: 31 }).map((_, idx) => (
            <div
              key={idx}
              className={`w-[1px] bg-amber-400/60 ${idx % 5 === 0 ? 'h-2 sm:h-3 bg-amber-300/90' : 'h-1 sm:h-1.5'}`}
            />
          ))}
        </div>

        {/* The Vintage Glowing Dial Needle */}
        <div
          className="absolute top-0 bottom-0 w-[2px] sm:w-[3px] -translate-x-1/2 pointer-events-none transition-all duration-75 z-40"
          style={{
            left: `${percent}%`,
            backgroundColor: theme.dialNeedleColor,
            boxShadow: `0 0 10px ${theme.dialNeedleColor}, 0 0 3px #ffffff`,
          }}
        >
          {/* Top Indicator Jewel / Arrow */}
          <div
            className="absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rotate-45 border border-white"
            style={{ backgroundColor: theme.dialNeedleColor }}
          />
          {/* Bottom Weight */}
          <div
            className="absolute -bottom-0.5 sm:-bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-black/60 shadow"
            style={{ backgroundColor: theme.dialNeedleColor }}
          />
        </div>
      </div>

      {/* Bottom Sub-Scale: Frequency Readout, SCAN & Step Buttons */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-1 sm:gap-2 pt-1.5 sm:pt-2 border-t border-amber-900/40 text-[10px] sm:text-xs font-mono-vintage">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-amber-400/80">{t('frequencyLabel')}</span>
          <span className="text-xs sm:text-base font-bold text-amber-200 tracking-wider">
            {frequency} <span className="text-[9px] sm:text-[11px] text-amber-400/60">{range.unit}</span>
          </span>
        </div>

        {/* Tactile Retro Tuning Controls: Step Prev, Auto SCAN, Step Next */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {onStepPrev && (
            <button
              type="button"
              onClick={onStepPrev}
              title={t('stepPrev')}
              className="px-2 py-1 rounded-lg bg-black/60 hover:bg-amber-950/80 border border-amber-800/60 hover:border-amber-500 text-amber-300 font-mono font-bold text-[10px] sm:text-xs transition-all flex items-center gap-0.5 cursor-pointer active:scale-95 shadow"
            >
              <ChevronLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden xs:inline">-</span>
            </button>
          )}

          {onScanNext && (
            <button
              type="button"
              onClick={onScanNext}
              title={t('scanNext')}
              className="px-2.5 py-1 sm:px-3 sm:py-1 rounded-lg bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-500 hover:to-amber-400 text-black font-mono-vintage font-black text-[10px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-[0_0_10px_rgba(245,158,11,0.5)] border border-amber-300"
            >
              <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span>{t('scanNextShort')}</span>
            </button>
          )}

          {onStepNext && (
            <button
              type="button"
              onClick={onStepNext}
              title={t('stepNext')}
              className="px-2 py-1 rounded-lg bg-black/60 hover:bg-amber-950/80 border border-amber-800/60 hover:border-amber-500 text-amber-300 font-mono font-bold text-[10px] sm:text-xs transition-all flex items-center gap-0.5 cursor-pointer active:scale-95 shadow"
            >
              <span className="hidden xs:inline">+</span>
              <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}
        </div>

        {activeStation && (
          <div className="flex items-center gap-1.5 sm:gap-2 max-w-[45%] sm:max-w-[50%] truncate">
            <span className="px-1.5 py-0.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-200 text-[8.5px] sm:text-[10px] font-sans truncate">
              📍 {activeStation.country} • {activeStation.genre}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};


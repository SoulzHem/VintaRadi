import React from 'react';
import { EqualizerPresetKey, EqualizerSettings, LanguageCode } from '../types';
import { EQUALIZER_PRESETS } from '../services/audioEngine';
import { ThemeConfig } from '../utils/themeConfig';
import { getTranslation } from '../i18n/translations';
import { Sliders, Flame, Sparkles, Volume2, X, RotateCcw, Check } from 'lucide-react';

interface EqualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  eq: EqualizerSettings;
  onChange: (eq: EqualizerSettings) => void;
  theme: ThemeConfig;
  language?: LanguageCode;
}

export const EqualizerModal: React.FC<EqualizerModalProps> = ({
  isOpen,
  onClose,
  eq,
  onChange,
  theme,
  language = 'tr',
}) => {
  if (!isOpen) return null;

  const validLang: LanguageCode = (['tr', 'en', 'de', 'fr', 'es', 'it'] as LanguageCode[]).includes(language as LanguageCode)
    ? (language as LanguageCode)
    : 'tr';

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(validLang, key);

  const handleBandChange = (key: keyof Pick<EqualizerSettings, 'band60' | 'band250' | 'band1k' | 'band4k' | 'band12k'>, val: number) => {
    onChange({
      ...eq,
      [key]: val,
      preset: 'flat', // custom
    });
  };

  const handleKnobChange = (key: 'tubeSaturation' | 'stereoWidth' | 'bassBoost', val: number) => {
    onChange({
      ...eq,
      [key]: val,
      preset: 'flat',
    });
  };

  const handleSelectPreset = (presetKey: EqualizerPresetKey) => {
    const preset = EQUALIZER_PRESETS[presetKey];
    if (preset) {
      onChange({
        ...preset.settings,
        preset: presetKey,
      });
    }
  };

  const handleReset = () => {
    handleSelectPreset('flat');
  };

  const bands = [
    { key: 'band60' as const, label: '60 Hz', sub: 'Sub-Bas' },
    { key: 'band250' as const, label: '250 Hz', sub: 'Bas Gövde' },
    { key: 'band1k' as const, label: '1 kHz', sub: 'Orta Frekans' },
    { key: 'band4k' as const, label: '4 kHz', sub: 'Vokal / Tiz' },
    { key: 'band12k' as const, label: '12 kHz', sub: 'Hava & Parıltı' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-2xl max-h-[92dvh] sm:max-h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Sticky Vintage Plate Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`p-2 sm:p-2.5 rounded-xl ${theme.accentBadge} shrink-0`}>
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200 leading-tight">
                {t('eqTitle')}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans line-clamp-1">
                {t('eqSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-lg bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-[11px] sm:text-xs font-mono-vintage text-amber-300 flex items-center gap-1 transition-colors cursor-pointer min-h-[36px]"
              title="Varsayılana Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Sıfırla</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/50 border border-amber-900/60 hover:bg-amber-950/80 text-amber-300 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="Kapat"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-4 sm:space-y-5 custom-scrollbar overscroll-contain">
          {/* Quick Presets Grid */}
          <div>
            <label className="text-[11px] sm:text-xs font-mono-vintage font-bold uppercase tracking-wider text-amber-400/80 block mb-2">
              Hazır Akustik Profiller (Presetler)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(Object.keys(EQUALIZER_PRESETS) as EqualizerPresetKey[]).map((pKey) => {
                const p = EQUALIZER_PRESETS[pKey];
                const isSelected = eq.preset === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => handleSelectPreset(pKey)}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-800/50 border-amber-400 text-amber-100 shadow-[0_0_12px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
                        : 'bg-black/30 border-amber-900/40 text-amber-300/80 hover:bg-amber-950/40 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="font-semibold text-xs font-sans truncate flex items-center justify-between">
                      <span>{p.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-amber-300 shrink-0" />}
                    </div>
                    <div className="text-[9.5px] sm:text-[10px] text-amber-400/60 line-clamp-1 mt-0.5">{p.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5-Band Graphic Equalizer Faders */}
          <div className="p-3 sm:p-4 rounded-xl bg-black/40 border border-amber-900/40 shadow-inner">
            <div className="flex justify-between items-center mb-2 sm:mb-3">
              <span className="text-[11px] sm:text-xs font-mono-vintage font-bold uppercase text-amber-300">
                5-Bant Parametrik Filtre (-12dB / +12dB)
              </span>
              <span className="text-[10px] sm:text-xs font-mono-vintage text-amber-400/60">0 dB Denge</span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 sm:gap-4 h-36 sm:h-44 items-center px-1 sm:px-2">
              {bands.map((b) => {
                const val = eq[b.key];
                return (
                  <div key={b.key} className="flex flex-col items-center h-full justify-between py-1">
                    <span className="text-[10px] sm:text-[11px] font-mono-vintage text-amber-200 font-bold">
                      {val > 0 ? `+${val.toFixed(1)}` : val.toFixed(1)} <span className="text-[8px] sm:text-[9px]">dB</span>
                    </span>

                    {/* Vertical Range Track */}
                    <div className="relative h-20 sm:h-28 w-8 flex items-center justify-center">
                      <div className="absolute h-full w-1.5 rounded-full bg-neutral-900 border border-amber-950">
                        {/* Zero Center Line */}
                        <div className="absolute top-1/2 left-[-4px] right-[-4px] h-[1px] bg-amber-600/60" />
                      </div>
                      <input
                        type="range"
                        min="-12"
                        max="12"
                        step="0.5"
                        value={val}
                        onChange={(e) => handleBandChange(b.key, parseFloat(e.target.value))}
                        className="w-20 sm:w-28 h-8 -rotate-90 origin-center absolute cursor-pointer opacity-90 accent-amber-500 touch-none"
                      />
                    </div>

                    <div className="text-center mt-1">
                      <span className="text-[10px] sm:text-xs font-bold font-mono text-amber-300 block leading-tight">{b.label}</span>
                      <span className="text-[8px] sm:text-[9px] text-amber-400/60 font-sans block truncate max-w-[55px] sm:max-w-none">{b.sub}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Analog Color & Saturation Knobs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* Tube Saturation */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-amber-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] sm:text-xs font-mono-vintage font-bold text-amber-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  Vakum Tüp Sıcaklığı
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400">
                  %{Math.round(eq.tubeSaturation * 100)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={eq.tubeSaturation}
                onChange={(e) => handleKnobChange('tubeSaturation', parseFloat(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer h-2 bg-neutral-900 rounded-lg"
              />
              <span className="text-[9.5px] sm:text-[10px] text-amber-400/60 mt-1">
                Sıcak analog harmonikler ve doyum
              </span>
            </div>

            {/* Bass Boost */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-amber-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] sm:text-xs font-mono-vintage font-bold text-amber-300 flex items-center gap-1">
                  <Volume2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Dinamik Bas Gücü
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400">
                  %{Math.round(eq.bassBoost * 100)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={eq.bassBoost}
                onChange={(e) => handleKnobChange('bassBoost', parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-900 rounded-lg"
              />
              <span className="text-[9.5px] sm:text-[10px] text-amber-400/60 mt-1">
                Akustik ahşap rezonansı ve alt bas
              </span>
            </div>

            {/* 3D Stereo Width */}
            <div className="p-2.5 sm:p-3 rounded-xl bg-black/30 border border-amber-900/40 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] sm:text-xs font-mono-vintage font-bold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
                  3D Stereo Derinlik
                </span>
                <span className="text-[11px] sm:text-xs font-mono font-bold text-amber-400">
                  %{Math.round(eq.stereoWidth * 100)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={eq.stereoWidth}
                onChange={(e) => handleKnobChange('stereoWidth', parseFloat(e.target.value))}
                className="w-full accent-yellow-400 cursor-pointer h-2 bg-neutral-900 rounded-lg"
              />
              <span className="text-[9.5px] sm:text-[10px] text-amber-400/60 mt-1">
                Oda akustiği ve geniş ses sahnesi
              </span>
            </div>
          </div>
        </div>

        {/* Sticky Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-amber-900/40 flex items-center justify-between shrink-0 bg-[#0f0905]/95 backdrop-blur-sm z-20">
          <span className="text-[10px] sm:text-xs font-mono text-amber-400/70 truncate max-w-[50%]">
            Profil: <strong className="text-amber-200">{EQUALIZER_PRESETS[eq.preset]?.name || 'Özel'}</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Tamam (Uygula)</span>
          </button>
        </div>
      </div>
    </div>
  );
};


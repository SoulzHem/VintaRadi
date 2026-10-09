import React, { useState } from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { Moon, Clock, X, Check, VolumeX } from 'lucide-react';

interface SleepTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  timerMinutesRemaining: number | null; // minutes remaining or null
  onStartTimer: (minutes: number, fadeOut: boolean) => void;
  onCancelTimer: () => void;
  theme: ThemeConfig;
}

const PRESET_DURATIONS = [15, 30, 45, 60, 90, 120];

export const SleepTimerModal: React.FC<SleepTimerModalProps> = ({
  isOpen,
  onClose,
  timerMinutesRemaining,
  onStartTimer,
  onCancelTimer,
  theme,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(30);
  const [enableFadeOut, setEnableFadeOut] = useState(true);

  if (!isOpen) return null;

  const handleStart = () => {
    onStartTimer(selectedDuration, enableFadeOut);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-md max-h-[92dvh] sm:max-h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 shrink-0">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display-vintage font-bold text-base sm:text-lg text-amber-200 leading-tight">
                Uyku Modu (Sleep Timer)
              </h3>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans line-clamp-1">
                Radyonuz seçtiğiniz süre sonunda otomatik ve yumuşakça kapanır
              </p>
            </div>
          </div>

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

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar overscroll-contain">
          {/* Active Timer State */}
          {timerMinutesRemaining !== null ? (
            <div className="p-4 rounded-xl bg-amber-950/50 border border-amber-600/50 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 mb-2 animate-pulse">
                <Clock className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono-vintage text-amber-300/80 uppercase">
                UYKU ZAMANLAYICI AKTİF
              </span>
              <span className="text-2xl sm:text-3xl font-display-vintage font-bold text-amber-200 my-1">
                {Math.ceil(timerMinutesRemaining)} <span className="text-sm font-sans">dakika kaldı</span>
              </span>
              <p className="text-xs text-amber-400/60 font-sans mt-1">
                Süre bitiminde ses yumuşakça kısılarak radyo durdurulacak.
              </p>

              <button
                type="button"
                onClick={onCancelTimer}
                className="mt-4 px-4 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs font-semibold transition-colors cursor-pointer min-h-[40px]"
              >
                Zamanlayıcıyı İptal Et
              </button>
            </div>
          ) : (
            <div className="space-y-4 font-sans text-xs">
              {/* Preset Time Buttons */}
              <div>
                <label className="text-[11px] sm:text-xs font-mono-vintage text-amber-300 uppercase block mb-2 font-bold">
                  Kapanma Süresi Seçin
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_DURATIONS.map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setSelectedDuration(dur)}
                      className={`py-2.5 sm:py-3 rounded-xl border text-center font-mono-vintage font-bold text-xs sm:text-sm transition-all cursor-pointer min-h-[40px] ${
                        selectedDuration === dur
                          ? 'bg-amber-600 text-black border-amber-400 shadow-md scale-102 font-black'
                          : 'bg-black/40 border-amber-900/40 text-amber-300 hover:bg-amber-950/40 hover:border-amber-700/60'
                      }`}
                    >
                      {dur} Dk
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom slider */}
              <div className="p-3 rounded-xl bg-black/30 border border-amber-900/40">
                <div className="flex justify-between items-center mb-1 text-xs">
                  <span className="text-amber-300 font-medium">Özel Süre Ayarı:</span>
                  <span className="font-mono font-bold text-amber-200">{selectedDuration} Dakika</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-neutral-900 rounded-lg"
                />
              </div>

              {/* Fade Out Toggle */}
              <label className="flex items-center gap-3 p-3 rounded-xl bg-black/30 border border-amber-900/40 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableFadeOut}
                  onChange={(e) => setEnableFadeOut(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <div className="flex-1">
                  <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <VolumeX className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    Yumuşak Ses Azaltma (Fade-Out)
                  </span>
                  <span className="text-[10px] text-amber-400/60 block mt-0.5">
                    Son 60 saniye içinde sesi kademeli olarak sıfıra indirir, uykuyu bölmez.
                  </span>
                </div>
              </label>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-black/40 border border-amber-900 text-amber-300 text-xs min-h-[40px] cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={handleStart}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5 min-h-[40px]"
                >
                  <Check className="w-4 h-4" />
                  Zamanlayıcıyı Başlat
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

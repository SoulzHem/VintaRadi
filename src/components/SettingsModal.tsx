import React from 'react';
import { AppSettings, ThemeType, FrequencyBand, LanguageCode } from '../types';
import { THEMES } from '../utils/themeConfig';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import {
  Settings,
  Palette,
  Battery,
  Moon,
  Zap,
  Radio,
  X,
  Check,
  Languages,
  Shield,
  HelpCircle,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
  onOpenLegal?: () => void;
  onOpenGuide?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenLegal,
  onOpenGuide,
}) => {
  if (!isOpen) return null;

  const currentTheme = THEMES[settings.theme];
  const lang = settings.language || 'tr';
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] sm:max-h-[85vh] rounded-2xl border-2 ${currentTheme.chassisBorder} ${currentTheme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className={`p-2 sm:p-2.5 rounded-xl ${currentTheme.accentBadge}`}>
              <Settings className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200">
                {t('settingsTitle')}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans">
                {t('settingsSubtitle')}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-300 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto p-3.5 sm:p-6 space-y-5 sm:space-y-6">
          {/* SECTION 0: LANGUAGE SELECTION */}
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Languages className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 font-bold">
                {t('languageSelectorTitle')}
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {SUPPORTED_LANGUAGES.map((l) => {
                const isSelected = settings.language === l.code;
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => onUpdateSettings({ language: l.code })}
                    className={`p-2 sm:p-2.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-900/50 border-amber-400 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                        : 'bg-black/40 border-amber-900/40 text-amber-300/80 hover:bg-amber-950/40'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="text-base">{l.flag}</span>
                      <span className="font-semibold text-xs truncate">{l.name}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 1: THEME SELECTION */}
          <div className="pt-2 border-t border-amber-900/30">
            <div className="flex items-center gap-2 mb-2.5">
              <Palette className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 font-bold">
                {t('themesTitle')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {(Object.keys(THEMES) as ThemeType[]).map((tKey) => {
                const th = THEMES[tKey];
                const isSelected = settings.theme === tKey;
                return (
                  <button
                    key={tKey}
                    type="button"
                    onClick={() => onUpdateSettings({ theme: tKey })}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-amber-900/40 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                        : 'bg-black/40 border-amber-900/40 hover:bg-amber-950/40 hover:border-amber-700/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-xs font-sans text-amber-100 flex items-center gap-1.5">
                        {th.name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/60 border border-amber-800 text-amber-300">
                        {th.year}
                      </span>
                    </div>
                    <p className="text-[10.5px] sm:text-[11px] text-amber-400/65 font-sans leading-snug">
                      {th.subtitle}
                    </p>

                    {isSelected && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-amber-300 font-bold">
                        <Check className="w-3.5 h-3.5" />
                        {t('activeTheme')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: AUDIO & TUNING STATIC */}
          <div className="space-y-3 pt-2 border-t border-amber-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Radio className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 font-bold">
                {t('tuningStaticTitle')}
              </h3>
            </div>

            <div className="p-3.5 rounded-xl bg-black/40 border border-amber-900/40 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-amber-200 block">
                    {t('tuningStaticLabel')}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] text-amber-400/60 block">
                    {t('tuningStaticDesc')}
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableStaticNoise}
                  onChange={(e) => onUpdateSettings({ enableStaticNoise: e.target.checked })}
                  className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                />
              </label>

              {settings.enableStaticNoise && (
                <div className="pt-2 border-t border-amber-900/20">
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-amber-300">{t('staticVolumeLabel')}</span>
                    <span className="font-mono font-bold text-amber-400">
                      %{Math.round(settings.staticVolume * 100)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.05"
                    max="0.6"
                    step="0.05"
                    value={settings.staticVolume}
                    onChange={(e) => onUpdateSettings({ staticVolume: parseFloat(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: PERFORMANCE & BATTERY SAVER */}
          <div className="space-y-3 pt-2 border-t border-amber-900/30">
            <div className="flex items-center gap-2 mb-2">
              <Battery className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 font-bold">
                {t('performanceTitle')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Low Battery Mode */}
              <label className="p-3 rounded-xl bg-black/40 border border-amber-900/40 flex items-start gap-2.5 cursor-pointer hover:bg-amber-950/30">
                <input
                  type="checkbox"
                  checked={settings.batterySaver}
                  onChange={(e) => onUpdateSettings({ batterySaver: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded mt-0.5"
                />
                <div>
                  <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400" />
                    {t('batterySaverLabel')}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] text-amber-400/60 block mt-0.5">
                    {t('batterySaverDesc')}
                  </span>
                </div>
              </label>

              {/* Night Mode */}
              <label className="p-3 rounded-xl bg-black/40 border border-amber-900/40 flex items-start gap-2.5 cursor-pointer hover:bg-amber-950/30">
                <input
                  type="checkbox"
                  checked={settings.nightMode}
                  onChange={(e) => onUpdateSettings({ nightMode: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded mt-0.5"
                />
                <div>
                  <span className="text-xs font-semibold text-amber-200 flex items-center gap-1.5">
                    <Moon className="w-3.5 h-3.5 text-indigo-400" />
                    {t('nightModeLabel')}
                  </span>
                  <span className="text-[10.5px] sm:text-[11px] text-amber-400/60 block mt-0.5">
                    {t('nightModeDesc')}
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 4: DEFAULT BAND */}
          <div className="space-y-3 pt-2 border-t border-amber-900/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-amber-200 block">
                  {t('defaultBandLabel')}
                </span>
                <span className="text-[10.5px] sm:text-[11px] text-amber-400/60">
                  {t('defaultBandDesc')}
                </span>
              </div>

              <div className="flex rounded-lg bg-black/60 p-0.5 border border-amber-900/40">
                {(['FM', 'AM', 'SW'] as FrequencyBand[]).map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => onUpdateSettings({ defaultBand: b })}
                    className={`px-2.5 sm:px-3 py-1 rounded font-mono-vintage font-bold text-xs transition-all ${
                      settings.defaultBand === b
                        ? 'bg-amber-600 text-black shadow'
                        : 'text-amber-400/70 hover:text-amber-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* SECTION 5: INTERACTIVE USER GUIDE & TUTORIAL */}
          <div className="pt-2 border-t border-amber-900/30">
            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-900/80 border border-amber-600/50 text-amber-300">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-200 block">
                    {lang === 'tr' ? 'Kullanım & Tanıtım Rehberi' : 'Interactive User Guide'}
                  </span>
                  <span className="text-[10.5px] text-amber-400/70 block">
                    {lang === 'tr'
                      ? 'Kadran ayarı, kaset kaydı, ekolayzır ve istasyon arama demoları'
                      : 'Step-by-step interactive animations & features walkthrough'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenGuide) {
                    onOpenGuide();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold transition-colors cursor-pointer shrink-0 shadow"
              >
                {lang === 'tr' ? 'Rehberi Aç' : 'Start Tour'}
              </button>
            </div>
          </div>

          {/* SECTION 7: LEGAL & PRIVACY POLICY (GOOGLE PLAY COMPLIANCE) */}
          <div className="pt-2 border-t border-amber-900/30">
            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-950/80 border border-amber-700/50 text-amber-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-amber-200 block">
                    {lang === 'tr' ? 'Gizlilik Politikası & Yasal Bilgiler' : 'Privacy Policy & Legal Terms'}
                  </span>
                  <span className="text-[10.5px] text-amber-400/60 block">
                    {lang === 'tr'
                      ? 'Google Play Store politikaları, DMCA telif bildirimleri ve lisanslar'
                      : 'Google Play Store policies, DMCA copyright notices & attributions'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (onOpenLegal) {
                    onOpenLegal();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-950 hover:bg-amber-900 border border-amber-700/60 text-amber-200 text-xs font-mono-vintage font-bold transition-colors cursor-pointer shrink-0"
              >
                {lang === 'tr' ? 'İncele' : 'View'}
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-amber-900/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 sm:px-6 py-1.5 sm:py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            {t('saveAndClose')}
          </button>
        </div>
      </div>
    </div>
  );
};


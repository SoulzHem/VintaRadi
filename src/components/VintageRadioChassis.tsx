import React, { useState } from 'react';
import { FrequencyBand, Playlist, RadioStation, AppSettings, LanguageCode } from '../types';
import { ThemeConfig } from '../utils/themeConfig';
import { AnalogTunerDial } from './AnalogTunerDial';
import { AnalogVuMeter } from './AnalogVuMeter';
import { getTranslation, SUPPORTED_LANGUAGES } from '../i18n/translations';
import {
  Play,
  Pause,
  Sliders,
  Moon,
  Globe,
  Heart,
  Share2,
  Settings,
  Radio,
  RefreshCw,
  ListMusic,
  Languages,
  HelpCircle,
  Minus,
  Plus,
  ListPlus,
  Users,
} from 'lucide-react';

interface VintageRadioChassisProps {
  band: FrequencyBand;
  onBandChange: (band: FrequencyBand) => void;
  frequency: number;
  onFrequencyChange: (freq: number) => void;
  volume: number;
  onVolumeChange: (vol: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  stations: RadioStation[];
  scanCountries: Array<{ code: string; label: string }>;
  scanCountry: string;
  onScanCountryChange: (country: string) => void;
  sameFrequencyCount: number;
  onlineCount: number | null;
  activeStation: RadioStation | null;
  isFavorite: boolean;
  playlists: Playlist[];
  onToggleFavorite: () => void;
  onAddStationToPlaylist: (playlistId: string, station: RadioStation) => void;
  isTuned: boolean;
  isLoadingStream: boolean;
  vuLeft: number;
  vuRight: number;
  theme: ThemeConfig;
  settings: AppSettings;
  sleepTimerMinutes: number | null;
  presets: Array<{ slot: number; stationId: string; label: string }>;
  onSelectPreset: (slot: number) => void;
  onSaveCurrentToPreset: (slot: number) => void;
  onSelectStation: (st: RadioStation) => void;
  onScanNext?: () => void;
  onStepPrev?: () => void;
  onStepNext?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
  // Modal openers
  onOpenExplorer: () => void;
  onOpenEqualizer: () => void;
  onOpenPlaylists: () => void;
  onOpenFavorites: () => void;
  onOpenSleepTimer: () => void;
  onOpenShare: () => void;
  onOpenSettings: () => void;
  onOpenLegal?: () => void;
  onOpenGuide?: () => void;
}

export const VintageRadioChassis: React.FC<VintageRadioChassisProps> = ({
  band,
  onBandChange,
  frequency,
  onFrequencyChange,
  volume,
  onVolumeChange,
  isPlaying,
  onTogglePlay,
  stations,
  scanCountries,
  scanCountry,
  onScanCountryChange,
  sameFrequencyCount,
  onlineCount,
  activeStation,
  isFavorite,
  playlists,
  onToggleFavorite,
  onAddStationToPlaylist,
  isTuned,
  isLoadingStream,
  vuLeft,
  vuRight,
  theme,
  settings,
  sleepTimerMinutes,
  presets,
  onSelectPreset,
  onSaveCurrentToPreset,
  onSelectStation,
  onScanNext,
  onStepPrev,
  onStepNext,
  onLanguageChange,
  onOpenExplorer,
  onOpenEqualizer,
  onOpenPlaylists,
  onOpenFavorites,
  onOpenSleepTimer,
  onOpenShare,
  onOpenSettings,
  onOpenLegal,
  onOpenGuide,
}) => {
  const [isPlaylistPickerOpen, setIsPlaylistPickerOpen] = useState(false);
  const lang = settings.language || 'tr';
  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation(lang, key);
  const layoutFrame = {
    cabinet: 'rounded-2xl sm:rounded-3xl',
    hiFi: 'rounded-md sm:rounded-xl',
    neon: 'rounded-lg sm:rounded-2xl border-dashed',
    artDeco: 'rounded-none sm:rounded-lg',
    minimal: 'rounded-lg sm:rounded-xl',
    noir: 'rounded-md sm:rounded-lg',
  }[theme.layout];
  const layoutPadding = theme.layout === 'hiFi' || theme.layout === 'minimal'
    ? 'p-2.5 sm:p-5'
    : 'p-2.5 sm:p-7';

  return (
    <div className="relative w-full max-w-5xl mx-auto select-none px-1 sm:px-4 py-1 sm:py-4">
      {/* Heavy Wood / Metal Radio Outer Cabinet */}
      <div
        className={`relative ${layoutFrame} ${layoutPadding} border-2 sm:border-4 ${theme.chassisBorder} ${theme.cabinetClass} ${theme.chassisGlow} transition-all duration-700`}
      >
        {theme.layout === 'hiFi' && (
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent" />
        )}
        {theme.layout === 'neon' && (
          <div className="absolute inset-2 rounded-md border border-pink-400/20 pointer-events-none" />
        )}
        {theme.layout === 'artDeco' && (
          <div className="absolute inset-x-1/4 top-0 h-px bg-gradient-to-r from-transparent via-amber-300 to-transparent" />
        )}
        {/* Brass Screws in 4 Corners (Subtle on mobile) */}
        <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-950 border border-amber-800 shadow flex items-center justify-center pointer-events-none">
          <div className="w-1 sm:w-2 h-[1px] bg-black/60 rotate-45" />
        </div>
        <div className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-950 border border-amber-800 shadow flex items-center justify-center pointer-events-none">
          <div className="w-1 sm:w-2 h-[1px] bg-black/60 -rotate-45" />
        </div>
        <div className="absolute bottom-1.5 left-1.5 sm:bottom-3 sm:left-3 w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-950 border border-amber-800 shadow flex items-center justify-center pointer-events-none">
          <div className="w-1 sm:w-2 h-[1px] bg-black/60 -rotate-12" />
        </div>
        <div className="absolute bottom-1.5 right-1.5 sm:bottom-3 sm:right-3 w-2 h-2 sm:w-3.5 sm:h-3.5 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-950 border border-amber-800 shadow flex items-center justify-center pointer-events-none">
          <div className="w-1 sm:w-2 h-[1px] bg-black/60 rotate-75" />
        </div>

        {/* Top Header: Brand Name Badge, Language Switcher & Band Selector */}
        <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 pb-1.5 sm:pb-5 border-b border-amber-900/40">
          {/* Authentic Metallic Brand Emblem */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <div className="px-2 py-0.5 sm:px-3.5 sm:py-1.5 rounded-xl bg-gradient-to-r from-amber-900 via-[#3d2415] to-amber-950 border border-amber-600/60 shadow-lg flex items-center gap-1.5 sm:gap-2">
              <Radio className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400" />
              <div>
                <h1 className="font-display-vintage font-black text-xs sm:text-lg tracking-widest text-amber-200 drop-shadow leading-tight">
                  VintaRadi
                </h1>
                <span className="text-[7px] sm:text-[9px] font-mono uppercase tracking-widest text-amber-400/80 block -mt-0.5 font-bold">
                  {t('brandSubtitle')}
                </span>
              </div>
            </div>

            {/* Audio status */}
            <div className="flex items-center gap-1 sm:gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-amber-900/50 text-[11px] font-mono-vintage text-amber-300">
                <div
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${
                    isPlaying
                      ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-amber-950 opacity-40'
                  }`}
                />
                <span>{isPlaying ? t('tubesWarm') : t('tubesStandby')}</span>
              </div>
            </div>
          </div>

          {/* Right Header Controls: Language Selector & Band Buttons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Quick Language Dropdown */}
            {onLanguageChange && (
              <div className="relative flex items-center">
                <select
                  value={lang}
                  onChange={(e) => onLanguageChange(e.target.value as LanguageCode)}
                  className="bg-black/60 border border-amber-800/60 text-amber-300 text-[10px] sm:text-xs font-mono rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1.5 focus:outline-none focus:border-amber-400 cursor-pointer appearance-none pr-4.5 sm:pr-5"
                  title="Change Language / Dil Seçimi"
                >
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-neutral-900 text-amber-200">
                      {l.flag} {l.code.toUpperCase()}
                    </option>
                  ))}
                </select>
                <Languages className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400/70 absolute right-1 pointer-events-none" />
              </div>
            )}

            {/* Band Selector Mechanical Push Buttons */}
            <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 rounded-lg sm:rounded-2xl bg-black/60 border border-amber-900/60 shadow-inner">
              {(['FM', 'AM', 'SW'] as FrequencyBand[]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onBandChange(b)}
                  className={`px-2 py-0.5 sm:px-4 sm:py-1.5 rounded-md sm:rounded-xl font-mono-vintage font-black text-[10px] sm:text-sm tracking-wider transition-all duration-200 cursor-pointer ${
                    band === b
                      ? 'bg-gradient-to-b from-amber-500 to-amber-700 text-black shadow-[0_2px_8px_rgba(245,158,11,0.5)] scale-105'
                      : 'text-amber-400/70 hover:text-amber-200 hover:bg-amber-950/40'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="my-1 sm:my-2 flex justify-start">
          <div
            className="inline-flex items-center gap-2 rounded-xl border border-amber-600/60 bg-black/60 px-3 py-1.5 text-amber-100 shadow-inner"
            aria-label={onlineCount === null ? 'Gerçek zamanlı bağlantı yapılandırılmamış' : `Uygulaması açık dinleyici sekmesi: ${onlineCount}`}
            title={onlineCount === null ? 'Canlı sayaç için Supabase bağlantısı gerekir' : 'Uygulaması şu anda açık olan tarayıcı sekmeleri; toplam ziyaretçi veya yalnızca çalan radyo sayısı değildir'}
          >
            <Users className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-bold">{onlineCount === null ? '—' : onlineCount}</span>
            <span className="text-[10px] sm:text-xs text-amber-300/90">
              {lang === 'tr' ? 'uygulaması açık' : 'app open'}
            </span>
          </div>
        </div>

        {/* Center Deck: Tuner Scale + VU Meters + Rotary Knobs */}
        <div className="my-1.5 sm:my-5 grid grid-cols-1 lg:grid-cols-12 gap-1.5 sm:gap-5 items-center">
          {/* Left Flank: Dual Analog VU Meters (Desktop only) */}
          <div className="hidden lg:flex lg:col-span-3 flex-col items-center justify-center gap-3">
            <AnalogVuMeter
              level={isTuned ? 0.85 : 0.15}
              label={t('signalLevel')}
              theme={theme}
              batterySaver={settings.batterySaver}
            />
            <AnalogVuMeter
              level={isPlaying ? (vuLeft + vuRight) / 2 : 0}
              label={t('audioOutput')}
              theme={theme}
              batterySaver={settings.batterySaver}
            />
          </div>

          {/* Center Stage: The Illuminated Analog Glass Tuner Dial Scale */}
          <div className="lg:col-span-6 w-full">
            <div className="mb-1.5 sm:mb-3 flex items-center justify-center gap-2">
              <label htmlFor="scan-country" className="text-[9px] sm:text-xs font-mono-vintage font-bold uppercase text-amber-300">
                Ülke
              </label>
              <select
                id="scan-country"
                value={scanCountry}
                onChange={(event) => onScanCountryChange(event.target.value)}
                className="max-w-[68%] bg-black/70 border border-amber-800/70 text-amber-200 text-[10px] sm:text-xs font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-amber-400"
              >
                {scanCountries.map((country) => (
                  <option key={country.code} value={country.code} className="bg-neutral-900">{country.label}</option>
                ))}
              </select>
            </div>
            <AnalogTunerDial
              band={band}
              frequency={frequency}
              onFrequencyChange={onFrequencyChange}
              stations={stations}
              activeStation={activeStation}
              isTuned={isTuned}
              theme={theme}
              language={lang}
              onSelectStation={onSelectStation}
              onScanNext={onScanNext}
              onStepPrev={onStepPrev}
              onStepNext={onStepNext}
            />
          </div>

          {/* Right Flank: Direct Frequency and Master Volume Controls */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-1 items-center gap-2 sm:gap-3 py-0.5">
            <div className="rounded-xl bg-black/40 border border-amber-900/50 p-2 sm:p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label htmlFor="frequency-control" className="text-[9px] sm:text-[10px] font-mono-vintage font-bold uppercase text-amber-300 truncate">
                  {t('freqKnobLabel')}
                </label>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-200 whitespace-nowrap">
                  {frequency} {band === 'AM' ? 'kHz' : 'MHz'}
                </span>
              </div>
              <input
                id="frequency-control"
                type="range"
                min={band === 'FM' ? 87.5 : band === 'AM' ? 530 : 3.2}
                max={band === 'FM' ? 108.0 : band === 'AM' ? 1700 : 22.0}
                step={band === 'FM' ? 0.1 : band === 'AM' ? 10 : 0.05}
                value={frequency}
                onChange={(e) => onFrequencyChange(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
                style={{ accentColor: theme.dialNeedleColor }}
                aria-label={t('freqKnobLabel')}
              />
              <div className="flex gap-1.5">
                <button type="button" onClick={onStepPrev} className={`flex-1 min-h-8 rounded-lg border ${theme.accentBadge} flex items-center justify-center cursor-pointer`} aria-label="Frekansı azalt">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={onStepNext} className={`flex-1 min-h-8 rounded-lg border ${theme.accentBadge} flex items-center justify-center cursor-pointer`} aria-label="Frekansı artır">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="rounded-xl bg-black/40 border border-amber-900/50 p-2 sm:p-3 space-y-1.5">
              <div className="flex items-center justify-between gap-1">
                <label htmlFor="volume-control" className="text-[9px] sm:text-[10px] font-mono-vintage font-bold uppercase text-amber-300 truncate">
                  {t('volumeKnobLabel')}
                </label>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-200">{Math.round(volume * 100)}%</span>
              </div>
              <input
                id="volume-control"
                type="range"
                min="0"
                max="100"
                step="1"
                value={Math.round(volume * 100)}
                onChange={(e) => onVolumeChange(Number(e.target.value) / 100)}
                className="w-full accent-amber-400 cursor-pointer"
                style={{ accentColor: theme.dialNeedleColor }}
                aria-label={t('volumeKnobLabel')}
              />
              <div className="flex gap-1.5">
                <button type="button" onClick={() => onVolumeChange(Math.max(0, volume - 0.05))} className={`flex-1 min-h-8 rounded-lg border ${theme.accentBadge} flex items-center justify-center cursor-pointer`} aria-label="Sesi azalt">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button type="button" onClick={() => onVolumeChange(Math.min(1, volume + 0.05))} className={`flex-1 min-h-8 rounded-lg border ${theme.accentBadge} flex items-center justify-center cursor-pointer`} aria-label="Sesi artır">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 20 Vintage Chassis Push-Button Memory Presets */}
        <div className="my-1 sm:my-2.5 p-1 sm:p-2 rounded-xl bg-black/50 border border-amber-900/50">
          <span className="mb-1 block text-center text-[8px] sm:text-[10px] font-mono-vintage uppercase tracking-wider text-amber-400 font-bold">
            {t('memoryPresets')}
          </span>

          <div className="grid grid-cols-10 gap-0.5 sm:gap-1.5 w-full">
            {presets.map((p) => {
              const isMatched = Boolean(p.stationId) && activeStation?.id === p.stationId;
              const isEmpty = !p.stationId;
              return (
                <button
                  key={p.slot}
                  type="button"
                  onClick={() => onSelectPreset(p.slot)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    onSaveCurrentToPreset(p.slot);
                  }}
                  title={`${isEmpty ? `P${p.slot}` : p.label} (${t('presetTooltip')})`}
                  aria-label={`${isEmpty ? `P${p.slot}, boş hafıza` : `P${p.slot}, ${p.label}`} — ${t('presetTooltip')}`}
                  className={`min-w-0 px-0 py-0.5 sm:px-1 sm:py-1 rounded-md sm:rounded-lg border text-center transition-all cursor-pointer ${
                    isMatched
                      ? 'bg-gradient-to-b from-amber-600 to-amber-800 border-amber-300 text-black shadow-[0_0_12px_rgba(245,158,11,0.4)] scale-105'
                      : isEmpty
                        ? 'bg-black/40 border-amber-950/70 text-amber-500/70 hover:border-amber-600'
                        : 'bg-gradient-to-b from-[#3a2618] to-[#1e130a] border-amber-900/60 text-amber-200 hover:border-amber-600'
                  }`}
                >
                  <div className="font-mono-vintage font-black text-[8px] sm:text-[11px] leading-tight">{p.slot}</div>
                  <div className="min-h-[1em] text-[6px] sm:text-[8px] font-mono leading-tight line-clamp-1 break-all opacity-90 mx-auto">
                    {isEmpty ? '--' : p.label || `P${p.slot}`}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Station LCD Readout Display */}
        <div className="my-1.5 sm:my-3 min-h-[58px] sm:min-h-[68px] p-1.5 sm:p-3.5 rounded-xl bg-[#0d0906] border border-amber-900/60 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex items-center gap-1.5 sm:gap-3 w-full sm:w-auto overflow-hidden">
            <div className="p-1 sm:p-2 rounded-lg bg-amber-950/80 border border-amber-700/40 text-amber-400 shrink-0">
              <Radio className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
            </div>

            <div className="overflow-hidden min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="font-semibold text-xs sm:text-base text-amber-100 truncate">
                  {activeStation ? activeStation.name : t('noStationSelected')}
                </h2>
                {isLoadingStream && (
                  <RefreshCw className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-amber-400 animate-spin shrink-0" />
                )}
              </div>
              <p className="h-4 sm:h-5 leading-4 sm:leading-5 text-[9.5px] sm:text-xs text-amber-400/70 font-sans truncate whitespace-nowrap">
                {activeStation
                  ? `📍 ${activeStation.country} • ${activeStation.genre} • ${activeStation.frequency} ${activeStation.band}${sameFrequencyCount > 1 ? ` • ${sameFrequencyCount} kanal` : ''}`
                  : t('scanHint')}
              </p>
            </div>
          </div>

          {/* Quick Audio Stream Status Badge */}
          <div className="flex flex-wrap items-center justify-end gap-1.5 sm:gap-2 self-end sm:self-auto shrink-0">
            {activeStation && (
              <>
                <button
                  type="button"
                  onClick={onToggleFavorite}
                  aria-label={isFavorite ? t('removeFromFavs') : t('addToFavs')}
                  title={isFavorite ? t('removeFromFavs') : t('addToFavs')}
                  className={`px-2 py-1 rounded-lg border text-[9px] sm:text-xs font-semibold flex items-center gap-1 transition-colors ${
                    isFavorite
                      ? 'bg-red-950/60 border-red-700/60 text-red-300'
                      : 'bg-black/40 border-amber-900/50 text-amber-200 hover:border-red-700/60 hover:text-red-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? t('removeFromFavs') : t('addToFavs')}</span>
                </button>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsPlaylistPickerOpen((open) => !open)}
                    aria-expanded={isPlaylistPickerOpen}
                    aria-label={t('addToPlaylist')}
                    title={t('addToPlaylist')}
                    className="px-2 py-1 rounded-lg border border-amber-900/50 bg-black/40 text-amber-200 hover:border-amber-600 text-[9px] sm:text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <ListPlus className="w-3.5 h-3.5" />
                    <span>{t('addToPlaylist')}</span>
                  </button>
                  {isPlaylistPickerOpen && (
                    <div className="absolute right-0 top-full mt-1 z-30 w-52 max-h-52 overflow-y-auto rounded-xl border border-amber-700/60 bg-[#160e09] p-1.5 shadow-xl">
                      <p className="px-2 py-1 text-[10px] font-bold text-amber-400">{t('choosePlaylist')}</p>
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          type="button"
                          onClick={() => {
                            onAddStationToPlaylist(playlist.id, activeStation);
                            setIsPlaylistPickerOpen(false);
                          }}
                          className="block w-full rounded-lg px-2 py-1.5 text-left text-xs text-amber-100 hover:bg-amber-900/50"
                        >
                          {playlist.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            {activeStation?.bitrate && (
              <span className="text-[8.5px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-amber-900 text-amber-300">
                {activeStation.bitrate}k
              </span>
            )}
            <span
              className={`text-[9px] sm:text-xs font-mono font-bold px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full flex items-center gap-1 sm:gap-1.5 ${
                isPlaying
                  ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-600/50'
                  : 'bg-amber-950/80 text-amber-300/80 border border-amber-800/40'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                  isPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500/50'
                }`}
              />
              {isPlaying ? t('liveBroadcast') : t('paused')}
            </span>
          </div>
        </div>

        {/* Master Control Deck Buttons */}
        <div className="mt-2 sm:mt-5 pt-2 sm:pt-4 border-t border-amber-900/40 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
          {/* Master Play Button */}
          <button
            type="button"
            onClick={onTogglePlay}
            className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-xl sm:rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-black font-black text-sm font-sans flex items-center gap-2 shadow-[0_4px_15px_rgba(245,158,11,0.4)] transition-transform active:scale-95 cursor-pointer min-h-[46px] sm:min-h-[44px]"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>{t('pause')}</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current" />
                <span>{t('play')}</span>
              </>
            )}
          </button>

          {/* Worldwide Explorer */}
          <button
            type="button"
            onClick={onOpenExplorer}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px]"
            title={t('explore')}
          >
            <Globe className="w-4.5 h-4.5 text-amber-400" />
            <span>{t('explore')}</span>
          </button>

          {/* Favorites */}
          <button
            type="button"
            onClick={onOpenFavorites}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px]"
            title={t('favorites')}
          >
            <Heart className="w-4.5 h-4.5 text-red-400" />
            <span>{t('favorites')}</span>
          </button>

          {/* Playlists */}
          <button
            type="button"
            onClick={onOpenPlaylists}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px]"
            title={t('playlists')}
          >
            <ListMusic className="w-4.5 h-4.5 text-amber-400" />
            <span>{t('playlists')}</span>
          </button>

          {/* Equalizer */}
          <button
            type="button"
            onClick={onOpenEqualizer}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px]"
            title={t('equalizer')}
          >
            <Sliders className="w-4.5 h-4.5 text-amber-400" />
            <span>{t('equalizer')}</span>
          </button>

          {/* Sleep Timer */}
          <button
            type="button"
            onClick={onOpenSleepTimer}
            className={`p-2.5 sm:px-3 sm:py-2 rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px] ${
              sleepTimerMinutes !== null
                ? 'bg-amber-600 text-black border-amber-400 font-bold'
                : 'bg-black/40 hover:bg-amber-950/60 border-amber-900/50 text-amber-300'
            }`}
            title={t('sleepTimer')}
          >
            <Moon className="w-4.5 h-4.5 text-amber-400" />
            <span>
              {sleepTimerMinutes !== null ? `${Math.ceil(sleepTimerMinutes)}m` : t('sleepTimer')}
            </span>
          </button>

          {/* Real-time Share & Sync */}
          <button
            type="button"
            onClick={onOpenShare}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer flex items-center gap-1.5 text-xs min-h-[46px] sm:min-h-[44px]"
            title={t('shareLive')}
          >
            <Share2 className="w-4.5 h-4.5 text-amber-400" />
            <span>{t('shareLive')}</span>
          </button>

          {/* Settings & Themes */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-2.5 sm:px-3 sm:py-2 rounded-xl bg-black/40 hover:bg-amber-950/60 border border-amber-900/50 text-amber-300 transition-colors cursor-pointer min-h-[46px] sm:min-h-[44px] flex items-center gap-1.5 text-xs"
            title={t('settings')}
          >
            <Settings className="w-4.5 h-4.5 text-amber-400" />
            <span>{t('settings')}</span>
          </button>
        </div>

        {/* Vintage Radio Woven Speaker Cloth Grille at Base with Developer Credits */}
        <div className="mt-2 sm:mt-4 px-3 py-1.5 sm:py-2.5 rounded-lg sm:rounded-xl speaker-grille border border-amber-950/70 shadow-inner relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="text-[8.5px] sm:text-[10px] font-mono-vintage text-amber-500/70 tracking-wider uppercase truncate">
            {t('acousticResonance')}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] sm:text-[10.5px] font-mono-vintage text-amber-300/85">
              Geliştirici (Developer): <strong className="text-amber-200 font-bold">SoulzHem</strong>
            </span>
            {onOpenGuide && (
              <button
                type="button"
                onClick={onOpenGuide}
                className="text-[8.5px] sm:text-[10px] font-mono underline text-amber-400/90 hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-0.5"
              >
                • Kullanım Rehberi
              </button>
            )}
            {onOpenLegal && (
              <button
                type="button"
                onClick={onOpenLegal}
                className="text-[8.5px] sm:text-[10px] font-mono underline text-amber-400/70 hover:text-amber-300 transition-colors cursor-pointer"
              >
                • Yasal / Gizlilik
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

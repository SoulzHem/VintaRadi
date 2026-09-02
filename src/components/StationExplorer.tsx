import React, { useState, useEffect } from 'react';
import { FrequencyBand, RadioStation, LanguageCode } from '../types';
import { RadioApiService } from '../services/radioApi';
import { ThemeConfig } from '../utils/themeConfig';
import { getTranslation } from '../i18n/translations';
import {
  Search,
  Globe,
  Radio,
  Heart,
  Plus,
  Play,
  RotateCw,
  X,
  Share2,
} from 'lucide-react';

interface StationExplorerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStation: (station: RadioStation) => void;
  activeStation: RadioStation | null;
  isPlaying: boolean;
  favorites: string[];
  onToggleFavorite: (station: RadioStation) => void;
  onAddCustomStation: (station: RadioStation) => void;
  onShareStation: (station: RadioStation) => void;
  theme: ThemeConfig;
  language?: LanguageCode;
}

const POPULAR_COUNTRIES = [
  { name: 'Global (All)', code: '' },
  { name: 'Türkiye (TR)', code: 'TR' },
  { name: 'United States (US)', code: 'US' },
  { name: 'United Kingdom (UK)', code: 'GB' },
  { name: 'Germany (DE)', code: 'DE' },
  { name: 'France (FR)', code: 'FR' },
  { name: 'Italy (IT)', code: 'IT' },
  { name: 'Spain (ES)', code: 'ES' },
  { name: 'Switzerland (CH)', code: 'CH' },
  { name: 'Japan (JP)', code: 'JP' },
  { name: 'Canada (CA)', code: 'CA' },
  { name: 'Netherlands (NL)', code: 'NL' },
  { name: 'Greece (GR)', code: 'GR' },
  { name: 'Brazil (BR)', code: 'BR' },
];

const GENRE_TAGS = [
  { label: 'All', tag: '' },
  { label: 'Nostalgia & Retro', tag: 'retro,nostalgia,oldies,vintage,golden' },
  { label: 'Jazz & Blues', tag: 'jazz,blues,swing' },
  { label: 'Pop & Hits', tag: 'pop,turkish,türkçe,hit' },
  { label: 'Classical & Acoustic', tag: 'classical,instrumental,acoustic,piano' },
  { label: 'Lo-Fi & Lounge', tag: 'lofi,chill,downtempo,lounge' },
  { label: 'Rock & Alternative', tag: 'rock,alternative' },
  { label: 'Ambient & Space', tag: 'ambient,meditation,relaxation,space' },
  { label: 'News & Talk', tag: 'news,talk,haber' },
  { label: 'Electronic & Dance', tag: 'electronic,house,dance' },
  { label: 'Folk & Traditional', tag: 'folk,turku,traditional' },
];

export const StationExplorer: React.FC<StationExplorerProps> = ({
  isOpen,
  onClose,
  onSelectStation,
  activeStation,
  isPlaying,
  favorites,
  onToggleFavorite,
  onAddCustomStation,
  onShareStation,
  theme,
  language = 'tr',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [selectedBand, setSelectedBand] = useState<FrequencyBand | 'ALL'>('ALL');
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  // Custom Station Form State
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [customGenre, setCustomGenre] = useState('Custom Stream');
  const [customCountry, setCustomCountry] = useState('Custom Station');

  const t = (key: Parameters<typeof getTranslation>[1]) => getTranslation((language || 'tr') as LanguageCode, key);

  useEffect(() => {
    if (isOpen) {
      loadStations();
    }
  }, [isOpen, selectedCountry, selectedTag, selectedBand]);

  const loadStations = async () => {
    setIsLoading(true);
    try {
      const activeGenre = GENRE_TAGS.find((g) => g.label === selectedTag);
      const tagQuery = activeGenre ? activeGenre.tag : (selectedTag === 'All' ? '' : selectedTag.toLowerCase());

      const results = await RadioApiService.searchStations({
        query: searchQuery,
        countryCode: selectedCountry,
        country: selectedCountry,
        tag: tagQuery,
        band: selectedBand === 'ALL' ? undefined : selectedBand,
        limit: 60,
      });
      setStations(results);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadStations();
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customUrl.trim()) return;

    const newStation: RadioStation = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      url: customUrl.trim(),
      country: customCountry.trim() || 'Custom Station',
      countryCode: 'CUSTOM',
      genre: customGenre.trim() || 'Custom',
      frequency: Number((88.0 + Math.random() * 20).toFixed(1)),
      band: 'FM',
      isCustom: true,
      bitrate: 128,
      description: 'User added custom live broadcast stream.',
      tags: ['custom', 'user'],
    };

    onAddCustomStation(newStation);
    onSelectStation(newStation);
    setIsCustomModalOpen(false);
    setCustomName('');
    setCustomUrl('');
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} bg-gradient-to-b from-[#25170e] via-[#1a0f09] to-[#0f0905] text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400">
              <Globe className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl font-display-vintage font-bold tracking-wide text-amber-200">
                {t('explorerTitle')}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans">
                {t('explorerSubtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-amber-700/40 hover:bg-amber-700/60 border border-amber-600/50 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t('addCustomStream')}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="p-3 sm:p-4 border-b border-amber-900/30 bg-black/30 flex flex-col gap-2.5 sm:gap-3">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-9 pr-3 py-2 sm:py-2.5 rounded-xl bg-black/50 border border-amber-900/50 text-xs sm:text-sm text-amber-100 placeholder-amber-400/40 focus:outline-none focus:border-amber-500 font-sans"
              />
            </div>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs sm:text-sm transition-all flex items-center gap-1 cursor-pointer shadow-md"
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t('searchBtn')}</span>
            </button>
            <button
              type="button"
              onClick={loadStations}
              className="p-2 sm:p-2.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-400 transition-colors cursor-pointer"
              title="Refresh"
            >
              <RotateCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </form>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-0.5 text-xs">
            {/* Band Selector */}
            <div className="flex rounded-lg bg-black/60 p-0.5 border border-amber-900/40 mr-1 sm:mr-2">
              {(['ALL', 'FM', 'AM', 'SW'] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setSelectedBand(b)}
                  className={`px-2 sm:px-2.5 py-1 rounded-md font-mono-vintage font-bold text-[10px] sm:text-[11px] transition-all ${
                    selectedBand === b
                      ? 'bg-amber-600 text-black shadow'
                      : 'text-amber-400/70 hover:text-amber-200'
                  }`}
                >
                  {b === 'ALL' ? t('allFilters') : b}
                </button>
              ))}
            </div>

            {/* Country Selector */}
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="px-2.5 py-1 sm:py-1.5 rounded-lg bg-black/60 border border-amber-900/40 text-amber-200 font-sans text-[11px] sm:text-xs focus:outline-none focus:border-amber-500 max-w-[140px] sm:max-w-none"
            >
              {POPULAR_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code} className="bg-neutral-900 text-amber-100">
                  📍 {c.name}
                </option>
              ))}
            </select>

            {/* Genre Quick Filter Chips */}
            <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 max-w-full">
              {GENRE_TAGS.map((genre) => (
                <button
                  key={genre.label}
                  type="button"
                  onClick={() => setSelectedTag(genre.label)}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap text-[10px] sm:text-[11px] font-sans transition-all ${
                    selectedTag === genre.label
                      ? 'bg-amber-500 text-black font-semibold'
                      : 'bg-amber-950/40 text-amber-300/80 border border-amber-800/30 hover:bg-amber-900/40'
                  }`}
                >
                  {genre.label === 'All' ? t('allFilters') : genre.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stations List Grid */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3.5">
          {isLoading ? (
            <div className="col-span-full h-48 sm:h-64 flex flex-col items-center justify-center gap-3 text-amber-400">
              <RotateCw className="w-7 h-7 sm:w-8 sm:h-8 animate-spin text-amber-500" />
              <p className="text-xs sm:text-sm font-mono-vintage">{t('loadingStations')}</p>
            </div>
          ) : stations.length === 0 ? (
            <div className="col-span-full h-48 sm:h-64 flex flex-col items-center justify-center gap-2 text-amber-400/60 text-center p-4">
              <Radio className="w-8 h-8 sm:w-10 sm:h-10 stroke-1 text-amber-500/40" />
              <p className="text-xs sm:text-sm font-semibold text-amber-200">{t('noStationsFound')}</p>
              <p className="text-[11px] text-amber-400/50">{t('noStationsFoundSub')}</p>
            </div>
          ) : (
            stations.map((st) => {
              const isActive = activeStation?.id === st.id;
              const isFav = favorites.includes(st.id);

              return (
                <div
                  key={st.id}
                  onClick={() => onSelectStation(st)}
                  className={`group relative p-3 sm:p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isActive
                      ? 'bg-amber-950/60 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                      : 'bg-black/40 border-amber-900/30 hover:bg-amber-950/30 hover:border-amber-700/50'
                  }`}
                >
                  <div>
                    {/* Frequency & Band Badge */}
                    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded bg-black/60 border border-amber-700/40 text-[9.5px] sm:text-[10px] font-mono-vintage font-bold text-amber-300">
                          {st.band} • {st.frequency} {st.band === 'AM' ? 'kHz' : 'MHz'}
                        </span>
                        {st.bitrate ? (
                          <span className="text-[9.5px] sm:text-[10px] font-mono text-amber-400/60">
                            {st.bitrate}k
                          </span>
                        ) : null}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onShareStation(st)}
                          className="p-1 rounded-lg text-amber-400/60 hover:text-amber-200 hover:bg-amber-900/40 transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(st)}
                          className={`p-1 rounded-lg transition-colors ${
                            isFav
                              ? 'text-red-400 hover:text-red-300 bg-red-950/40'
                              : 'text-amber-400/60 hover:text-red-400 hover:bg-amber-900/40'
                          }`}
                          title="Favorite"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="font-semibold text-xs sm:text-sm text-amber-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                      {st.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-amber-400/70 font-sans mt-0.5 line-clamp-1">
                      📍 {st.country} • {st.genre}
                    </p>
                    {st.description && (
                      <p className="text-[10.5px] sm:text-[11px] text-amber-200/50 mt-1 line-clamp-2 leading-relaxed">
                        {st.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Play State */}
                  <div className="mt-2.5 pt-2 border-t border-amber-900/20 flex items-center justify-between text-xs">
                    <span className="text-[9.5px] sm:text-[10px] text-amber-400/50 font-mono">
                      {st.votes ? `★ ${st.votes}` : t('liveBroadcast')}
                    </span>
                    <div className="flex items-center gap-1 text-amber-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                      {isActive && isPlaying ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-[10px] sm:text-[11px] font-mono">
                          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-pulse" />
                          {t('playingNow')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10.5px] sm:text-[11px]">
                          <Play className="w-3 h-3 fill-current" />
                          {t('listenBtn')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal: Custom Station Dialog */}
        {isCustomModalOpen && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md rounded-xl bg-gradient-to-b from-[#2b1b11] to-[#160d08] border border-amber-700/60 p-4 sm:p-5 text-amber-100 shadow-2xl">
              <div className="flex justify-between items-center pb-2.5 border-b border-amber-900/40 mb-3 sm:mb-4">
                <h3 className="font-display-vintage font-bold text-sm sm:text-base text-amber-200">
                  {t('customStationModalTitle')}
                </h3>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="text-amber-400 hover:text-amber-200"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateCustom} className="space-y-2.5 sm:space-y-3 font-sans text-xs">
                <div>
                  <label className="block text-amber-300 font-semibold mb-1">{t('stationNameLabel')} *</label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g. Retro Jazz FM"
                    className="w-full p-2 rounded-lg bg-black/50 border border-amber-800 text-amber-100 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-amber-300 font-semibold mb-1">{t('streamUrlLabel')} *</label>
                  <input
                    type="url"
                    required
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="https://stream.server.com/live.mp3"
                    className="w-full p-2 rounded-lg bg-black/50 border border-amber-800 text-amber-100 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">{t('genreLabel')}</label>
                    <input
                      type="text"
                      value={customGenre}
                      onChange={(e) => setCustomGenre(e.target.value)}
                      placeholder="Jazz, Pop, Rock..."
                      className="w-full p-2 rounded-lg bg-black/50 border border-amber-800 text-amber-100 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-amber-300 font-semibold mb-1">{t('countryLabel')}</label>
                    <input
                      type="text"
                      value={customCountry}
                      onChange={(e) => setCustomCountry(e.target.value)}
                      placeholder="Turkey / Istanbul"
                      className="w-full p-2 rounded-lg bg-black/50 border border-amber-800 text-amber-100 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 sm:pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-black/40 border border-amber-900 text-amber-300"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold"
                  >
                    {t('saveAndPlay')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


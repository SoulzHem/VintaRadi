import React, { useState } from 'react';
import { PlayHistoryItem, Playlist, RadioStation, WeeklyRecommendation } from '../types';
import { ThemeConfig } from '../utils/themeConfig';
import {
  Heart,
  ListMusic,
  History,
  Sparkles,
  Play,
  Trash2,
  Plus,
  X,
  Share2,
  Clock,
  Radio,
  Calendar,
} from 'lucide-react';

interface FavoritesPlaylistsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'favorites' | 'playlists' | 'history' | 'recommendations';
  setActiveTab: (tab: 'favorites' | 'playlists' | 'history' | 'recommendations') => void;
  favorites: string[];
  allStations: RadioStation[];
  playlists: Playlist[];
  history: PlayHistoryItem[];
  weeklyRecommendation: WeeklyRecommendation;
  onSelectStation: (station: RadioStation) => void;
  onToggleFavorite: (station: RadioStation) => void;
  onCreatePlaylist: (name: string, desc: string, color: string) => void;
  onDeletePlaylist: (id: string) => void;
  onClearHistory: () => void;
  onShareStation: (station: RadioStation) => void;
  theme: ThemeConfig;
}

export const FavoritesPlaylistsModal: React.FC<FavoritesPlaylistsModalProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  favorites,
  allStations,
  playlists,
  history,
  weeklyRecommendation,
  onSelectStation,
  onToggleFavorite,
  onCreatePlaylist,
  onDeletePlaylist,
  onClearHistory,
  onShareStation,
  theme,
}) => {
  const [newPlName, setNewPlName] = useState('');
  const [newPlDesc, setNewPlDesc] = useState('');
  const [newPlColor, setNewPlColor] = useState('#d97706');
  const [isCreatingPl, setIsCreatingPl] = useState(false);

  if (!isOpen) return null;

  // Resolve favorite stations
  const favoriteStations = allStations.filter((s) => favorites.includes(s.id));

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlName.trim()) return;
    onCreatePlaylist(newPlName.trim(), newPlDesc.trim(), newPlColor);
    setNewPlName('');
    setNewPlDesc('');
    setIsCreatingPl(false);
  };

  const formatTimeAgo = (timestamp: number) => {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return 'Az önce';
    if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl h-[92dvh] sm:h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Modal Top Tabs */}
        <div className="p-3 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('favorites')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'favorites'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Favoriler ({favorites.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('playlists')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'playlists'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <ListMusic className="w-4 h-4" />
              <span>Çalma Listeleri ({playlists.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('recommendations')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'recommendations'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Haftalık Keşif</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Geçmiş</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: FAVORITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-3">
              {favoriteStations.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center gap-2 text-amber-400/60">
                  <Heart className="w-12 h-12 stroke-1 text-amber-600/40" />
                  <p className="font-semibold text-amber-200">Henüz kayıtlı favori istasyonunuz yok</p>
                  <p className="text-xs text-amber-400/50">
                    Frekans ararken veya istasyon kütüphanesinde kalp ikonuna basarak favorilerinize ekleyebilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {favoriteStations.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => onSelectStation(st)}
                      className="p-3.5 rounded-xl bg-black/40 border border-amber-900/40 hover:bg-amber-950/40 hover:border-amber-700/60 transition-all cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-800 to-amber-950 border border-amber-600/40 flex items-center justify-center text-amber-200 font-mono-vintage font-bold text-xs shadow">
                          {st.band}
                        </div>
                        <div>
                          <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300 transition-colors">
                            {st.name}
                          </h4>
                          <span className="text-xs text-amber-400/70 font-mono">
                            {st.frequency} {st.band === 'AM' ? 'kHz' : 'MHz'} • {st.genre}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onShareStation(st)}
                          className="p-2 text-amber-400/60 hover:text-amber-200 transition-colors"
                          title="Paylaş"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleFavorite(st)}
                          className="p-2 text-red-400 hover:text-red-300 transition-colors"
                          title="Favoriden Çıkar"
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PLAYLISTS */}
          {activeTab === 'playlists' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono-vintage text-amber-400/80 uppercase">
                  ÖZEL TEMATİK FREKANS LİSTELERİ
                </span>
                <button
                  type="button"
                  onClick={() => setIsCreatingPl(!isCreatingPl)}
                  className="px-3 py-1.5 rounded-lg bg-amber-600/40 hover:bg-amber-600/60 border border-amber-600/50 text-amber-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Yeni Liste Oluştur
                </button>
              </div>

              {/* Create Playlist Form */}
              {isCreatingPl && (
                <form
                  onSubmit={handleCreateSubmit}
                  className="p-4 rounded-xl bg-black/60 border border-amber-700/50 space-y-3 animate-in fade-in"
                >
                  <div className="font-semibold text-xs text-amber-300">Yeni Çalma Listesi Detayları</div>
                  <input
                    type="text"
                    required
                    value={newPlName}
                    onChange={(e) => setNewPlName(e.target.value)}
                    placeholder="Liste Adı (örn: Gece Okuma Saati)"
                    className="w-full p-2 rounded-lg bg-black/50 border border-amber-900 text-amber-100 text-xs"
                  />
                  <input
                    type="text"
                    value={newPlDesc}
                    onChange={(e) => setNewPlDesc(e.target.value)}
                    placeholder="Açıklama"
                    className="w-full p-2 rounded-lg bg-black/50 border border-amber-900 text-amber-100 text-xs"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-amber-400">Renk:</span>
                      {['#d97706', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'].map((col) => (
                        <button
                          key={col}
                          type="button"
                          onClick={() => setNewPlColor(col)}
                          className={`w-5 h-5 rounded-full border-2 transition-transform ${
                            newPlColor === col ? 'scale-125 border-white' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: col }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingPl(false)}
                        className="px-3 py-1 rounded bg-black/40 text-amber-400 text-xs"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-amber-600 font-bold text-black text-xs"
                      >
                        Kaydet
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Playlists Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {playlists.map((pl) => {
                  const plStations = allStations.filter((s) => pl.stationIds.includes(s.id));
                  return (
                    <div
                      key={pl.id}
                      className="p-4 rounded-xl bg-black/40 border border-amber-900/40 hover:border-amber-700/60 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3.5 h-3.5 rounded-full shadow"
                              style={{ backgroundColor: pl.color }}
                            />
                            <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300">
                              {pl.name}
                            </h4>
                          </div>
                          {!pl.isSystem && (
                            <button
                              type="button"
                              onClick={() => onDeletePlaylist(pl.id)}
                              className="text-red-400/60 hover:text-red-400 p-1"
                              title="Listeyi Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-amber-400/70 font-sans line-clamp-2 leading-relaxed">
                          {pl.description}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1">
                          {plStations.slice(0, 3).map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => onSelectStation(st)}
                              className="text-[10px] px-2 py-0.5 rounded bg-amber-950/80 border border-amber-800/40 text-amber-200 hover:bg-amber-800/60 transition-colors"
                            >
                              ▶ {st.name} ({st.frequency} {st.band})
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-amber-900/20 flex items-center justify-between text-[11px] text-amber-400/60 font-mono">
                        <span>{pl.stationIds.length} İstasyon</span>
                        {plStations.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onSelectStation(plStations[0])}
                            className="text-amber-400 hover:text-amber-200 font-semibold flex items-center gap-1"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            Listeyi Çal
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: WEEKLY SMART RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {/* Cassette Cover Card */}
              <div className="relative p-5 rounded-2xl bg-gradient-to-r from-amber-950 via-[#2e1a0f] to-amber-950 border-2 border-amber-600/50 shadow-xl overflow-hidden">
                <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
                  <Radio className="w-48 h-48 text-amber-300" />
                </div>

                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                      HAFTALIK ÖZEL NOSTALJİ KASETİ
                    </div>
                    <h3 className="text-xl sm:text-2xl font-display-vintage font-bold text-amber-100">
                      {weeklyRecommendation.title}
                    </h3>
                    <p className="text-xs text-amber-300/80 font-sans mt-1 max-w-lg leading-relaxed">
                      {weeklyRecommendation.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[11px] font-mono text-amber-400/60">
                      <Calendar className="w-3 h-3" />
                      {weeklyRecommendation.generatedDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Stations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {weeklyRecommendation.stations.map((st) => (
                  <div
                    key={st.id}
                    onClick={() => onSelectStation(st)}
                    className="p-3.5 rounded-xl bg-black/40 border border-amber-900/40 hover:bg-amber-950/40 hover:border-amber-700/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-900/60 border border-amber-600/40 flex items-center justify-center text-amber-300 font-mono-vintage font-bold text-xs">
                        {st.band}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300 transition-colors">
                          {st.name}
                        </h4>
                        <span className="text-xs text-amber-400/70 font-mono">
                          {st.frequency} {st.band === 'AM' ? 'kHz' : 'MHz'} • {st.genre}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onSelectStation(st)}
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Dinle
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: LISTENING HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-amber-900/30">
                <span className="text-xs font-mono-vintage text-amber-400/80 uppercase">
                  SON DİNLENEN FREKANSLAR ({history.length})
                </span>
                {history.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearHistory}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-sans cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Geçmişi Temizle
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center gap-2 text-amber-400/60">
                  <Clock className="w-12 h-12 stroke-1 text-amber-600/40" />
                  <p className="font-semibold text-amber-200">Henüz dinleme geçmişi oluşmadı</p>
                  <p className="text-xs text-amber-400/50">
                    Radyo frekanslarını dinledikçe burada otomatik olarak listelenecektir.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map((item) => {
                    const matched = allStations.find((s) => s.id === item.stationId);
                    return (
                      <div
                        key={item.id}
                        onClick={() => matched && onSelectStation(matched)}
                        className="p-3 rounded-xl bg-black/40 border border-amber-900/30 hover:bg-amber-950/40 hover:border-amber-700/50 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-amber-950/80 text-amber-400">
                            <Radio className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300">
                              {item.stationName}
                            </h4>
                            <span className="text-xs text-amber-400/70 font-mono">
                              {item.frequency} {item.band} • {item.genre} • {item.country}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs font-mono text-amber-400/60">
                          <span>{formatTimeAgo(item.timestamp)}</span>
                          <Play className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

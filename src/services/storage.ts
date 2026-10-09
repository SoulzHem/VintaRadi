import { AppSettings, EqualizerSettings, OfflineRecording, PlayHistoryItem, Playlist, RadioStation } from '../types';

const STORAGE_KEYS = {
  SETTINGS: 'vintaradi_settings_v1',
  EQ: 'vintaradi_eq_v1',
  FAVORITES: 'vintaradi_favorites_v1',
  PLAYLISTS: 'vintaradi_playlists_v1',
  HISTORY: 'vintaradi_history_v1',
  CUSTOM_STATIONS: 'vintaradi_custom_stations_v1',
  CACHED_STATIONS: 'vintaradi_cached_stations_v2',
  PRESET_BUTTONS: 'vintaradi_presets_v1',
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'artistic',
  volume: 0.85,
  staticVolume: 0.20,
  enableStaticNoise: true,
  batterySaver: false,
  nightMode: false,
  defaultBand: 'FM',
  audioQuality: 'high',
  autoResume: false,
  visualizerEnabled: true,
  hapticFeedback: true,
  language: 'tr',
};

export const DEFAULT_EQ: EqualizerSettings = {
  band60: 3.5,
  band250: 2.0,
  band1k: 1.0,
  band4k: -1.0,
  band12k: -2.0,
  tubeSaturation: 0.45,
  stereoWidth: 0.25,
  bassBoost: 0.3,
  preset: 'warm_tube',
};

export const DEFAULT_PLAYLISTS: Playlist[] = [];

// --- IndexedDB for Offline Recordings ---
const DB_NAME = 'VintaRadi_DB';
const DB_VERSION = 1;
const STORE_RECORDINGS = 'recordings';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_RECORDINGS)) {
        db.createObjectStore(STORE_RECORDINGS, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const StorageService = {
  getSettings(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  },

  getEqualizer(): EqualizerSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.EQ);
      return raw ? { ...DEFAULT_EQ, ...JSON.parse(raw) } : DEFAULT_EQ;
    } catch {
      return DEFAULT_EQ;
    }
  },

  saveEqualizer(eq: EqualizerSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.EQ, JSON.stringify(eq));
    } catch (e) {
      console.error(e);
    }
  },

  getFavorites(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveFavorites(favIds: string[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favIds));
    } catch (e) {
      console.error(e);
    }
  },

  getPlaylists(): Playlist[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      return raw ? JSON.parse(raw) : DEFAULT_PLAYLISTS;
    } catch {
      return DEFAULT_PLAYLISTS;
    }
  },

  savePlaylists(playlists: Playlist[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
    } catch (e) {
      console.error(e);
    }
  },

  getHistory(): PlayHistoryItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  addHistory(item: Omit<PlayHistoryItem, 'id' | 'timestamp'>) {
    try {
      const history = this.getHistory();
      const newItem: PlayHistoryItem = {
        ...item,
        id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        timestamp: Date.now(),
      };
      // Keep last 100 entries, remove duplicate immediate previous
      const filtered = history.filter(h => h.stationId !== item.stationId || Date.now() - h.timestamp > 60000);
      const updated = [newItem, ...filtered].slice(0, 100);
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
      return updated;
    } catch {
      return [];
    }
  },

  clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEYS.HISTORY);
    } catch (e) {
      console.error(e);
    }
  },

  getPresetButtons(): Array<{ slot: number; stationId: string; label: string }> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PRESET_BUTTONS);
      const saved: unknown = raw ? JSON.parse(raw) : [];
      const savedPresets = Array.isArray(saved) ? saved : [];

      return Array.from({ length: 20 }, (_, index) => {
        const slot = index + 1;
        const fallback = {
          slot,
          stationId: '',
          label: '--',
        };
        const stored = savedPresets.find(
          (preset): preset is { slot: number; stationId: string; label: string } =>
            preset !== null &&
            typeof preset === 'object' &&
            'slot' in preset &&
            preset.slot === slot &&
            'stationId' in preset &&
            typeof preset.stationId === 'string' &&
            'label' in preset &&
            typeof preset.label === 'string',
        );

        return stored || fallback;
      });
    } catch {
      return Array.from({ length: 20 }, (_, index) => {
        const slot = index + 1;
        return {
          slot,
          stationId: '',
          label: '--',
        };
      });
    }
  },

  savePresetButtons(presets: Array<{ slot: number; stationId: string; label: string }>) {
    try {
      localStorage.setItem(STORAGE_KEYS.PRESET_BUTTONS, JSON.stringify(presets));
    } catch (e) {
      console.error(e);
    }
  },

  getCustomStations(): RadioStation[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_STATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCustomStations(stations: RadioStation[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_STATIONS, JSON.stringify(stations));
    } catch (e) {
      console.error(e);
    }
  },

  // Cache API stations
  getCachedStations(): RadioStation[] {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return [];
      const raw = localStorage.getItem(STORAGE_KEYS.CACHED_STATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveCachedStations(stations: RadioStation[]) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      localStorage.setItem(STORAGE_KEYS.CACHED_STATIONS, JSON.stringify(stations.slice(0, 300)));
    } catch (e) {
      console.error(e);
    }
  },

  // --- IndexedDB Recordings CRUD ---
  async saveRecording(rec: OfflineRecording, audioBlob: Blob): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
      const store = tx.objectStore(STORE_RECORDINGS);
      store.put({ ...rec, audioBlob });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },

  async getAllRecordings(): Promise<OfflineRecording[]> {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_RECORDINGS, 'readonly');
        const store = tx.objectStore(STORE_RECORDINGS);
        const req = store.getAll();
        req.onsuccess = () => {
          const items = req.result as Array<OfflineRecording & { audioBlob?: Blob }>;
          const withUrls = items.map(item => {
            let blobUrl = item.blobUrl;
            if (item.audioBlob) {
              blobUrl = URL.createObjectURL(item.audioBlob);
            }
            return {
              ...item,
              blobUrl,
            };
          });
          resolve(withUrls.sort((a, b) => b.recordedAt - a.recordedAt));
        };
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  async deleteRecording(id: string): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_RECORDINGS, 'readwrite');
      const store = tx.objectStore(STORE_RECORDINGS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
};

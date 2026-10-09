export type FrequencyBand = 'FM' | 'AM' | 'SW';

export interface RadioStation {
  id: string;
  name: string;
  url: string;
  streamUrl?: string;
  favicon?: string;
  country: string;
  countryCode: string;
  genre: string;
  frequency: number; // e.g., 91.1 (FM in MHz), 770 (AM in kHz), 6.07 (SW in MHz)
  band: FrequencyBand;
  bitrate?: number;
  codec?: string;
  description?: string;
  tags?: string[];
  isCustom?: boolean;
  clicks?: number;
  votes?: number;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  stationIds: string[];
  createdAt: string;
  updatedAt: string;
  isSystem?: boolean;
}

export interface PlayHistoryItem {
  id: string;
  stationId: string;
  stationName: string;
  frequency: number;
  band: FrequencyBand;
  genre: string;
  country: string;
  timestamp: number;
  durationSeconds: number;
}

export interface OfflineRecording {
  id: string;
  stationName: string;
  frequency: number;
  band: FrequencyBand;
  blobUrl?: string;
  audioData?: string; // base64 fallback
  durationSeconds: number;
  recordedAt: number;
  sizeBytes: number;
  sizeFormatted: string;
  format?: 'mp3' | 'aac' | 'wma' | 'webm' | 'mp4';
}

export type ThemeType =
  | 'artistic'
  | 'mahogany'
  | 'silver'
  | 'cyberpunk'
  | 'artdeco'
  | 'nordic'
  | 'noir'
  | 'oceanic'
  | 'paper'
  | 'terminal';

export type EqualizerPresetKey = 'flat' | 'warm_tube' | 'vinyl' | 'jazz_club' | 'bass_boost' | 'vocal_clarity' | 'acoustic' | 'night_mode';

export interface EqualizerSettings {
  band60: number;    // -12 to +12 dB
  band250: number;   // -12 to +12 dB
  band1k: number;    // -12 to +12 dB
  band4k: number;    // -12 to +12 dB
  band12k: number;   // -12 to +12 dB
  tubeSaturation: number; // 0 to 1
  stereoWidth: number;    // 0 to 1
  bassBoost: number;      // 0 to 1
  preset: EqualizerPresetKey;
}

export type LanguageCode = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'it';

export interface AppSettings {
  theme: ThemeType;
  volume: number;           // 0 to 1
  staticVolume: number;     // 0 to 1
  enableStaticNoise: boolean;
  batterySaver: boolean;
  nightMode: boolean;
  defaultBand: FrequencyBand;
  audioQuality: 'auto' | 'high' | 'eco';
  autoResume: boolean;
  visualizerEnabled: boolean;
  hapticFeedback: boolean;
  language: LanguageCode;
}

export interface SyncMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: number;
}

export interface SyncRoomState {
  roomId: string;
  hostName: string;
  stationId: string | null;
  stationName: string | null;
  frequency: number | null;
  band: FrequencyBand;
  isPlaying: boolean;
  listenersCount: number;
  reactions: Array<{ id: string; emoji: string; x: number }>;
  messages: SyncMessage[];
}

export interface WeeklyRecommendation {
  id: string;
  title: string;
  description: string;
  tagline: string;
  coverStyle: string;
  stations: RadioStation[];
  generatedDate: string;
}

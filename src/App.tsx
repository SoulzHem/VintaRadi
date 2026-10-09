import React, { useState, useEffect, useRef, useCallback } from 'react';
import type Hls from 'hls.js';
import {
  FrequencyBand,
  RadioStation,
  AppSettings,
  EqualizerSettings,
  Playlist,
  PlayHistoryItem,
  OfflineRecording,
  SyncMessage,
  WeeklyRecommendation,
} from './types';
import { FREQUENCY_RANGES } from './data/frequencyRanges';
import { StorageService, DEFAULT_SETTINGS, DEFAULT_EQ } from './services/storage';
import { audioEngine } from './services/audioEngine';
import { syncService, SyncPayload } from './services/syncService';
import { RadioApiService, resolveCountryInfo } from './services/radioApi';
import { THEMES } from './utils/themeConfig';
import { generateWeeklyRecommendation } from './utils/recommendationEngine';
import { isHlsStreamUrl, isPlayableStreamUrl } from './utils/streamUrl';
import { getTranslation } from './i18n/translations';

/** API sonuçlarını tekrarsız şekilde havuza ekler. */
function mergeApiStations(prev: RadioStation[], incoming: RadioStation[]): RadioStation[] {
  const merged = [...prev];
  for (const st of incoming) {
    if (!merged.some((m) => m.id === st.id || m.url === st.url)) merged.push(st);
  }
  return merged;
}

// Components
import { VintageRadioChassis } from './components/VintageRadioChassis';
import { StationExplorer } from './components/StationExplorer';
import { EqualizerModal } from './components/EqualizerModal';
import { FavoritesPlaylistsModal } from './components/FavoritesPlaylistsModal';
import { OfflineRecordingsModal } from './components/OfflineRecordingsModal';
import { SleepTimerModal } from './components/SleepTimerModal';
import { ShareSyncModal } from './components/ShareSyncModal';
import { SettingsModal } from './components/SettingsModal';
import { LegalInfoModal } from './components/LegalInfoModal';
import { UserGuideModal } from './components/UserGuideModal';
import { Users } from 'lucide-react';

export default function App() {
  // App Persistent State
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [equalizer, setEqualizer] = useState<EqualizerSettings>(() => StorageService.getEqualizer());
  const [favorites, setFavorites] = useState<string[]>(() => StorageService.getFavorites());
  const [playlists, setPlaylists] = useState<Playlist[]>(() => StorageService.getPlaylists());
  const [history, setHistory] = useState<PlayHistoryItem[]>(() => StorageService.getHistory());
  const [recordings, setRecordings] = useState<OfflineRecording[]>([]);
  const [customStations, setCustomStations] = useState<RadioStation[]>(() => StorageService.getCustomStations());
  const [discoveredStations, setDiscoveredStations] = useState<RadioStation[]>([]);
  const [unavailableStationIds, setUnavailableStationIds] = useState<Set<string>>(() => new Set());
  // Keşfet modalinde yüklenen sonuçlar (kadran şeridiyle paylaşılır)
  const [explorerStations, setExplorerStations] = useState<RadioStation[]>([]);

  // Load the station directory on startup.
  useEffect(() => {
    let cancelled = false;
    RadioApiService.searchStations({ limit: 200 })
      .then((stations) => {
        if (!cancelled) setExplorerStations((prev) => mergeApiStations(prev, stations));
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [presetButtons, setPresetButtons] = useState(() => StorageService.getPresetButtons());

  // Radio Tuner State
  const [band, setBand] = useState<FrequencyBand>(settings.defaultBand || 'FM');
  const [scanCountry, setScanCountry] = useState('TR');
  const [frequency, setFrequency] = useState<number>(88.2);
  const [activeStation, setActiveStation] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(false);
  const [isTuned, setIsTuned] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(settings.volume);

  // VU Meter & Audio Reactive Metrics
  const [vuLeft, setVuLeft] = useState<number>(0);
  const [vuRight, setVuRight] = useState<number>(0);

  // Recording State
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Sleep Timer State
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const sleepTimerRef = useRef<number | null>(null);

  // Real-time Sync & Airwave Room State
  const [roomId, setRoomId] = useState<string>(syncService.getRoomId());
  const [listenersCount, setListenersCount] = useState<number | null>(null);
  const [onlineCount, setOnlineCount] = useState<number | null>(null);
  const [chatMessages, setChatMessages] = useState<SyncMessage[]>([]);
  const [floatingReactions, setFloatingReactions] = useState<Array<{ id: string; emoji: string; x: number }>>([]);

  // Modals Visibility
  const [isExplorerOpen, setIsExplorerOpen] = useState(false);
  const [isEqualizerOpen, setIsEqualizerOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [favoritesActiveTab, setFavoritesActiveTab] = useState<'favorites' | 'playlists' | 'history' | 'recommendations'>('favorites');
  const [isRecordingsOpen, setIsRecordingsOpen] = useState(false);
  const [isSleepTimerOpen, setIsSleepTimerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalActiveTab, setLegalActiveTab] = useState<'privacy' | 'terms' | 'dmca' | 'licenses' | 'about'>('privacy');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Toast Banner
  const [toastMessage, setToastMessage] = useState<{ title: string; desc?: string } | null>(null);

  // HTML Audio Element Ref
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const meterIntervalRef = useRef<number | null>(null);
  const playStartTimeRef = useRef<number>(0);
  const playRequestIdRef = useRef(0);
  const scanTimerRef = useRef<number | null>(null);
  const isScanningRef = useRef(false);
  const scanCursorRef = useRef(0);

  useEffect(() => () => {
    hlsRef.current?.destroy();
    hlsRef.current = null;
  }, []);

  useEffect(() => {
    if (!syncService.isRealtimeConfigured()) return;
    const unsubscribeOnline = syncService.subscribeOnlineCount(setOnlineCount);
    const unsubscribeRoom = syncService.subscribeRoomPresence(setListenersCount);
    syncService.connect();
    return () => {
      unsubscribeOnline();
      unsubscribeRoom();
    };
  }, []);

  // Pool of user-provided and directory stations.
  const allStations = React.useMemo(() => {
    const list = [...customStations, ...discoveredStations, ...explorerStations].filter(
      (station) => isPlayableStreamUrl(station.url) && !unavailableStationIds.has(station.id),
    );
    return list.filter((station, index, all) => all.findIndex((item) => item.id === station.id || item.url === station.url) === index);
  }, [customStations, discoveredStations, explorerStations, unavailableStationIds]);

  // Weekly recommendation
  const weeklyRecommendation = React.useMemo(() => {
    return generateWeeklyRecommendation(history, allStations);
  }, [history, allStations]);

  // Şerit havuzu: keşfet (yerleşikler yok).
  const dialStations = React.useMemo(() => {
    const list = [...discoveredStations, ...explorerStations];
    return list.filter(
      (station, index, all) =>
        isPlayableStreamUrl(station.url) &&
        !unavailableStationIds.has(station.id) &&
        all.findIndex((item) => item.id === station.id || item.url === station.url) === index,
    );
  }, [discoveredStations, explorerStations, unavailableStationIds]);
  // Şerit + SCAN havuzu: seçili ülkeye göre filtrelenir (Tümü = hepsi)
  const dialFiltered = React.useMemo(() => {
    if (scanCountry === 'ALL') return dialStations;
    return dialStations.filter((station) => station.countryCode === scanCountry);
  }, [dialStations, scanCountry]);
  // Ülke seçimi: keşfet havuzundaki TÜM ülke isimleri + başta "Tümü"
  const scanCountries = React.useMemo(() => {
    const list = Array.from(new Map<string, string>(dialStations.map((station) => [station.countryCode, station.country])).entries())
      .map(([code, label]) => ({ code, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
    return [{ code: 'ALL', label: getTranslation(settings.language || 'tr', 'allCountries') }, ...list];
  },
    [dialStations, settings.language],
  );
  const sameFrequencyCount = activeStation
    ? dialFiltered.filter((station) => station.frequency === activeStation.frequency).length
    : 0;

  useEffect(() => {
    scanCursorRef.current = 0;
    if (scanCountry === 'ALL') return;
    let cancelled = false;
    setIsDiscovering(true);
    RadioApiService.searchStations({ countryCode: scanCountry, limit: 1000 })
      .then((stations) => {
        // Uzerine yazma degil EKLE: secilen ulke havuza eklenir
        if (!cancelled) setDiscoveredStations((prev) => {
          const merged = [...prev];
          for (const st of stations) {
            if (!merged.some((m) => m.id === st.id || m.url === st.url)) merged.push(st);
          }
          return merged;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsDiscovering(false);
      });
    return () => { cancelled = true; };
  }, [scanCountry]);

  // Show Toast helper
  const showToast = (title: string, desc?: string) => {
    setToastMessage({ title, desc });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1. Initial Mount: Load Offline Recordings from IndexedDB
  useEffect(() => {
    StorageService.getAllRecordings().then((recs) => {
      setRecordings(recs);
    });

    // Check URL parameters for direct tuning (e.g. ?station=...&freq=...&band=...&room=...)
    const urlParams = new URLSearchParams(window.location.search);
    const paramStationId = urlParams.get('station');
    const paramFreq = urlParams.get('freq');
    const paramBand = urlParams.get('band') as FrequencyBand | null;
    const paramRoom = urlParams.get('room');

    if (paramRoom) {
      syncService.joinRoom(paramRoom);
      setRoomId(paramRoom);
    }

    if (paramBand && ['FM', 'AM', 'SW'].includes(paramBand)) {
      setBand(paramBand);
    }

    const paramPage = urlParams.get('page');
    if (paramPage === 'privacy') {
      setLegalActiveTab('privacy');
      setIsLegalOpen(true);
    } else if (paramPage === 'terms') {
      setLegalActiveTab('terms');
      setIsLegalOpen(true);
    } else if (paramPage === 'dmca') {
      setLegalActiveTab('dmca');
      setIsLegalOpen(true);
    } else if (paramPage === 'licenses' || paramPage === 'legal') {
      setLegalActiveTab('licenses');
      setIsLegalOpen(true);
    } else if (paramPage === 'about') {
      setLegalActiveTab('about');
      setIsLegalOpen(true);
    } else if (paramPage === 'guide' || paramPage === 'tutorial' || paramPage === 'help') {
      setIsGuideOpen(true);
    }

    if (paramFreq) {
      const parsed = parseFloat(paramFreq);
      if (!isNaN(parsed)) setFrequency(parsed);
    }

    if (paramStationId) {
      const matched = allStations.find((s) => s.id === paramStationId);
      if (matched) {
        tuneToStation(matched, true);
        return;
      }
    }

  }, []);

  // 2. Setup Real-time Sync Subscription
  useEffect(() => {
    const unsubscribe = syncService.subscribe((payload: SyncPayload) => {
      if (payload.type === 'TUNE_STATION' && payload.data?.stationId) {
        const found = allStations.find((s) => s.id === payload.data?.stationId);
        if (found && payload.senderId !== syncService.getClientId()) {
          showToast('📻 Ortak Frekansa Kilitlendi', `${payload.senderName}, ${found.name} yayınına geçti.`);
          tuneToStation(found, payload.data.isPlaying ?? true, false);
        }
      } else if (payload.type === 'PLAY_STATE' && payload.data) {
        if (payload.senderId !== syncService.getClientId()) {
          if (payload.data.isPlaying !== undefined && audioRef.current) {
            if (payload.data.isPlaying) audioRef.current.play().catch(() => {});
            else audioRef.current.pause();
            setIsPlaying(payload.data.isPlaying);
          }
        }
      } else if (payload.type === 'LISTENER_JOIN') {
        if (payload.senderId !== syncService.getClientId()) {
          showToast('👋 Yeni Dinleyici Katıldı', `${payload.senderName} canlı frekansa bağlandı.`);
        }
      } else if (payload.type === 'SEND_REACTION' && payload.data?.emoji) {
        const reactionId = 'react_' + Date.now() + Math.random();
        const newReaction = {
          id: reactionId,
          emoji: payload.data.emoji,
          x: 20 + Math.random() * 60, // random percentage across screen
        };
        setFloatingReactions((prev) => [...prev, newReaction]);
        setTimeout(() => {
          setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
        }, 2500);
      } else if (payload.type === 'SEND_CHAT' && payload.data?.message) {
        setChatMessages((prev) => [...prev, payload.data!.message!]);
      }
    });

    return () => unsubscribe();
  }, [allStations]);

  // 3. Audio Engine & Analyser Loop
  useEffect(() => {
    if (!audioRef.current) return;
    audioEngine.init(audioRef.current);
    audioEngine.applyEqualizer(equalizer);
    audioEngine.setMasterVolume(volume);

    // VU meter polling loop
    if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    meterIntervalRef.current = window.setInterval(() => {
      if (isPlaying) {
        const metrics = audioEngine.getAudioMetrics();
        setVuLeft(metrics.vuLeft);
        setVuRight(metrics.vuRight);
      } else {
        setVuLeft(0);
        setVuRight(0);
      }
    }, settings.batterySaver ? 150 : 50);

    return () => {
      if (meterIntervalRef.current) clearInterval(meterIntervalRef.current);
    };
  }, [equalizer, volume, isPlaying, settings.batterySaver]);

  // 4. Frequency proximity tuning & static noise calculation
  useEffect(() => {
    const range = FREQUENCY_RANGES[band];
    const threshold = band === 'FM' ? 0.25 : band === 'AM' ? 25 : 0.12;

    // Find closest station on current band (şeritteki filtreli istasyonlar)
    const bandStations = dialFiltered.filter((s) => s.band === band);
    let closestStation: RadioStation | null = null;
    let minDistance = Infinity;

    for (const st of bandStations) {
      const dist = Math.abs(st.frequency - frequency);
      if (dist < minDistance) {
        minDistance = dist;
        closestStation = st;
      }
    }

    if (isScanningRef.current) {
      setIsTuned(false);
      return;
    }

    if (minDistance <= threshold && closestStation) {
      // Locked onto station!
      setIsTuned(true);
      const selectedStationMatchesFrequency = activeStation &&
        Math.abs(activeStation.frequency - frequency) <= threshold;
      if (selectedStationMatchesFrequency) {
        // Keep the station selected by SCAN when several channels share a frequency.
        if (settings.enableStaticNoise) audioEngine.stopStaticNoise();
        return;
      }
      if (activeStation?.id !== closestStation.id) {
        setActiveStation(closestStation);
        if (audioRef.current && isPlaying) {
          playAudioStream(closestStation.url);
        }
      }
      if (settings.enableStaticNoise) {
        audioEngine.stopStaticNoise();
      }
    } else {
      // Between stations (analog airwave space)
      setIsTuned(false);
      if (settings.enableStaticNoise && isPlaying) {
        audioEngine.startStaticNoise(settings.staticVolume);
      }
    }
  }, [frequency, band, dialFiltered, isPlaying, settings.enableStaticNoise, settings.staticVolume]);

  // Audio Stream Player
  const playAudioStream = async (streamUrl: string) => {
    if (!audioRef.current) return;
    const requestId = ++playRequestIdRef.current;
    setIsLoadingStream(true);

    try {
      await audioEngine.resumeContext();
      const audio = audioRef.current;
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      if (requestId !== playRequestIdRef.current) return;
      if (isHlsStreamUrl(streamUrl)) {
        const { default: HlsPlayer } = await import('hls.js/light');
        if (requestId !== playRequestIdRef.current) return;
        if (HlsPlayer.isSupported()) {
          const hls = new HlsPlayer();
          hlsRef.current = hls;
          await new Promise<void>((resolve, reject) => {
            let manifestReady = false;
            const timeout = window.setTimeout(() => reject(new Error('HLS manifest timed out')), 15000);
            hls.on(HlsPlayer.Events.MANIFEST_PARSED, () => {
              manifestReady = true;
              window.clearTimeout(timeout);
              resolve();
            });
            hls.on(HlsPlayer.Events.ERROR, (_event, data) => {
              if (!data.fatal) return;
              if (hlsRef.current === hls) {
                hls.destroy();
                hlsRef.current = null;
              }
              if (!manifestReady) {
                window.clearTimeout(timeout);
                reject(new Error(`HLS ${data.type}: ${data.details}`));
                return;
              }
              console.warn('HLS playback error:', data.type, data.details);
              setIsPlaying(false);
              setIsLoadingStream(false);
              showToast('Yayın kesildi', 'Bu istasyonun HLS akışı oynatılamadı.');
            });
            hls.loadSource(streamUrl);
            hls.attachMedia(audio);
          });
        } else {
          audio.src = streamUrl;
          audio.load();
        }
      } else {
        audio.src = streamUrl;
        audio.load();
      }
      if (requestId !== playRequestIdRef.current) return;
      await audio.play();
      if (requestId !== playRequestIdRef.current) return;
      setIsPlaying(true);
      setIsLoadingStream(false);
      playStartTimeRef.current = Date.now();
    } catch (err) {
      if (requestId !== playRequestIdRef.current || (err instanceof DOMException && err.name === 'AbortError')) {
        return;
      }
      if (hlsRef.current && isHlsStreamUrl(streamUrl)) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (err instanceof DOMException && err.name === 'NotSupportedError') {
        showToast('Yayın desteklenmiyor', 'Bu istasyonun ses biçimi tarayıcı tarafından oynatılamıyor.');
        setIsLoadingStream(false);
        return;
      }
      console.warn('Playback error:', err);
      showToast('Yayın Başlatılamadı', 'Tarayıcı yayını engelledi veya istasyon yanıt vermiyor. Çal butonuna basarak tekrar deneyin.');
      setIsLoadingStream(false);
    }
  };

  // Master Station Tuning
  const tuneToStation = (station: RadioStation, autoPlay: boolean = true, broadcast: boolean = true) => {
    setBand(station.band);
    setFrequency(station.frequency);
    setActiveStation(station);
    setIsTuned(true);

    if (autoPlay) {
      playAudioStream(station.url);
      if (broadcast) syncService.broadcastTune(station, true);
    }

    // Record into listening history
    const updatedHistory = StorageService.addHistory({
      stationId: station.id,
      stationName: station.name,
      frequency: station.frequency,
      band: station.band,
      genre: station.genre,
      country: station.country,
      durationSeconds: 0,
    });
    setHistory(updatedHistory);
  };

  // Play / Pause Master Toggle
  const handleTogglePlay = async () => {
    if (!audioRef.current) return;
    await audioEngine.resumeContext();

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      audioEngine.stopStaticNoise();
      syncService.broadcastPlayState(false, activeStation?.id);
    } else {
      if (activeStation) {
        playAudioStream(activeStation.url);
      } else {
        showToast('Önce bir istasyon seçin', 'Keşfet bölümünden bir yayın seçebilir veya özel akış ekleyebilirsiniz.');
        return;
      }
      syncService.broadcastPlayState(true, activeStation?.id);
    }
  };

  // Band Change
  const handleBandChange = (newBand: FrequencyBand) => {
    if (settings.hapticFeedback && navigator.vibrate) navigator.vibrate([10, 30, 10]);
    setBand(newBand);
    const range = FREQUENCY_RANGES[newBand];
    // Find first station in this band or middle freq
    const bandStation = allStations.find((s) => s.band === newBand);
    if (bandStation) {
      setFrequency(bandStation.frequency);
      setActiveStation(bandStation);
      if (isPlaying) playAudioStream(bandStation.url);
    } else {
      setFrequency(Number(((range.min + range.max) / 2).toFixed(1)));
    }
  };

  // Step frequency down
  const handleStepPrev = () => {
    if (settings.hapticFeedback && navigator.vibrate) navigator.vibrate(5);
    const stations = dialFiltered
      .filter((station) => station.band === band)
      .sort((first, second) => first.frequency - second.frequency);
    if (stations.length === 0) {
      showToast('İstasyon bulunamadı', 'Önce Keşfet bölümünden istasyonları yükleyin.');
      return;
    }

    const currentIndex = stations.findIndex((station) => station.id === activeStation?.id);
    let previousIndex: number;
    if (currentIndex >= 0) {
      previousIndex = (currentIndex - 1 + stations.length) % stations.length;
    } else {
      previousIndex = stations.findLastIndex((station) => station.frequency < frequency);
      if (previousIndex < 0) previousIndex = stations.length - 1;
    }
    tuneToStation(stations[previousIndex], true);
  };

  // Step frequency up
  const handleStepNext = () => {
    if (settings.hapticFeedback && navigator.vibrate) navigator.vibrate(5);
    const stations = dialFiltered
      .filter((station) => station.band === band)
      .sort((first, second) => first.frequency - second.frequency);
    if (stations.length === 0) {
      showToast('İstasyon bulunamadı', 'Önce Keşfet bölümünden istasyonları yükleyin.');
      return;
    }

    const currentIndex = stations.findIndex((station) => station.id === activeStation?.id);
    const nextStation = stations.find((station) => station.frequency > frequency);
    const nextIndex = currentIndex >= 0
      ? (currentIndex + 1) % stations.length
      : nextStation
        ? stations.indexOf(nextStation)
        : 0;
    tuneToStation(stations[nextIndex], true);
  };

  // Auto Scan: keşfet havuzundaki istasyonları frekans sırasıyla gez.
  const handleScanNext = () => {
    if (scanTimerRef.current !== null) return;
    if (isDiscovering) {
      showToast('Kanallar yükleniyor', 'Seçilen ülkenin keşif sonuçları hazırlanıyor.');
      return;
    }

    const bandStations = dialFiltered
      .filter((s) => s.band === band)
      .sort((a, b) => a.frequency - b.frequency);

    if (bandStations.length === 0) {
      showToast('İstasyon bulunamadı', 'Bu bantta kayıtlı yayın yok.');
      return;
    }

    const range = FREQUENCY_RANGES[band];
    const step = range.step;
    const precision = band === 'AM' ? 0 : 1;
    const stationIndex = scanCursorRef.current % bandStations.length;
    const targetStation = bandStations[stationIndex];
    scanCursorRef.current = (stationIndex + 1) % bandStations.length;
    const targetFrequency = targetStation.frequency;
    const direction = targetFrequency >= frequency ? 1 : -1;
    const distance = Math.abs(targetFrequency - frequency);
    const maxSteps = Math.max(1, Math.ceil(distance / step));
    let index = 0;
    let probe = frequency;
    isScanningRef.current = true;
    setIsTuned(false);
    if (audioRef.current) {
      hlsRef.current?.destroy();
      hlsRef.current = null;
      audioRef.current.pause();
      audioRef.current.removeAttribute('src');
      audioRef.current.load();
    }
    setIsPlaying(false);

    const sweep = () => {
      index += 1;
      probe = index >= maxSteps
        ? targetFrequency
        : Number((probe + direction * step).toFixed(precision));
      if (probe > range.max) probe = range.min;
      if (probe < range.min) probe = range.max;
      setFrequency(probe);

      if (index >= maxSteps) {
        isScanningRef.current = false;
        scanTimerRef.current = null;
        tuneToStation(targetStation, true);
        showToast('📻 ' + targetStation.name, `${targetStation.frequency} ${targetStation.band} • ${targetStation.country}`);
        return;
      }

      scanTimerRef.current = window.setTimeout(sweep, 70);
    };

    scanTimerRef.current = window.setTimeout(sweep, 0);
  };

  // Volume Change
  const handleVolumeChange = (newVol: number) => {
    if (settings.hapticFeedback && navigator.vibrate) {
      navigator.vibrate(2);
    }
    setVolume(newVol);
    audioEngine.setMasterVolume(newVol);
    const updated = { ...settings, volume: newVol };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Equalizer Change
  const handleEqualizerChange = (newEq: EqualizerSettings) => {
    setEqualizer(newEq);
    audioEngine.applyEqualizer(newEq);
    StorageService.saveEqualizer(newEq);
  };

  // Favorites Toggle
  const handleToggleFavorite = (station: RadioStation) => {
    const isFav = favorites.includes(station.id);
    let updated: string[];
    if (isFav) {
      updated = favorites.filter((id) => id !== station.id);
      showToast('Favorilerden Çıkarıldı', station.name);
    } else {
      updated = [...favorites, station.id];
      showToast('❤️ Favorilere Eklendi', `${station.name} (${station.frequency} ${station.band})`);
    }
    setFavorites(updated);
    StorageService.saveFavorites(updated);
  };

  const handleAddStationToPlaylist = (playlistId: string, station: RadioStation) => {
    const playlist = playlists.find((item) => item.id === playlistId);
    if (!playlist) return;
    if (playlist.stationIds.includes(station.id)) {
      showToast('İstasyon listede zaten var', playlist.name);
      return;
    }

    const updated = playlists.map((item) =>
      item.id === playlistId
        ? {
            ...item,
            stationIds: [...item.stationIds, station.id],
            updatedAt: new Date().toISOString(),
          }
        : item,
    );
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast('Çalma listesine eklendi', `${station.name} • ${playlist.name}`);
  };

  // Create Playlist
  const handleCreatePlaylist = (name: string, desc: string, color: string) => {
    const newPl: Playlist = {
      id: 'pl_' + Date.now(),
      name,
      description: desc,
      color,
      icon: 'ListMusic',
      stationIds: activeStation ? [activeStation.id] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...playlists, newPl];
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast('Çalma Listesi Oluşturuldu', name);
  };

  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter((p) => p.id !== id);
    setPlaylists(updated);
    StorageService.savePlaylists(updated);
    showToast('Liste Silindi');
  };

  const handleClearHistory = () => {
    StorageService.clearHistory();
    setHistory([]);
    showToast('Dinleme Geçmişi Temizlendi');
  };

  // Add Custom Station
  const handleAddCustomStation = (st: RadioStation) => {
    const updated = [st, ...customStations];
    setCustomStations(updated);
    StorageService.saveCustomStations(updated);
    showToast('Özel Radyo Eklendi', `${st.name} (${st.frequency} ${st.band})`);
  };

  // Mechanical Preset Buttons (1-20)
  const handleSelectPreset = (slot: number) => {
    if (settings.hapticFeedback && navigator.vibrate) navigator.vibrate(15);
    const preset = presetButtons.find((p) => p.slot === slot);
    if (!preset) return;
    const matched = allStations.find((s) => s.id === preset.stationId);
    if (matched) {
      tuneToStation(matched, true);
      showToast(`Mekanik Hafıza P${slot}`, matched.name);
    }
  };

  const handleSaveCurrentToPreset = (slot: number) => {
    if (!activeStation) return;
    const updated = presetButtons.map((p) => {
      if (p.slot === slot) {
        return {
          slot,
          stationId: activeStation.id,
          label: activeStation.name,
        };
      }
      return p;
    });
    setPresetButtons(updated);
    StorageService.savePresetButtons(updated);
    showToast(`Hafızaya Kaydedildi: P${slot}`, activeStation.name);
  };

  const markStationUnavailable = (station: RadioStation) => {
    setUnavailableStationIds((current) => new Set(current).add(station.id));
    setIsPlaying(false);
    setIsLoadingStream(false);
    showToast('Yayın açılamadı', `${station.name} bu oturumda istasyon listesinden çıkarıldı.`);
  };

  // Live Stream Audio Recording to Offline Cassette Tape
  const handleToggleRecording = async () => {
    if (isRecording) {
      const result = await audioEngine.stopRecording();
      setIsRecording(false);
      if (result && activeStation) {
        const newRec: OfflineRecording = {
          id: 'rec_' + Date.now(),
          stationName: activeStation.name,
          frequency: activeStation.frequency,
          band: activeStation.band,
          durationSeconds: result.durationSeconds,
          recordedAt: Date.now(),
          sizeBytes: result.blob.size,
          sizeFormatted: (result.blob.size / (1024 * 1024)).toFixed(2) + ' MB',
          format: result.format,
        };
        await StorageService.saveRecording(newRec, result.blob);
        const allRecs = await StorageService.getAllRecordings();
        setRecordings(allRecs);
        showToast('📼 Kaset Arşivine Kaydedildi!', `${activeStation.name} (${result.durationSeconds} sn)`);
      }
    } else {
      if (!isPlaying) {
        showToast('Kayıt Başlatılamadı', 'Lütfen önce çalan bir radyo istasyonu seçin.');
        return;
      }
      const started = audioEngine.startRecording();
      if (started) {
        setIsRecording(true);
        showToast('🔴 Canlı Radyo Kaydediliyor...', 'İstediğiniz zaman durdurup çevrimdışı kasetinizden dinleyebilirsiniz.');
      }
    }
  };

  const handleDeleteRecording = async (id: string) => {
    await StorageService.deleteRecording(id);
    const allRecs = await StorageService.getAllRecordings();
    setRecordings(allRecs);
    showToast('Kaset Silindi');
  };

  // Sleep Timer
  const handleStartSleepTimer = (minutes: number, fadeOut: boolean) => {
    if (sleepTimerRef.current) clearInterval(sleepTimerRef.current);
    setSleepTimerMinutes(minutes);

    const startTime = Date.now();
    const targetTime = startTime + minutes * 60 * 1000;

    sleepTimerRef.current = window.setInterval(() => {
      const remainingMs = targetTime - Date.now();
      const remainingMin = remainingMs / 60000;

      if (remainingMs <= 0) {
        clearInterval(sleepTimerRef.current!);
        setSleepTimerMinutes(null);
        if (fadeOut) {
          audioEngine.fadeOutAndStop(15, () => {
            setIsPlaying(false);
            showToast('🌙 İyi Uykular', 'Radyo uyku moduna geçti.');
          });
        } else {
          audioRef.current?.pause();
          setIsPlaying(false);
          showToast('🌙 İyi Uykular', 'Radyo durduruldu.');
        }
      } else {
        setSleepTimerMinutes(remainingMin);
      }
    }, 1000);

    showToast('🌙 Uyku Modu Başlatıldı', `${minutes} dakika sonra kapanacak.`);
  };

  const handleCancelSleepTimer = () => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }
    setSleepTimerMinutes(null);
    showToast('Uyku Modu İptal Edildi');
  };

  // Settings Update
  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    StorageService.saveSettings(updated);
  };

  // Realtime Sync Handlers
  const handleJoinRoom = (newRoomId: string) => {
    syncService.joinRoom(newRoomId);
    setRoomId(newRoomId);
    showToast('Odaya Katıldınız', `Canlı Senkronizasyon Odası: ${newRoomId}`);
  };

  const handleSendMessage = (text: string) => {
    const msg = syncService.broadcastChat(text);
    setChatMessages((prev) => [...prev, msg]);
  };

  const handleSendReaction = (emoji: string) => {
    syncService.broadcastReaction(emoji);
    const reactionId = 'react_local_' + Date.now();
    setFloatingReactions((prev) => [
      ...prev,
      { id: reactionId, emoji, x: 20 + Math.random() * 60 },
    ]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== reactionId));
    }, 2500);
  };

  // Keyboard Shortcuts (Space to play, Left/Right arrow to tune, 1-6 for presets)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea', 'select'].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepPrev();
      } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6'].includes(e.code)) {
        const slot = parseInt(e.code.replace('Digit', ''));
        handleSelectPreset(slot);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [band, isPlaying, activeStation, dialFiltered, frequency, presetButtons, settings.hapticFeedback]);

  // MediaSession API Integration for Background Audio Playback & Lock Screen Controls
  useEffect(() => {
    if ('mediaSession' in navigator) {
      if (activeStation) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: activeStation.name,
          artist: `${activeStation.frequency} ${activeStation.band} • ${activeStation.genre} (${activeStation.country})`,
          album: 'VintaRadi Vintage Superheterodyne Radio',
          artwork: [
            { src: '/icon.png', sizes: '96x96', type: 'image/png' },
            { src: '/icon.png', sizes: '128x128', type: 'image/png' },
            { src: '/icon.png', sizes: '192x192', type: 'image/png' },
            { src: '/icon.png', sizes: '512x512', type: 'image/png' },
          ],
        });
      }

      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';

      const handleMediaPlay = async () => {
        if (!audioRef.current) return;
        await audioEngine.resumeContext();
        if (activeStation) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      };

      const handleMediaPause = () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
          audioEngine.stopStaticNoise();
        }
      };

      const handleMediaNext = () => {
        const bandStations = allStations.filter((s) => s.band === band);
        if (bandStations.length === 0) return;
        const currentIndex = bandStations.findIndex((s) => s.id === activeStation?.id);
        const nextIndex = (currentIndex + 1) % bandStations.length;
        tuneToStation(bandStations[nextIndex], true);
      };

      const handleMediaPrev = () => {
        const bandStations = allStations.filter((s) => s.band === band);
        if (bandStations.length === 0) return;
        const currentIndex = bandStations.findIndex((s) => s.id === activeStation?.id);
        const prevIndex = (currentIndex - 1 + bandStations.length) % bandStations.length;
        tuneToStation(bandStations[prevIndex], true);
      };

      try {
        navigator.mediaSession.setActionHandler('play', handleMediaPlay);
        navigator.mediaSession.setActionHandler('pause', handleMediaPause);
        navigator.mediaSession.setActionHandler('previoustrack', handleMediaPrev);
        navigator.mediaSession.setActionHandler('nexttrack', handleMediaNext);
        navigator.mediaSession.setActionHandler('stop', handleMediaPause);
      } catch (e) {
        console.debug('MediaSession action handler error:', e);
      }
    }
  }, [activeStation, isPlaying, band, allStations]);

  const currentTheme = THEMES[settings.theme];

  return (
    <div
      className={`min-h-[100dvh] w-full bg-gradient-to-b ${currentTheme.bgGradient} text-amber-100 flex flex-col justify-center relative overflow-x-hidden transition-all duration-700 py-1 sm:py-4`}
    >
      {/* Invisible HTML5 Audio Stream Element */}
      <audio
        ref={audioRef}
        preload="auto"
        playsInline
        crossOrigin="anonymous"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setIsLoadingStream(false);
          const audio = audioRef.current;
          if (!audio?.currentSrc || !activeStation || unavailableStationIds.has(activeStation.id)) return;
          if (!isPlayableStreamUrl(activeStation.url)) return;
          const currentUrl = new URL(audio.currentSrc);
          const stationUrl = new URL(activeStation.url);
          if (currentUrl.origin === stationUrl.origin && currentUrl.pathname === stationUrl.pathname) {
            markStationUnavailable(activeStation);
          }
        }}
        className="hidden"
      />

      {/* Floating Real-time Emoji Reactions Canvas */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingReactions.map((r) => (
          <div
            key={r.id}
            className="absolute bottom-20 text-3xl animate-bounce transition-all duration-1000"
            style={{
              left: `${r.x}%`,
              animation: 'floatUp 2.4s ease-out forwards',
            }}
          >
            {r.emoji}
          </div>
        ))}
      </div>

      {/* Ambient Lighting Valve Glow Background Overlay */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 rounded-full blur-[140px] pointer-events-none opacity-40 transition-all duration-700"
        style={{
          backgroundColor: currentTheme.ambientLight,
        }}
      />

      {/* Top Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-amber-950/90 border border-amber-600/70 text-amber-100 shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 flex items-center gap-3 max-w-md">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b] animate-ping shrink-0" />
          <div>
            <h4 className="font-semibold text-xs text-amber-200">{toastMessage.title}</h4>
            {toastMessage.desc && (
              <p className="text-[11px] text-amber-400/80 font-sans">{toastMessage.desc}</p>
            )}
          </div>
        </div>
      )}

      {/* Main Radio Dashboard */}
      <div className="relative z-10 flex justify-center px-3 pt-2 sm:pt-0">
        <div
          className="inline-flex items-center gap-2 rounded-full border border-amber-700/40 bg-black/45 px-3 py-1.5 text-xs text-amber-200/90"
          aria-label={onlineCount === null ? 'Gerçek zamanlı bağlantı yapılandırılmamış' : `Bağlı dinleyici sayısı: ${onlineCount}`}
          title={onlineCount === null ? 'Gerçek zamanlı sayaç için Supabase yapılandırması gerekir' : 'Şu anda bağlı uygulama sekmeleri'}
        >
          <Users className="h-3.5 w-3.5 text-amber-400" />
          <span>{onlineCount === null ? '—' : onlineCount} {settings.language === 'tr' ? 'bağlı' : 'online'}</span>
        </div>
      </div>
      <main className="flex-1 flex items-center justify-center py-1 sm:py-4 px-1 sm:px-3 z-10">
        <VintageRadioChassis
          band={band}
          onBandChange={handleBandChange}
          frequency={frequency}
          onFrequencyChange={(f) => setFrequency(f)}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          stations={dialFiltered}
          scanCountries={scanCountries}
          scanCountry={scanCountry}
          onScanCountryChange={setScanCountry}
          sameFrequencyCount={sameFrequencyCount}
          activeStation={activeStation}
          isFavorite={Boolean(activeStation && favorites.includes(activeStation.id))}
          playlists={playlists}
          onToggleFavorite={() => {
            if (activeStation) handleToggleFavorite(activeStation);
          }}
          onAddStationToPlaylist={handleAddStationToPlaylist}
          isTuned={isTuned}
          isLoadingStream={isLoadingStream}
          vuLeft={vuLeft}
          vuRight={vuRight}
          theme={currentTheme}
          settings={settings}
          onLanguageChange={(newLang) => handleUpdateSettings({ ...settings, language: newLang })}
          sleepTimerMinutes={sleepTimerMinutes}
          presets={presetButtons}
          onSelectPreset={handleSelectPreset}
          onSaveCurrentToPreset={handleSaveCurrentToPreset}
          onSelectStation={(st) => tuneToStation(st, true)}
          onScanNext={handleScanNext}
          onStepPrev={handleStepPrev}
          onStepNext={handleStepNext}
          onOpenExplorer={() => setIsExplorerOpen(true)}
          onOpenEqualizer={() => setIsEqualizerOpen(true)}
          onOpenPlaylists={() => {
            setFavoritesActiveTab('playlists');
            setIsFavoritesOpen(true);
          }}
          onOpenFavorites={() => {
            setFavoritesActiveTab('favorites');
            setIsFavoritesOpen(true);
          }}
          onOpenSleepTimer={() => setIsSleepTimerOpen(true)}
          onOpenShare={() => setIsShareOpen(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenLegal={() => {
            setLegalActiveTab('privacy');
            setIsLegalOpen(true);
          }}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      </main>

      {/* Modals */}
      <StationExplorer
        isOpen={isExplorerOpen}
        onClose={() => setIsExplorerOpen(false)}
        onSelectStation={(st) => {
          tuneToStation(st, true);
          setIsExplorerOpen(false);
        }}
        activeStation={activeStation}
        isPlaying={isPlaying}
        favorites={favorites}
        unavailableStationIds={unavailableStationIds}
        onToggleFavorite={handleToggleFavorite}
        onAddCustomStation={handleAddCustomStation}
        onShareStation={(st) => {
          tuneToStation(st, true);
          setIsShareOpen(true);
        }}
        theme={currentTheme}
        language={settings.language}
        onResultsChange={(sts) => setExplorerStations((prev) => mergeApiStations(prev, sts))}
      />

      <EqualizerModal
        isOpen={isEqualizerOpen}
        onClose={() => setIsEqualizerOpen(false)}
        eq={equalizer}
        onChange={handleEqualizerChange}
        theme={currentTheme}
        language={settings.language}
      />

      <FavoritesPlaylistsModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        activeTab={favoritesActiveTab}
        setActiveTab={setFavoritesActiveTab}
        favorites={favorites}
        allStations={allStations}
        playlists={playlists}
        history={history}
        weeklyRecommendation={weeklyRecommendation}
        onSelectStation={(st) => {
          tuneToStation(st, true);
          setIsFavoritesOpen(false);
        }}
        onToggleFavorite={handleToggleFavorite}
        onCreatePlaylist={handleCreatePlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onClearHistory={handleClearHistory}
        onShareStation={(st) => {
          tuneToStation(st, true);
          setIsShareOpen(true);
        }}
        theme={currentTheme}
      />

      <OfflineRecordingsModal
        isOpen={isRecordingsOpen}
        onClose={() => setIsRecordingsOpen(false)}
        recordings={recordings}
        onDeleteRecording={handleDeleteRecording}
        theme={currentTheme}
      />

      <SleepTimerModal
        isOpen={isSleepTimerOpen}
        onClose={() => setIsSleepTimerOpen(false)}
        timerMinutesRemaining={sleepTimerMinutes}
        onStartTimer={handleStartSleepTimer}
        onCancelTimer={handleCancelSleepTimer}
        theme={currentTheme}
      />

      <ShareSyncModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        station={activeStation}
        roomId={roomId}
        listenersCount={syncService.isRealtimeConfigured() ? listenersCount : null}
        messages={chatMessages}
        onJoinRoom={handleJoinRoom}
        onSendMessage={handleSendMessage}
        onSendReaction={handleSendReaction}
        theme={currentTheme}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenLegal={() => {
          setIsSettingsOpen(false);
          setLegalActiveTab('privacy');
          setIsLegalOpen(true);
        }}
        onOpenGuide={() => {
          setIsSettingsOpen(false);
          setIsGuideOpen(true);
        }}
      />

      <LegalInfoModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        theme={currentTheme}
        language={settings.language}
        initialTab={legalActiveTab}
      />

      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        theme={currentTheme}
        language={settings.language}
      />

      {/* Global CSS for floating animation */}
      <style>{`
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-240px) scale(1.4);
          }
        }
      `}</style>
    </div>
  );
}

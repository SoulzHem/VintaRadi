import React, { useState, useRef, useEffect } from 'react';
import { OfflineRecording } from '../types';
import { ThemeConfig } from '../utils/themeConfig';
import {
  CassetteTape,
  Play,
  Pause,
  Trash2,
  Download,
  X,
  Radio,
  Clock,
  HardDrive,
} from 'lucide-react';

interface OfflineRecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordings: OfflineRecording[];
  onDeleteRecording: (id: string) => void;
  theme: ThemeConfig;
}

export const OfflineRecordingsModal: React.FC<OfflineRecordingsModalProps> = ({
  isOpen,
  onClose,
  recordings,
  onDeleteRecording,
  theme,
}) => {
  const [activeRecording, setActiveRecording] = useState<OfflineRecording | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!isOpen && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handlePlayRecording = (rec: OfflineRecording) => {
    if (activeRecording?.id === rec.id && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    setActiveRecording(rec);
    if (audioRef.current && rec.blobUrl) {
      audioRef.current.src = rec.blobUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error('Audio playback error:', err);
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Invisible HTML Audio Element for Offline Playback */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      <div
        className={`relative w-full max-w-2xl h-[92dvh] sm:h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24170e]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${theme.accentBadge}`}>
              <CassetteTape className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200">
                Çevrimdışı Kaset Arşivi & Kayıtlar
              </h2>
              <p className="text-xs text-amber-400/70 font-sans">
                İnternet bağlantısı olmadan dinleyebileceğiniz canlı radyo kayıtlarınız
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vintage Cassette Player Deck Visualization */}
        <div className="p-4 sm:p-6 bg-black/40 border-b border-amber-900/30 flex flex-col items-center">
          <div className="w-full max-w-md h-36 sm:h-44 rounded-2xl bg-gradient-to-b from-[#1c140e] to-[#0d0906] border-2 border-[#5c3e28] shadow-inner p-3 flex flex-col justify-between relative overflow-hidden">
            {/* Cassette Shell Label */}
            <div className="flex items-center justify-between px-2 pt-1 z-10">
              <span className="text-[10px] font-mono-vintage font-bold text-amber-400/80 tracking-widest uppercase">
                VINTARADI HI-FI TAPE • TYPE II
              </span>
              <span className="text-[10px] font-mono font-bold text-red-400 flex items-center gap-1">
                {isPlaying ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    ÇEVRİMDISI ÇALIYOR
                  </>
                ) : (
                  'HAZIR'
                )}
              </span>
            </div>

            {/* Tape Window with Dual Spools */}
            <div className="relative w-full h-16 sm:h-20 bg-neutral-900/90 rounded-xl border border-amber-900/50 flex items-center justify-around px-6 overflow-hidden">
              {/* Left Spool */}
              <div
                className={`w-12 h-12 rounded-full border-4 border-dashed border-amber-300/40 bg-neutral-800 flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-4 h-4 rounded-full bg-amber-950 border border-amber-500/50" />
              </div>

              {/* Tape Bridge */}
              <div className="flex flex-col items-center">
                <span className="text-[11px] font-mono-vintage font-bold text-amber-200">
                  {formatSeconds(currentTime)} / {formatSeconds(duration || activeRecording?.durationSeconds || 0)}
                </span>
                <span className="text-[9px] text-amber-400/60 font-sans truncate max-w-[120px]">
                  {activeRecording ? activeRecording.stationName : 'Kayıt Seçiniz'}
                </span>
              </div>

              {/* Right Spool */}
              <div
                className={`w-12 h-12 rounded-full border-4 border-dashed border-amber-300/40 bg-neutral-800 flex items-center justify-center transition-transform ${
                  isPlaying ? 'animate-spin' : ''
                }`}
                style={{ animationDuration: '3s' }}
              >
                <div className="w-4 h-4 rounded-full bg-amber-950 border border-amber-500/50" />
              </div>
            </div>

            {/* Tape Progress Bar */}
            <div className="w-full bg-black/60 h-1.5 rounded-full overflow-hidden border border-amber-900/30">
              <div
                className="bg-amber-500 h-full transition-all duration-200"
                style={{
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Recordings List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          <div className="flex justify-between items-center text-xs font-mono-vintage text-amber-400/80 uppercase pb-1">
            <span>KAYDEDİLEN CANLI PARÇALAR ({recordings.length})</span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5" />
              IndexedDB Çevrimdışı Bellek
            </span>
          </div>

          {recordings.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-center gap-2 text-amber-400/60">
              <Radio className="w-10 h-10 stroke-1 text-amber-600/40" />
              <p className="font-semibold text-amber-200">Henüz çevrimdışı radyo kaydı yapılmadı</p>
              <p className="text-xs text-amber-400/50 max-w-sm">
                Ana radyo panelindeki kırmızı <b>"KAYDET"</b> düğmesine basarak çalan radyonun o anki akışını kaydedebilir ve internetiniz yokken dinleyebilirsiniz.
              </p>
            </div>
          ) : (
            recordings.map((rec) => {
              const isSelected = activeRecording?.id === rec.id;
              return (
                <div
                  key={rec.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400'
                      : 'bg-black/40 border-amber-900/30 hover:bg-amber-950/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handlePlayRecording(rec)}
                      className={`p-2.5 rounded-xl ${theme.primaryButton} font-bold transition-transform active:scale-95 shadow cursor-pointer`}
                    >
                      {isSelected && isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current" />
                      )}
                    </button>

                    <div>
                      <h4 className="font-semibold text-sm text-amber-100 group-hover:text-amber-300">
                        {rec.stationName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-amber-400/70 font-mono mt-0.5">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatSeconds(rec.durationSeconds)}
                        </span>
                        <span>•</span>
                        <span>{new Date(rec.recordedAt).toLocaleDateString('tr-TR')}</span>
                        <span>•</span>
                        <span>{rec.sizeFormatted}</span>
                        <span>• {(rec.format || 'webm').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {rec.blobUrl && (
                      <a
                        href={rec.blobUrl}
                        download={`vintaradi_${rec.stationName.replace(/\s+/g, '_')}_${rec.id}.${rec.format || 'webm'}`}
                        className="p-2 rounded-lg text-amber-400/70 hover:text-amber-200 hover:bg-amber-900/40 transition-colors"
                        title="Ses Dosyasını İndir"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => onDeleteRecording(rec.id)}
                      className="p-2 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-950/40 transition-colors cursor-pointer"
                      title="Kaydı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

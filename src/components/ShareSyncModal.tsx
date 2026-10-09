import React, { useState } from 'react';
import { RadioStation, SyncMessage } from '../types';
import { syncService } from '../services/syncService';
import { ThemeConfig } from '../utils/themeConfig';
import {
  Share2,
  Users,
  Radio,
  Copy,
  Check,
  Send,
  Sparkles,
  X,
  QrCode,
  MessageSquare,
} from 'lucide-react';

interface ShareSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  station: RadioStation | null;
  roomId: string;
  listenersCount: number;
  messages: SyncMessage[];
  onJoinRoom: (roomId: string) => void;
  onSendMessage: (text: string) => void;
  onSendReaction: (emoji: string) => void;
  theme: ThemeConfig;
}

export const ShareSyncModal: React.FC<ShareSyncModalProps> = ({
  isOpen,
  onClose,
  station,
  roomId,
  listenersCount,
  messages,
  onJoinRoom,
  onSendMessage,
  onSendReaction,
  theme,
}) => {
  const [copied, setCopied] = useState(false);
  const [inputRoomId, setInputRoomId] = useState('');
  const [chatText, setChatText] = useState('');
  const [activeTab, setActiveTab] = useState<'share' | 'sync'>('share');
  const [userName, setUserName] = useState(syncService.getUserName());

  if (!isOpen) return null;

  const shareUrl = syncService.generateShareUrl(station || undefined);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputRoomId.trim()) return;
    onJoinRoom(inputRoomId.trim());
    setInputRoomId('');
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    onSendMessage(chatText.trim());
    setChatText('');
  };

  const handleNameChange = (newName: string) => {
    setUserName(newName);
    syncService.setUserName(newName);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-2xl h-[92dvh] sm:h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('share')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'share'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>Sosyal Paylaşım</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('sync')}
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'sync'
                  ? 'bg-amber-600 text-black shadow-md'
                  : 'text-amber-300/70 hover:text-amber-100 hover:bg-amber-950/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Gerçek Zamanlı Ortak Dinleme</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-black/40 border border-amber-900/50 hover:bg-amber-950/60 text-amber-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: SOCIAL SHARE */}
        {activeTab === 'share' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
            {/* Station Preview Card */}
            {station ? (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950 to-[#2e1a0f] border border-amber-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-900/80 border border-amber-500/40 flex items-center justify-center text-amber-300 font-mono-vintage font-bold text-sm">
                    {station.band}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base text-amber-100">{station.name}</h3>
                    <p className="text-xs text-amber-400/70 font-mono">
                      {station.frequency} {station.band === 'AM' ? 'kHz' : 'MHz'} • {station.country}
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold">
                  CANLI FREKANS
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-black/40 text-xs text-amber-400/60">
                Şu an bir istasyon seçili değil, ana radyo linki paylaşılacak.
              </div>
            )}

            {/* Quick Share Buttons */}
            <div>
              <label className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 block mb-2 font-bold">
                Hızlı Sosyal Ağlarda Paylaş
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => station && syncService.shareToWhatsApp(station)}
                  className="p-3 rounded-xl bg-[#075e54]/80 hover:bg-[#128c7e] border border-emerald-600/40 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => station && syncService.shareToTwitter(station)}
                  className="p-3 rounded-xl bg-[#1d9bf0]/80 hover:bg-[#1d9bf0] border border-sky-400/40 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  X (Twitter)
                </button>
                <button
                  type="button"
                  onClick={() => station && syncService.shareToTelegram(station)}
                  className="p-3 rounded-xl bg-[#229ed9]/80 hover:bg-[#229ed9] border border-cyan-400/40 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  Telegram
                </button>
              </div>
            </div>

            {/* Copy Direct Link */}
            <div>
              <label className="text-xs font-mono-vintage uppercase tracking-wider text-amber-300 block mb-1.5 font-bold">
                Doğrudan Analog Frekans Bağlantısı
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 p-2.5 rounded-xl bg-black/60 border border-amber-900 text-xs text-amber-200 font-mono focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Kopyalandı
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Kopyala
                    </>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-amber-400/60 font-sans mt-1">
                Arkadaşınız bu linki açtığında radyo otomatik olarak tam bu frekansa ve istasyona kilitlenecektir.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: REAL-TIME AIRWAVE SYNC ROOM */}
        {activeTab === 'sync' && (
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
            {/* Room Info Bar */}
            <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 flex items-center justify-between mb-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono-vintage font-bold text-amber-300">
                  ODA: {roomId}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-700/50 text-[10px] text-amber-200">
                  {listenersCount} Dinleyici
                </span>
              </div>

              {/* User Name Tag */}
              <div className="flex items-center gap-1.5">
                <span className="text-amber-400/70">Adınız:</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-28 px-2 py-1 rounded bg-black/60 border border-amber-800 text-amber-100 text-[11px] focus:outline-none"
                />
              </div>
            </div>

            {/* Switch / Create Room Bar */}
            <form onSubmit={handleJoin} className="flex gap-2 mb-3">
              <input
                type="text"
                value={inputRoomId}
                onChange={(e) => setInputRoomId(e.target.value)}
                placeholder="Farklı bir oda kodu girin (örn: CAZ-KULÜBÜ)"
                className="flex-1 p-2 rounded-xl bg-black/50 border border-amber-900 text-xs text-amber-100 placeholder-amber-400/40"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-amber-100 text-xs font-bold transition-colors cursor-pointer"
              >
                Odaya Geç
              </button>
            </form>

            {/* Live Reactions Bar */}
            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-amber-900/30">
              <span className="text-[11px] font-mono-vintage text-amber-400">Canlı Tepki:</span>
              {['❤️', '📻', '🎷', '☕', '✨', '🔥', '🎶'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onSendReaction(emoji)}
                  className="p-1.5 rounded-lg bg-black/40 hover:bg-amber-900/40 border border-amber-900/40 text-base transition-transform hover:scale-125 active:scale-95 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Chat Messages Feed */}
            <div className="flex-1 overflow-y-auto space-y-2 p-2 rounded-xl bg-black/30 border border-amber-900/30 text-xs mb-3">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-amber-400/50 gap-1">
                  <MessageSquare className="w-8 h-8 opacity-40" />
                  <p>Odadaki dinleyicilerle canlı sohbet edin ve frekans paylaşın.</p>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="p-2 rounded-lg bg-amber-950/40 border border-amber-900/30 flex flex-col">
                    <div className="flex justify-between items-center text-[10px] text-amber-400/70 font-mono">
                      <span className="font-bold text-amber-300">{m.sender}</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-amber-100 mt-0.5">{m.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="flex gap-2">
              <input
                type="text"
                value={chatText}
                onChange={(e) => setChatText(e.target.value)}
                placeholder="Odaya mesaj yazın..."
                className="flex-1 p-2.5 rounded-xl bg-black/60 border border-amber-900 text-xs text-amber-100 placeholder-amber-400/40 focus:outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                Gönder
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

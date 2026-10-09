import { FrequencyBand, RadioStation, SyncMessage } from '../types';
import { createClient, RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';

export type SyncEventType =
  | 'TUNE_STATION'
  | 'PLAY_STATE'
  | 'LISTENER_JOIN'
  | 'LISTENER_LEAVE'
  | 'SEND_REACTION'
  | 'SEND_CHAT'
  | 'SYNC_PING';

export interface SyncPayload {
  type: SyncEventType;
  roomId: string;
  senderId: string;
  senderName: string;
  timestamp: number;
  data?: {
    stationId?: string;
    stationName?: string;
    frequency?: number;
    band?: FrequencyBand;
    isPlaying?: boolean;
    emoji?: string;
    message?: SyncMessage;
  };
}

class RealtimeSyncService {
  private channel: BroadcastChannel | null = null;
  private currentRoomId: string = 'AIRWAVE-GLOBAL';
  private userName: string = '';
  private clientId: string = '';
  private listeners: Array<(payload: SyncPayload) => void> = [];
  private supabase: SupabaseClient | null = null;
  private roomChannel: RealtimeChannel | null = null;
  private globalChannel: RealtimeChannel | null = null;
  private roomPresenceListeners: Array<(count: number) => void> = [];
  private onlineListeners: Array<(count: number) => void> = [];
  private connected = false;

  constructor() {
    this.clientId = 'user_' + Math.random().toString(36).substring(2, 9);
    const storedName = localStorage.getItem('vintaradi_username');
    this.userName = storedName || 'Analog Dinleyici #' + Math.floor(100 + Math.random() * 900);
    this.initBroadcastChannel();
  }

  private initBroadcastChannel() {
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        this.channel = new BroadcastChannel('vintaradi_airwave_sync');
        this.channel.onmessage = (event) => {
          if (event.data && event.data.roomId === this.currentRoomId) {
            this.notifyListeners(event.data);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }
  }

  public connect() {
    if (this.connected) return;
    this.connected = true;
    const { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env;
    if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
      console.warn('Supabase Realtime is not configured; cross-device rooms and online presence are disabled.');
      return;
    }
    this.supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
    this.globalChannel = this.supabase.channel('vintaradi:global-presence', {
      config: { presence: { key: this.clientId } },
    });
    this.globalChannel
      .on('presence', { event: 'sync' }, () => {
        const count = Object.keys(this.globalChannel?.presenceState() || {}).length;
        this.onlineListeners.forEach((callback) => callback(count));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          void this.globalChannel?.track({ name: this.userName, joinedAt: Date.now() });
        }
      });
    this.connectRoom();
  }

  public isRealtimeConfigured(): boolean {
    return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
  }

  private connectRoom() {
    if (!this.supabase) return;
    if (this.roomChannel) void this.supabase.removeChannel(this.roomChannel);
    const roomChannel = this.supabase.channel(`vintaradi:room:${this.currentRoomId}`, {
      config: { broadcast: { self: false }, presence: { key: this.clientId } },
    });
    this.roomChannel = roomChannel;
    roomChannel
      .on('broadcast', { event: 'sync' }, ({ payload }) => {
        if (payload && payload.roomId === this.currentRoomId && payload.senderId !== this.clientId) {
          this.notifyListeners(payload as SyncPayload);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const count = Object.keys(roomChannel.presenceState()).length;
        this.roomPresenceListeners.forEach((callback) => callback(count));
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          void roomChannel.track({ name: this.userName, joinedAt: Date.now() });
        }
      });
  }

  public subscribeRoomPresence(callback: (count: number) => void): () => void {
    this.roomPresenceListeners.push(callback);
    return () => {
      this.roomPresenceListeners = this.roomPresenceListeners.filter((listener) => listener !== callback);
    };
  }

  public subscribeOnlineCount(callback: (count: number) => void): () => void {
    this.onlineListeners.push(callback);
    return () => {
      this.onlineListeners = this.onlineListeners.filter((listener) => listener !== callback);
    };
  }

  public subscribe(callback: (payload: SyncPayload) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners(payload: SyncPayload) {
    this.listeners.forEach(cb => {
      try {
        cb(payload);
      } catch (e) {
        console.error(e);
      }
    });
  }

  public setUserName(name: string) {
    this.userName = name;
    localStorage.setItem('vintaradi_username', name);
  }

  public getUserName(): string {
    return this.userName;
  }

  public getClientId(): string {
    return this.clientId;
  }

  public joinRoom(roomId: string) {
    this.currentRoomId = roomId.toUpperCase().trim();
    this.connectRoom();
    this.broadcast({
      type: 'LISTENER_JOIN',
      roomId: this.currentRoomId,
      senderId: this.clientId,
      senderName: this.userName,
      timestamp: Date.now(),
    });
  }

  public getRoomId(): string {
    return this.currentRoomId;
  }

  public broadcast(payload: SyncPayload) {
    this.notifyListeners(payload); // local dispatch
    if (this.channel) {
      try {
        this.channel.postMessage(payload);
      } catch (err) {
        console.error('Broadcast send error:', err);
      }
    }
    if (this.roomChannel) {
      void this.roomChannel.send({ type: 'broadcast', event: 'sync', payload })
        .then((status) => {
          if (status !== 'ok') console.warn('Realtime room message was not delivered:', status);
        })
        .catch((error: unknown) => console.error('Realtime room message failed:', error));
    }
  }

  public broadcastTune(station: RadioStation, isPlaying: boolean) {
    this.broadcast({
      type: 'TUNE_STATION',
      roomId: this.currentRoomId,
      senderId: this.clientId,
      senderName: this.userName,
      timestamp: Date.now(),
      data: {
        stationId: station.id,
        stationName: station.name,
        frequency: station.frequency,
        band: station.band,
        isPlaying,
      }
    });
  }

  public broadcastPlayState(isPlaying: boolean, stationId?: string) {
    this.broadcast({
      type: 'PLAY_STATE',
      roomId: this.currentRoomId,
      senderId: this.clientId,
      senderName: this.userName,
      timestamp: Date.now(),
      data: {
        isPlaying,
        stationId,
      }
    });
  }

  public broadcastReaction(emoji: string) {
    this.broadcast({
      type: 'SEND_REACTION',
      roomId: this.currentRoomId,
      senderId: this.clientId,
      senderName: this.userName,
      timestamp: Date.now(),
      data: {
        emoji,
      }
    });
  }

  public broadcastChat(text: string): SyncMessage {
    const msg: SyncMessage = {
      id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      sender: this.userName,
      text: text.trim(),
      timestamp: Date.now(),
    };
    this.broadcast({
      type: 'SEND_CHAT',
      roomId: this.currentRoomId,
      senderId: this.clientId,
      senderName: this.userName,
      timestamp: Date.now(),
      data: {
        message: msg,
      }
    });
    return msg;
  }

  // --- Social Media Share Helpers ---
  public generateShareUrl(station?: RadioStation): string {
    const base = window.location.origin + window.location.pathname;
    if (!station) return base;
    const params = new URLSearchParams();
    params.set('station', station.id);
    params.set('freq', station.frequency.toString());
    params.set('band', station.band);
    params.set('name', encodeURIComponent(station.name));
    params.set('room', this.currentRoomId);
    return `${base}?${params.toString()}`;
  }

  public shareToWhatsApp(station: RadioStation) {
    const url = this.generateShareUrl(station);
    const text = `📻 VintaRadi üzerinden ${station.name} (${station.frequency} ${station.band}) dinliyorum! Nostaljik analog frekansa katılmak için tıkla: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  }

  public shareToTwitter(station: RadioStation) {
    const url = this.generateShareUrl(station);
    const text = `Nostaljik analog radyo @VintaRadi ile ${station.name} (${station.frequency} ${station.band}) dinliyorum. Birlikte dinleyelim:`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  }

  public shareToTelegram(station: RadioStation) {
    const url = this.generateShareUrl(station);
    const text = `📻 VintaRadi — ${station.name} (${station.frequency} ${station.band}) yayında!`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
  }
}

export const syncService = new RealtimeSyncService();

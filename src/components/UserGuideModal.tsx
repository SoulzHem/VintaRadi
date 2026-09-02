import React, { useState, useEffect } from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { LanguageCode } from '../types';
import {
  HelpCircle,
  Radio,
  Sliders,
  CassetteTape,
  Globe,
  Heart,
  Share2,
  Moon,
  Volume2,
  X,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
} from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  language?: LanguageCode;
}

interface GuideSlide {
  id: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  badgeTr: string;
  badgeEn: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  visualPreview: React.ReactNode;
  stepsTr: string[];
  stepsEn: string[];
  tipTr: string;
  tipEn: string;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  theme,
  language = 'tr',
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Animated demonstration states
  const [demoFreq, setDemoFreq] = useState(96.4);
  const [demoTuning, setDemoTuning] = useState(true);

  const isTr = language === 'tr';

  const slides: GuideSlide[] = [
    {
      id: 'dial-tuning',
      titleTr: 'Analog Kadran & Canlı Frekans Ayarı',
      titleEn: 'Analog Dial & Dynamic Tuning',
      subtitleTr: 'Gerçek vintage radyo hissiyle akıcı istasyon arama',
      subtitleEn: 'Authentic retro mechanical radio experience',
      badgeTr: 'Temel Özellik',
      badgeEn: 'Core Feature',
      icon: Radio,
      accentColor: 'from-amber-500 to-amber-700',
      visualPreview: (
        <div className="w-full h-44 sm:h-52 rounded-xl bg-[#140b06] border border-amber-900/60 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
          {/* Animated Dial simulation */}
          <div className="flex items-center justify-between text-[11px] font-mono-vintage text-amber-400/80 border-b border-amber-900/40 pb-1">
            <span>FM 87.5 — 108.0 MHz</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              SİNYAL KİLİTLİ
            </span>
          </div>

          <div className="relative h-16 sm:h-20 bg-black/60 rounded-lg border border-amber-950/80 flex items-center justify-center overflow-hidden px-4">
            {/* Frequency scale markers */}
            <div className="absolute inset-0 flex justify-between items-center opacity-30 px-3 font-mono text-[9px] text-amber-200 pointer-events-none">
              <span>88</span>
              <span>92</span>
              <span>96</span>
              <span>100</span>
              <span>104</span>
              <span>108</span>
            </div>

            {/* Glowing Amber Needle */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-amber-400 shadow-[0_0_12px_#f59e0b] z-10 transition-all duration-700 ease-out"
              style={{ left: `${((demoFreq - 87.5) / (108 - 87.5)) * 80 + 10}%` }}
            >
              <div className="absolute top-1 -left-1.5 w-4 h-4 rounded-full bg-amber-500 border border-black shadow" />
            </div>

            {/* Digital Readout */}
            <div className="z-20 bg-black/80 px-4 py-1.5 rounded-lg border border-amber-800/80 text-center">
              <div className="text-xl sm:text-2xl font-mono-vintage font-bold text-amber-300 tracking-wider">
                {demoFreq.toFixed(1)} <span className="text-xs text-amber-500">MHz</span>
              </div>
              <div className="text-[10px] text-amber-400/70 truncate max-w-[160px]">
                TRT Radyo 3 Klasik
              </div>
            </div>
          </div>

          {/* Interactive button to test dial move */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-amber-900/30">
            <span className="text-[10px] text-amber-400/70 font-mono">Döner Düğme veya Sürükle:</span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setDemoFreq((f) => (f > 88 ? +(f - 2.5).toFixed(1) : 106.0))}
                className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800/60 hover:bg-amber-900"
              >
                - Geri
              </button>
              <button
                type="button"
                onClick={() => setDemoFreq((f) => (f < 107 ? +(f + 2.5).toFixed(1) : 89.2))}
                className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-mono border border-amber-800/60 hover:bg-amber-900"
              >
                + İleri
              </button>
            </div>
          </div>
        </div>
      ),
      stepsTr: [
        'Büyük altın TUNING döner düğmesini çevirerek veya sarı ibreyi doğrudan parmağınızla sürükleyerek istasyon arayabilirsiniz.',
        'SCAN butonuna bastığınızda radyo otomatik olarak bir sonraki çalan frekansı bulup kilitlenir.',
        'FM, AM ve Kısa Dalga (SW) bantları arasında geçiş yaparak dünya radyolarını keşfedebilirsiniz.',
      ],
      stepsEn: [
        'Turn the large golden TUNING knob or touch & drag the glowing amber needle to tune frequencies.',
        'Press SCAN to automatically seek and lock onto the next active live station.',
        'Switch between FM, AM, and Shortwave (SW) bands to explore global transmissions.',
      ],
      tipTr: 'İbre tam istasyonun üstüne geldiğinde yeşil Sinyal Kilitlendi lambası yanar.',
      tipEn: 'The green Signal Locked indicator lights up when aligned with a broadcast frequency.',
    },
    {
      id: 'world-explorer',
      titleTr: '35.000+ İstasyonluk Dünya Atlası',
      titleEn: '35,000+ Global Station Explorer',
      subtitleTr: 'Ülke, tür, dil veya popülerliğe göre anında arama',
      subtitleEn: 'Instant filtering by country, genre, language & bitrate',
      badgeTr: 'Geniş Dizin',
      badgeEn: 'Massive Library',
      icon: Globe,
      accentColor: 'from-blue-600 to-indigo-800',
      visualPreview: (
        <div className="w-full h-44 sm:h-52 rounded-xl bg-[#0e141a] border border-blue-900/60 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-blue-300 font-bold flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              CANLI DÜNYA ATLASI
            </span>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60">
              35.420 İstasyon
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-black/60 border border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🇹🇷</span>
                <div>
                  <div className="text-xs font-bold text-blue-200">Kral FM (98.4 MHz)</div>
                  <div className="text-[9px] text-blue-400/70">Arabesk • İstanbul • 128 kbps</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-bold">
                Dinle
              </span>
            </div>

            <div className="p-2 rounded-lg bg-black/60 border border-blue-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">🇬🇧</span>
                <div>
                  <div className="text-xs font-bold text-blue-200">BBC Radio 1</div>
                  <div className="text-[9px] text-blue-400/70">Pop / Top 40 • Londra • 320 kbps</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 text-[10px] font-bold">
                Dinle
              </span>
            </div>
          </div>

          <div className="text-[10px] text-blue-300/80 font-mono text-center bg-blue-950/40 py-1 rounded">
            Kendi özel MP3/AAC/HLS akış URL'lerinizi de ekleyebilirsiniz!
          </div>
        </div>
      ),
      stepsTr: [
        'Alt bardaki "Keşfet" (Dünya simgesi) butonuna basarak küresel kataloğu açın.',
        'Türkiye, Almanya, ABD gibi ülkeleri filtreleyin veya Caz, Nostalji, Rock, Haber türlerini arayın.',
        'İstasyonun yanındaki Kalp simgesine basarak hızlı erişim için Favorilerinize ekleyin.',
      ],
      stepsEn: [
        'Open the global directory via the "Explore" (Globe icon) button on the master deck.',
        'Filter by country or search for genres like Jazz, Classical, Retro 80s, or News.',
        'Tap the Heart icon on any station to bookmark it into your primary favorites.',
      ],
      tipTr: 'Arama çubuğuna şehir veya sanatçı ismi yazarak yerel ve tematik radyoları bulabilirsiniz.',
      tipEn: 'Type specific cities or music keywords in the search bar for localized broadcasts.',
    },
    {
      id: 'tape-recording',
      titleTr: 'Çevrimdışı Kaset Kayıt Stüdyosu',
      titleEn: 'Offline Tape Recording Studio',
      subtitleTr: 'Canlı yayını tek tıkla kaydedin ve internetsiz dinleyin',
      subtitleEn: 'Record live radio directly to offline cassette archives',
      badgeTr: 'Özel Stüdyo',
      badgeEn: 'Tape Deck',
      icon: CassetteTape,
      accentColor: 'from-amber-600 to-rose-700',
      visualPreview: (
        <div className="w-full h-44 sm:h-52 rounded-xl bg-[#1a0f0a] border border-amber-900/60 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <CassetteTape className="w-4 h-4 text-amber-400" />
              VINTAGE KASET MEKANİZMASI
            </span>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              CANLI REC
            </span>
          </div>

          {/* Cassette Tape Visual Animation */}
          <div className="h-20 bg-[#2b1810] rounded-xl border-2 border-amber-700/60 p-2 flex flex-col justify-between relative shadow-lg">
            <div className="flex justify-between items-center px-2">
              <span className="text-[9px] font-mono text-amber-300 font-bold">TYPE I — NORMAL BIAS</span>
              <span className="text-[9px] font-mono text-amber-400">REC: 01:24</span>
            </div>

            <div className="flex items-center justify-around my-auto">
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center animate-spin">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
              </div>
              <div className="h-5 w-24 bg-amber-950/80 rounded border border-amber-900/60 flex items-center justify-center">
                <span className="text-[8px] font-mono text-amber-300/80">GECE YAYINI KAYDI</span>
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-amber-400 flex items-center justify-center animate-spin">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-200" />
              </div>
            </div>
          </div>

          <div className="text-[10px] text-amber-300/90 font-mono text-center">
            Kayıtlar cihaz hafızasına kaydedilir, internetsiz dinlenebilir ve MP3/WAV indirilebilir.
          </div>
        </div>
      ),
      stepsTr: [
        'Sevdiğiniz bir şarkı veya program çalarken kırmızı "Kayıt (REC)" butonuna dokunun.',
        'Kaydı tamamlamak için tekrar butona basın; kasetiniz anında arşivinize kaydedilir.',
        'Kaset Arşivi menüsünden eski kayıtlarınızı dinleyebilir veya telefonunuza ses dosyası olarak indirebilirsiniz.',
      ],
      stepsEn: [
        'Hit the red "REC" button on the deck whenever your favorite track or talk show airs.',
        'Press again to finish; your tape is instantly saved to your local device archive.',
        'Access the Tape Deck anytime to play back offline or download the audio file directly.',
      ],
      tipTr: 'Kaset kayıtları mikrofonu değil, doğrudan radyo istasyonunun yüksek kaliteli dijital sesini kaydeder.',
      tipEn: 'Tape recordings capture the pristine direct audio stream with zero background microphone noise.',
    },
    {
      id: 'vacuum-equalizer',
      titleTr: '5-Bant Ekolayzır & Vakum Tüp Simülasyonu',
      titleEn: '5-Band Equalizer & Vacuum Tube DSP',
      subtitleTr: 'Lambalı amfi sıcaklığı ve analog bas güçlendirmesi',
      subtitleEn: 'Warm vintage valve saturation & studio-grade filtering',
      badgeTr: 'Akustik DSP',
      badgeEn: 'Audio Engine',
      icon: Sliders,
      accentColor: 'from-amber-600 to-orange-700',
      visualPreview: (
        <div className="w-full h-44 sm:h-52 rounded-xl bg-[#190f0a] border border-amber-900/60 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              VAKUM TÜP DSP & 5-BANT
            </span>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
              Tüp Sıcaklığı: %85
            </span>
          </div>

          {/* Equalizer Frequency Sliders Demo */}
          <div className="grid grid-cols-5 gap-2 items-end h-20 px-4 py-2 bg-black/60 rounded-xl border border-amber-950">
            {[
              { label: '60Hz', h: '75%' },
              { label: '250Hz', h: '60%' },
              { label: '1kHz', h: '45%' },
              { label: '4kHz', h: '70%' },
              { label: '12kHz', h: '85%' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                <div className="w-2.5 rounded-full bg-amber-950 relative h-full flex items-end">
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-full shadow-[0_0_8px_#f59e0b]"
                    style={{ height: b.h }}
                  />
                </div>
                <span className="text-[8px] font-mono text-amber-400/80">{b.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-amber-300 font-mono bg-black/40 px-3 py-1 rounded">
            <span>Hazır Profiller:</span>
            <span className="text-amber-400 font-bold">Nostaljik Plak • Akustik • Caz • Bas</span>
          </div>
        </div>
      ),
      stepsTr: [
        'Ekolayzır butonuna basarak 60Hz, 250Hz, 1kHz, 4kHz ve 12kHz frekans bantlarını isteğinize göre şekillendirin.',
        'Vakum Tüp (Tube Warmth) düğmesini artırarak 1960’ların lambalı amfi harmoniklerini etkinleştirin.',
        'Nostaljik Plak, Gece Kulübü, Vokal ve Akustik gibi hazır profiller arasından seçim yapabilirsiniz.',
      ],
      stepsEn: [
        'Shape your frequency curve across 60Hz, 250Hz, 1kHz, 4kHz, and 12kHz.',
        'Turn up the Vacuum Tube Warmth control for authentic 1960s valve amplifier saturation.',
        'Select from hand-tuned presets like Vinyl Warmth, Late Night Lounge, Vocal Clarity, and Deep Bass.',
      ],
      tipTr: 'Düşük kaliteli akışlarda bile tüp simülasyonu sese zengin bir derinlik kazandırır.',
      tipEn: 'The analog tube simulation restores warmth and richness even to compressed audio streams.',
    },
    {
      id: 'playlists-sleep',
      titleTr: 'Çalma Listeleri & Uyku Zamanlayıcısı',
      titleEn: 'Smart Playlists & Sleep Timer',
      subtitleTr: 'Radyolarınızı kategorilere ayırın, müzikle uykuya dalın',
      subtitleEn: 'Organize personal collections & fall asleep with auto-off timer',
      badgeTr: 'Konfor',
      badgeEn: 'Convenience',
      icon: Moon,
      accentColor: 'from-indigo-600 to-purple-800',
      visualPreview: (
        <div className="w-full h-44 sm:h-52 rounded-xl bg-[#120f1a] border border-indigo-900/60 p-3 flex flex-col justify-between relative overflow-hidden shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-indigo-300 font-bold flex items-center gap-1.5">
              <Moon className="w-4 h-4 text-indigo-400" />
              ZAMANLAYICI & LİSTELER
            </span>
            <span className="text-[9.5px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60">
              Kalan Süre: 45 dk
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="p-2 rounded-lg bg-black/60 border border-indigo-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">📻</span>
                <div>
                  <div className="text-xs font-bold text-indigo-200">Çalışma & Odaklanma Listesi</div>
                  <div className="text-[9px] text-indigo-400/70">8 İstasyon • Lo-Fi & Klasik</div>
                </div>
              </div>
              <span className="text-[10px] text-indigo-300 font-mono">Çal</span>
            </div>

            <div className="p-2 rounded-lg bg-black/60 border border-indigo-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm">🌙</span>
                <div>
                  <div className="text-xs font-bold text-indigo-200">Kademeli Ses Kısma (Fade-Out)</div>
                  <div className="text-[9px] text-indigo-400/70">Süre bittiğinde radyo yumuşakça susar</div>
                </div>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">Aktif</span>
            </div>
          </div>

          <div className="text-[10px] text-indigo-300/90 font-mono text-center bg-indigo-950/40 py-1 rounded">
            15, 30, 45, 60 veya 90 dakikalık zamanlayıcı seçenekleri
          </div>
        </div>
      ),
      stepsTr: [
        'Uyku Zamanlayıcı (Ay simgesi) butonuna basarak 15, 30, 45, 60 veya 90 dakikalık geri sayım başlatın.',
        'Zamanlayıcı bittiğinde radyo sesi aniden kesilmez, yumuşak bir biçimde azalarak (Fade-out) kapanır.',
        'Çalma Listeleri menüsünden "Sabah Haberleri", "Caz Gecesi" gibi özel istasyon koleksiyonları oluşturun.',
      ],
      stepsEn: [
        'Set an automatic sleep timer for 15, 30, 45, 60, or 90 minutes via the Moon icon.',
        'When time expires, the sound softly fades out instead of abruptly stopping.',
        'Create custom mood-based radio collections like "Morning Brew" or "Midnight Jazz".',
      ],
      tipTr: 'Uyku modu gece bataryanızın gereksiz tükenmesini ve radyoyu açık unutmanızı önler.',
      tipEn: 'Sleep timer protects device battery and prevents accidental overnight streaming.',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  // Auto-play slideshow support
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[92dvh] sm:max-h-[86vh] rounded-2xl border-2 ${theme.chassisBorder} bg-gradient-to-b from-[#24160d] via-[#190e08] to-[#0f0905] text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Sticky Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200 leading-tight">
                {isTr ? 'VintaRadi Kullanım & Tanıtım Rehberi' : 'VintaRadi Interactive User Guide'}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans line-clamp-1">
                {isTr
                  ? 'Tüm özellikler, analog kadran kullanımı, kaset kaydı ve ses ayarları'
                  : 'Master the analog dial, tape recorder, DSP equalizer and world explorer'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAutoPlaying((p) => !p)}
              className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-600 text-black border-amber-400 shadow'
                  : 'bg-black/50 text-amber-300/80 border-amber-900/60 hover:bg-amber-950'
              }`}
              title={isTr ? 'Otomatik Oynat / Tur' : 'Auto Play Guide'}
            >
              {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span className="hidden xs:inline">{isTr ? 'Otomatik Tur' : 'Auto Tour'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-black/50 border border-amber-900/60 hover:bg-amber-950/80 text-amber-300 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicators Bar */}
        <div className="px-3 sm:px-5 py-2 border-b border-amber-900/30 bg-black/40 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto custom-scrollbar py-0.5">
            {slides.map((slide, idx) => {
              const Icon = slide.icon;
              const isActive = idx === currentSlideIndex;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentSlideIndex(idx);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-amber-600 text-black shadow-md scale-105'
                      : 'bg-black/30 text-amber-400/70 hover:bg-amber-950/40 border border-amber-900/40'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {idx + 1}. {isTr ? slide.badgeTr : slide.badgeEn}
                  </span>
                  <span className="sm:hidden">{idx + 1}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] font-mono text-amber-400/70 shrink-0 ml-2">
            {currentSlideIndex + 1} / {slides.length}
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans custom-scrollbar overscroll-contain">
          {/* Slide Heading & Badge */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-900/30 pb-3">
            <div>
              <span className="text-[10.5px] font-mono font-bold uppercase tracking-wider text-amber-400 block mb-0.5">
                {isTr ? currentSlide.badgeTr : currentSlide.badgeEn} • Bölüm {currentSlideIndex + 1}
              </span>
              <h3 className="text-base sm:text-xl font-display-vintage font-bold text-amber-100">
                {isTr ? currentSlide.titleTr : currentSlide.titleEn}
              </h3>
              <p className="text-xs text-amber-300/80 mt-0.5">
                {isTr ? currentSlide.subtitleTr : currentSlide.subtitleEn}
              </p>
            </div>
          </div>

          {/* Interactive Visual Demonstration Box */}
          <div className="my-2">{currentSlide.visualPreview}</div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-2.5 pt-2">
            <h4 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {isTr ? 'Nasıl Kullanılır?' : 'How to Use:'}
            </h4>

            <div className="space-y-2 pl-2">
              {(isTr ? currentSlide.stepsTr : currentSlide.stepsEn).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
                  <span className="w-5 h-5 rounded-full bg-amber-950 border border-amber-700/60 text-amber-400 text-[11px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tip Box */}
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40 flex items-start gap-2.5 mt-3">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200/90 leading-relaxed">
              <strong className="text-amber-300 font-bold block mb-0.5">
                {isTr ? 'İpucu & Püf Noktası:' : 'Pro-Tip:'}
              </strong>
              {isTr ? currentSlide.tipTr : currentSlide.tipEn}
            </div>
          </div>
        </div>

        {/* Sticky Footer Navigation */}
        <div className="p-3 sm:p-4 border-t border-amber-900/40 flex items-center justify-between shrink-0 bg-[#0f0905]/95 backdrop-blur-sm z-20">
          <button
            type="button"
            onClick={() => {
              setIsAutoPlaying(false);
              setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
            }}
            className="px-3 sm:px-4 py-2 rounded-xl bg-black/50 hover:bg-amber-950/60 border border-amber-900/60 text-amber-300 font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-1 min-h-[38px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isTr ? 'Önceki' : 'Previous'}</span>
          </button>

          {/* Quick Dots */}
          <div className="flex items-center gap-1.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsAutoPlaying(false);
                  setCurrentSlideIndex(idx);
                }}
                className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentSlideIndex
                    ? 'bg-amber-400 w-5 sm:w-6 shadow-[0_0_8px_#f59e0b]'
                    : 'bg-amber-900/60 hover:bg-amber-700'
                }`}
                title={`Bölüm ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              if (currentSlideIndex === slides.length - 1) {
                onClose();
              } else {
                setIsAutoPlaying(false);
                setCurrentSlideIndex((prev) => prev + 1);
              }
            }}
            className="px-4 sm:px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-1 min-h-[38px]"
          >
            <span>
              {currentSlideIndex === slides.length - 1
                ? isTr
                  ? 'Anladım, Başla'
                  : 'Get Started'
                : isTr
                ? 'Sonraki'
                : 'Next'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

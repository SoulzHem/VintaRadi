import React, { useState } from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { LanguageCode } from '../types';
import {
  Download,
  Copy,
  Check,
  Smartphone,
  Image as ImageIcon,
  FileText,
  Package,
  X,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

interface PlayStorePackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  language?: LanguageCode;
}

export const PlayStorePackageModal: React.FC<PlayStorePackageModalProps> = ({
  isOpen,
  onClose,
  theme,
  language = 'tr',
}) => {
  const [activeTab, setActiveTab] = useState<'graphics' | 'texts' | 'aab_guide'>('graphics');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isTr = language === 'tr';

  const graphicsList = [
    {
      id: 'icon_512',
      title: isTr ? 'Uygulama Simgesi (App Icon)' : 'Application Icon',
      size: '512 x 512 px',
      requirement: isTr ? 'Google Play Store Zorunlu' : 'Google Play Mandatory',
      url: '/playstore-assets/icon_512.jpg',
      aspect: 'aspect-square max-w-[140px]',
      desc: isTr
        ? 'Altın pirinç çerçeveli, lambalı tüp ve nostaljik ibreli 3D radyo simgesi.'
        : 'High-resolution vintage brass bezel tube radio icon.',
    },
    {
      id: 'banner_1024',
      title: isTr ? 'Özellik Grafiği (Feature Banner)' : 'Feature Graphic Banner',
      size: '1024 x 500 px',
      requirement: isTr ? 'Google Play Store Zorunlu' : 'Google Play Mandatory',
      url: '/playstore-assets/banner_1024x500.jpg',
      aspect: 'aspect-[1024/500] w-full',
      desc: isTr
        ? 'Mağaza üst bannerı: Ahşap nostaljik radyo, kaset çalar ve sinematik ışıklandırma.'
        : 'Store front banner with vintage radio chassis and cassette deck.',
    },
    {
      id: 'screenshot_1',
      title: isTr ? 'Ekran 1: Analog Kadran & Canlı Radyo' : 'Screen 1: Analog Tuning Dial',
      size: '1080 x 1920 px (9:16)',
      requirement: isTr ? 'Telefon Ekranı' : 'Phone Screenshot',
      url: '/playstore-assets/screenshot_1_dial.jpg',
      aspect: 'aspect-[9/16] max-w-[130px]',
      desc: isTr ? 'Analog tuning kadranı ve hareketli VU metreler.' : 'Mechanical tuning needle & active VU meters.',
    },
    {
      id: 'screenshot_2',
      title: isTr ? 'Ekran 2: 35.000+ Dünya Radyosu' : 'Screen 2: 35,000+ World Stations',
      size: '1080 x 1920 px (9:16)',
      requirement: isTr ? 'Telefon Ekranı' : 'Phone Screenshot',
      url: '/playstore-assets/screenshot_2_world.jpg',
      aspect: 'aspect-[9/16] max-w-[130px]',
      desc: isTr ? 'Ülke bayrakları ve canlı dünya radyo kataloğu.' : 'Global catalog with country flags and filters.',
    },
    {
      id: 'screenshot_3',
      title: isTr ? 'Ekran 3: Çevrimdışı Kaset Kaydı' : 'Screen 3: Offline Tape Recorder',
      size: '1080 x 1920 px (9:16)',
      requirement: isTr ? 'Telefon Ekranı' : 'Phone Screenshot',
      url: '/playstore-assets/screenshot_3_tape.jpg',
      aspect: 'aspect-[9/16] max-w-[130px]',
      desc: isTr ? 'Canlı yayından kaset bandına internetsiz ses kaydı.' : 'Recording live broadcast to vintage cassettes.',
    },
    {
      id: 'screenshot_4',
      title: isTr ? 'Ekran 4: 5-Bant Vakum Tüp Ekolayzır' : 'Screen 4: 5-Band Tube Equalizer',
      size: '1080 x 1920 px (9:16)',
      requirement: isTr ? 'Telefon Ekranı' : 'Phone Screenshot',
      url: '/playstore-assets/screenshot_4_equalizer.jpg',
      aspect: 'aspect-[9/16] max-w-[130px]',
      desc: isTr ? 'Lambalı amfi harmonikleri ve analog ses filtreleri.' : 'Tube amp saturation & acoustic presets.',
    },
  ];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const storeTexts = {
    titleTr: 'VintaRadi: Vintage Radyo & FM',
    shortTr: 'Analog kadranlı vintage radyo, 35.000+ dünya istasyonu ve canlı kaset kaydı.',
    fullTr: `Nostaljik 1950'ler ve 1960'ların lambalı ahşap radyo estetiğini modern dijital müzik teknolojisiyle buluşturan VintaRadi ile radyo dinleme deneyimini yeniden keşfedin!

📻 ÖNE ÇIKAN ÖZELLİKLER:

1. GERÇEKÇİ ANALOG FREKANS KADRANI:
• Altın pirinç döner düğmeler (Knobs), kehribar ışıklı ibre ve stereo analog VU metreler.
• FM, AM ve Kısa Dalga (SW) bantları arasında akıcı geçiş.
• Otomatik kanal tarama (SCAN) ve frekans kilitleme göstergesi.

2. 35.000+ CANLI DÜNYA RADYO ATLASI:
• Türkiye ve dünyanın dört bir yanından binlerce yerel ve ulusal radyo.
• Pop, Caz, Nostalji, Arabesk, Rock, Klasik, Haber ve Spor filtreleme.
• Kendi özel radyo akış URL'lerinizi (MP3, AAC, HLS) ekleyebilme.

3. ÇEVRİMDİŞİ KASET KAYIT STÜDYOSU (TAPE DECK):
• Canlı yayını tek dokunuşla analog kaset hissiyatıyla kaydedin.
• Kayıtlarınızı internet bağlantınız yokken dilediğiniz zaman dinleyin.
• Ses dosyalarını cihazınıza MP3/WAV formatında aktarın.

4. 5-BANT VAKUM TÜP EKOLAYZIR & DSP:
• 60Hz, 250Hz, 1kHz, 4kHz ve 12kHz ses bantlarını şekillendirin.
• Lambalı amfi sıcaklığı (Vacuum Tube Warmth) ile vinil plak doygunluğu.
• Akustik, Caz, Vokal ve Güçlü Bas hazır profilleri.

5. AKILLI UYKU ZAMANLAYICI & ÇALMA LİSTELERİ:
• 15-90 dakika arası geri sayım ve kademeli ses kısma (fade-out).
• Favori istasyonlarınızı özel tematik çalma listelerinde toplayın.

6. ÇOKLU DİL DESTEĞİ:
• Türkçe, İngilizce, Almanca, İspanyolca, Fransızca, İtalyanca, Rusça ve Arapça desteği.

Telif ve İletişim: Geliştirici: Şaban Çetinkaya ([email removed])
Gizlilik Politikası: https://vintaradi.app/?page=privacy`,

    titleEn: 'VintaRadi: Vintage Radio & FM',
    shortEn: 'Vintage analog tube radio tuner with 35,000+ global stations & cassette recorder.',
    fullEn: `Experience the golden era of 1950s and 1960s tube radios blended seamlessly with modern global internet streaming in VintaRadi!

📻 KEY HIGHLIGHTS:

1. REALISTIC ANALOG TUNING DIAL:
• Golden rotary brass knobs, glowing amber frequency needle, and active stereo VU meters.
• Smooth band switching between FM, AM, and Shortwave (SW).
• Automatic live frequency scanning (SCAN) and instant signal locking.

2. 35,000+ WORLDWIDE RADIO DIRECTORY:
• Massive catalog of local and international stations across 180+ countries.
• Filter effortlessly by genres: Jazz, Classical, Retro 80s, Pop, Rock, Talk, and News.
• Custom stream support: Add your own MP3, AAC, or HLS radio links.

3. OFFLINE TAPE CASSETTE RECORDER:
• Record live audio broadcasts directly with authentic cassette deck physics.
• Listen to your captured recordings anytime without an internet connection.
• Export audio files directly to your device storage.

4. 5-BAND VACUUM TUBE EQUALIZER & DSP:
• Precision tone sculpting: 60Hz, 250Hz, 1kHz, 4kHz, and 12kHz.
• Adjustable Vacuum Tube Warmth simulation for vintage valve amp harmonics.
• Handcrafted audio presets: Vinyl Warmth, Acoustic, Jazz Lounge, and Bass Boost.

5. SLEEP TIMER & SMART PLAYLISTS:
• Auto-off countdown timer with smooth gentle audio fade-out.
• Organize your favorite stations into tailored mood playlists.

Developer: Şaban Çetinkaya ([email removed])
Privacy Policy: https://vintaradi.app/?page=privacy`,
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
        className={`relative w-full max-w-4xl max-h-[92dvh] sm:max-h-[88vh] rounded-2xl border-2 ${theme.chassisBorder} bg-gradient-to-b from-[#24160d] via-[#190e08] to-[#0f0905] text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Sticky Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200 leading-tight">
                {isTr ? 'Google Play Store Paketleme & Varlık Merkezi' : 'Google Play Asset & Packaging Hub'}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans line-clamp-1">
                {isTr
                  ? 'Geliştirici: Şaban Çetinkaya • 512x512 İkon, 1024x500 Banner, Ekran Görüntüleri ve .AAB Paketi'
                  : 'Ready-to-upload Play Store graphics, listing copy, and Android bundle setup'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/50 border border-amber-900/60 hover:bg-amber-950/80 text-amber-300 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-3 sm:px-5 py-2 border-b border-amber-900/30 bg-black/40 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('graphics')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-vintage flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'graphics'
                ? 'bg-amber-600 text-black shadow'
                : 'bg-black/30 text-amber-400/70 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{isTr ? '1. Görseller & Ekran Resimleri' : '1. Store Graphics'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('texts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-vintage flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-amber-600 text-black shadow'
                : 'bg-black/30 text-amber-400/70 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{isTr ? '2. Mağaza Açıklama Metinleri' : '2. Store Copy & Listing'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('aab_guide')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono-vintage flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'aab_guide'
                ? 'bg-amber-600 text-black shadow'
                : 'bg-black/30 text-amber-400/70 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{isTr ? '3. Android .AAB Paketi Alma' : '3. Generate .AAB Bundle'}</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 font-sans custom-scrollbar overscroll-contain">
          {/* TAB 1: GRAPHICS & SCREENSHOTS */}
          {activeTab === 'graphics' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-200/90 leading-relaxed">
                  {isTr
                    ? 'Aşağıdaki tüm görseller Google Play Store standartlarına (%100 uyumlu boyut ve çözünürlük) göre hazırlanmıştır. "İndir" butonuna basarak doğrudan cihazınıza kaydedebilir ve Play Console yükleme ekranında kullanabilirsiniz.'
                    : 'All visual assets are generated to exact Google Play Store specs. Download and upload directly to Play Console.'}
                </div>
              </div>

              {/* Grid of Graphic Assets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {graphicsList.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 sm:p-4 rounded-xl bg-black/50 border border-amber-900/50 flex flex-col justify-between gap-3 shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs sm:text-sm font-bold text-amber-200">{item.title}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-400 font-mono border border-amber-800/60">
                          {item.size}
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-400/70 mb-2">{item.desc}</p>

                      <div className="rounded-lg overflow-hidden border border-amber-900/40 bg-black/80 flex items-center justify-center p-1 my-1">
                        <img
                          src={item.url}
                          alt={item.title}
                          className={`${item.aspect} object-contain rounded shadow`}
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-amber-900/30">
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        {item.requirement}
                      </span>

                      <a
                        href={item.url}
                        download={`${item.id}.jpg`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{isTr ? 'Görseli İndir' : 'Download'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: STORE LISTING TEXTS */}
          {activeTab === 'texts' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200/90 leading-relaxed">
                {isTr
                  ? 'Google Play Console > Ana Mağaza Girişi (Main Store Listing) sayfasına yapıştırmanız için Türkçe ve İngilizce hazır metinler:'
                  : 'Ready-to-paste store listing metadata in Turkish and English for the Google Play Console.'}
              </div>

              {/* TR Store texts */}
              <div className="p-4 rounded-xl bg-black/50 border border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                  <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>🇹🇷</span> Türkçe Mağaza Metinleri (Varsayılan Dil)
                  </span>
                </div>

                {/* App Name */}
                <div>
                  <div className="flex justify-between items-center text-xs text-amber-400 mb-1">
                    <span className="font-bold">Uygulama Adı (En fazla 30 karakter):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeTexts.titleTr, 'titleTr')}
                      className="text-amber-300 hover:text-amber-100 flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                      {copiedKey === 'titleTr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'titleTr' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-black/70 border border-amber-950 font-mono text-xs text-amber-200">
                    {storeTexts.titleTr}
                  </div>
                </div>

                {/* Short Desc */}
                <div>
                  <div className="flex justify-between items-center text-xs text-amber-400 mb-1">
                    <span className="font-bold">Kısa Açıklama (En fazla 80 karakter):</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeTexts.shortTr, 'shortTr')}
                      className="text-amber-300 hover:text-amber-100 flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                      {copiedKey === 'shortTr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'shortTr' ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>
                  <div className="p-2 rounded bg-black/70 border border-amber-950 font-mono text-xs text-amber-200">
                    {storeTexts.shortTr}
                  </div>
                </div>

                {/* Full Desc */}
                <div>
                  <div className="flex justify-between items-center text-xs text-amber-400 mb-1">
                    <span className="font-bold">Tam Açıklama:</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(storeTexts.fullTr, 'fullTr')}
                      className="text-amber-300 hover:text-amber-100 flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                      {copiedKey === 'fullTr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'fullTr' ? 'Kopyalandı!' : 'Tam Metni Kopyala'}</span>
                    </button>
                  </div>
                  <pre className="p-2.5 rounded bg-black/70 border border-amber-950 font-sans text-xs text-amber-200/90 whitespace-pre-wrap max-h-40 overflow-y-auto custom-scrollbar">
                    {storeTexts.fullTr}
                  </pre>
                </div>
              </div>

              {/* EN Store texts */}
              <div className="p-4 rounded-xl bg-black/50 border border-amber-900/50 space-y-3">
                <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
                  <span className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <span>🇬🇧</span> English Store Listing (Global Translation)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(storeTexts.fullEn, 'fullEn')}
                    className="text-amber-300 hover:text-amber-100 flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                  >
                    {copiedKey === 'fullEn' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedKey === 'fullEn' ? 'Copied!' : 'Copy Full English Text'}</span>
                  </button>
                </div>

                <div className="text-xs text-amber-200/80">
                  <strong>Title:</strong> {storeTexts.titleEn}
                </div>
                <div className="text-xs text-amber-200/80">
                  <strong>Short Description:</strong> {storeTexts.shortEn}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AAB GENERATION INSTRUCTIONS */}
          {activeTab === 'aab_guide' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/60 to-amber-950/60 border border-emerald-700/50 space-y-2">
                <h3 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  {isTr ? '2 Dakikada .AAB Paketi Oluşturma (PWABuilder Yöntemi)' : '2-Minute .AAB Generation via PWABuilder'}
                </h3>
                <p className="text-xs text-emerald-100/90 leading-relaxed">
                  {isTr
                    ? 'Uygulamanız için gerekli tüm manifest (PWA/TWA), ikonlar ve dijital varlık bağlantıları projeye eklenmiştir. Tek yapmanız gereken:'
                    : 'Your project already contains compliant WebManifest, icons, and assetlinks. Just follow:'}
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-900/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-amber-200">
                    <strong className="text-amber-300 block">PWABuilder Web Sitesini Açın</strong>
                    <p className="text-amber-400/80 text-xs">
                      Tarayıcınızda <strong>pwabuilder.com</strong> adresine gidin ve uygulamanızın canlı URL adresini yapıştırıp <strong>Start</strong>'a tıklayın.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-900/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-amber-200">
                    <strong className="text-amber-300 block">Android Paketini Seçin (Generate Package)</strong>
                    <p className="text-amber-400/80 text-xs">
                      <strong>Android</strong> kutusuna tıklayın. Paket Adı (Package ID) olarak <code className="bg-black px-1.5 py-0.5 rounded text-amber-300">com.vintaradi.app</code> girin.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-black/50 border border-amber-900/50 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-600 text-black font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 text-xs sm:text-sm text-amber-200">
                    <strong className="text-amber-300 block">.AAB Dosyasını İndirin ve Play Console'a Yükleyin</strong>
                    <p className="text-amber-400/80 text-xs">
                      Oluşturulan ZIP dosyasını indirin. İçerisindeki <code className="bg-black px-1.5 py-0.5 rounded text-amber-300">app-release-signed.aab</code> dosyasını Google Play Console &gt; Üretim (Production) ekranından doğrudan yükleyin!
                    </p>
                  </div>
                </div>
              </div>

              {/* Digital Asset links and verification */}
              <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 text-xs text-amber-300/80 font-mono">
                <div>📁 Proje İçi Paket Klasörü: <strong>/playstore-package/</strong></div>
                <div>🔗 Doğrulama Dosyası: <strong>/.well-known/assetlinks.json</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-3 sm:p-4 border-t border-amber-900/40 flex items-center justify-between shrink-0 bg-[#0f0905]/95 backdrop-blur-sm z-20">
          <div className="text-[11px] text-amber-400/80 font-mono">
            {isTr ? 'Geliştirici: Şaban Çetinkaya' : 'Developer: Şaban Çetinkaya'}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs sm:text-sm shadow transition-all cursor-pointer min-h-[38px]"
          >
            {isTr ? 'Tamam, Kapat' : 'Close Hub'}
          </button>
        </div>
      </div>
    </div>
  );
};

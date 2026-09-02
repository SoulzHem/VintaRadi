import React, { useState } from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { LanguageCode } from '../types';
import { Shield, FileText, Copyright, Info, X, Check, ExternalLink, Mail, Code, Radio } from 'lucide-react';

interface LegalInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeConfig;
  language?: LanguageCode;
  initialTab?: 'privacy' | 'terms' | 'dmca' | 'licenses' | 'about';
}

export const LegalInfoModal: React.FC<LegalInfoModalProps> = ({
  isOpen,
  onClose,
  theme,
  language = 'tr',
  initialTab = 'privacy',
}) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'dmca' | 'licenses' | 'about'>(initialTab);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`relative w-full max-w-3xl max-h-[92dvh] sm:max-h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} bg-gradient-to-b from-[#24160d] via-[#190e08] to-[#0f0905] text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
      >
        {/* Sticky Header */}
        <div className="p-3.5 sm:p-5 border-b border-amber-900/40 flex items-center justify-between shrink-0 bg-[#24160d]/95 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-amber-950/80 border border-amber-700/50 text-amber-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-display-vintage font-bold tracking-wide text-amber-200 leading-tight">
                {language === 'tr' ? 'Yasal Bilgiler & Gizlilik Politikası' : 'Legal & Privacy Policy'}
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-400/70 font-sans line-clamp-1">
                {language === 'tr'
                  ? 'Google Play Store uyumluluğu, kullanıcı gizliliği, telif ve DMCA şartları'
                  : 'Google Play Store compliance, user privacy, copyright & DMCA terms'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-black/50 border border-amber-900/60 hover:bg-amber-950/80 text-amber-300 transition-colors cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            title="Kapat"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-5 py-2 border-b border-amber-900/30 bg-black/40 flex items-center gap-1.5 sm:gap-2 overflow-x-auto shrink-0 custom-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'privacy'
                ? 'bg-amber-600 text-black shadow-md'
                : 'bg-black/30 text-amber-300/80 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Gizlilik Politikası' : 'Privacy Policy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-amber-600 text-black shadow-md'
                : 'bg-black/30 text-amber-300/80 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Kullanım Şartları' : 'Terms of Service'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('dmca')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'dmca'
                ? 'bg-amber-600 text-black shadow-md'
                : 'bg-black/30 text-amber-300/80 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <Copyright className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Telif & DMCA' : 'Copyright & DMCA'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('licenses')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'licenses'
                ? 'bg-amber-600 text-black shadow-md'
                : 'bg-black/30 text-amber-300/80 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Açık Kaynak' : 'Attributions'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-vintage font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'about'
                ? 'bg-amber-600 text-black shadow-md'
                : 'bg-black/30 text-amber-300/80 hover:bg-amber-950/40 border border-amber-900/40'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>{language === 'tr' ? 'Hakkında & İletişim' : 'About & Contact'}</span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-sans text-xs sm:text-sm leading-relaxed text-amber-100/90 custom-scrollbar overscroll-contain">
          {/* TAB 1: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <span className="text-[11px] font-mono-vintage text-amber-400 block mb-1 uppercase font-bold">
                  {language === 'tr' ? 'Son Güncelleme: 2026' : 'Last Updated: 2026'}
                </span>
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'VintaRadi Gizlilik Politikası' : 'VintaRadi Privacy Policy'}
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {language === 'tr'
                    ? 'Gizliliğinize en üst düzeyde saygı duyuyoruz. VintaRadi, kullanıcılarının kişisel kimlik bilgilerini toplamaz, saklamaz veya üçüncü taraflarla paylaşmaz.'
                    : 'We value your privacy utmost. VintaRadi does not collect, store, or sell personally identifiable information.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '1. Toplanan Veriler ve Kullanım Amacı' : '1. Data Collection and Usage'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'VintaRadi uygulaması tamamen "Yerel Depolama (Local Storage / IndexedDB)" prensibiyle çalışır. Favori istasyonlarınız, özel çalma listeleriniz, 5-bant ekolayzır tercihleriniz ve kaydettiğiniz ses kasetleri yalnızca cihazınızın hafızasında tutulur; herhangi bir harici sunucuya aktarılmaz.'
                    : 'VintaRadi operates on a local-first architecture. Your favorite stations, custom playlists, equalizer profiles, and recorded tapes are stored exclusively on your local device storage.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '2. Canlı Ses Akışları ve Ağ Trafiği' : '2. Audio Streaming & Network'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Bir radyo frekansını dinlediğinizde, uygulamanız doğrudan ilgili radyo istasyonunun kamuya açık yayın sunucusuna (MP3, AAC veya HLS akışı) bağlanır. Bu işlem sırasında IP adresiniz yayın sunucusuna standart HTTP/HTTPS istek protokolü gereği iletilebilir.'
                    : 'When playing an audio stream, your device establishes a direct connection with the public broadcast server of that specific station.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '3. Çerezler ve Üçüncü Taraf İzleyiciler' : '3. Cookies & Tracking'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Uygulama içinde reklam izleme çerezleri, profil çıkarma yazılımları veya konum takip servisleri KULLANILMAMAKTADIR.'
                    : 'No tracking cookies, behavioral profiling tools, or persistent geolocation monitors are employed in this application.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '4. İzinler (Mikrofon / Ses Kayıt)' : '4. Permissions'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Kaset Kayıt (Tape Recorder) özelliği yalnızca tarayıcı/uygulama içindeki canlı akış sesini cihazınıza kaydetmek için Web Audio API kullanır. Ortam mikrofonunuz dinlenmez veya kaydedilmez.'
                    : 'The tape recording feature captures the internal radio stream output to create offline audio files with zero background microphone capture.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'Kullanım Şartları & Yayın Feragatnamesi' : 'Terms of Service & Stream Disclaimer'}
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {language === 'tr'
                    ? 'VintaRadi, internet üzerinden serbestçe yayın yapan bağımsız radyo istasyonlarını analog bir kadranla sunan bir radyo istemcisidir.'
                    : 'VintaRadi acts strictly as an analog tuner interface and client for publicly accessible online audio streams.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '1. Hizmetin Niteliği' : '1. Nature of Service'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'VintaRadi herhangi bir radyo yayınının sahibi veya yayıncısı değildir. Uygulama, kamuya açık çevrimiçi radyo dizinlerini (Radio-Browser vb.) listeleyen ve kullanıcıların kendi akış bağlantılarını dinlemelerine olanak sağlayan bir arayüzdür.'
                    : 'VintaRadi does not host, broadcast, or modify any stream content. It merely renders user-selected public URLs through an interactive analog receiver.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '2. Yayın İçeriği ve Sorumluluk' : '2. Content Responsibility'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'Radyo kanallarında çalınan müzikler, haberler, reklamlar veya konuşmalar tamamen yayını yapan radyo kuruluşunun sorumluluğundadır. Yayınların kesintiye uğramasından veya içeriğinden VintaRadi sorumlu tutulamaz.'
                    : 'Broadcasting stations are solely responsible for their programming, licensing, and audio contents.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '3. Kişisel ve Ticari Olmayan Kullanım' : '3. Personal Non-Commercial Use'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'Uygulama kişisel dinleme ve nostaljik eğlence amaçlı sunulmaktadır.'
                    : 'This application is provided for personal, non-commercial educational and entertainment usage.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: COPYRIGHT & DMCA */}
          {activeTab === 'dmca' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'Telif Hakkı & DMCA Kaldırma Bildirimi' : 'Copyright & DMCA Takedown Notice'}
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {language === 'tr'
                    ? 'Fikri mülkiyet haklarına ve radyo yayıncılarının haklarına tam saygı gösteriyoruz.'
                    : 'We fully respect intellectual property and broadcast copyrights.'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'Eğer bir radyo istasyonunun, logonun veya ses akışının telif hakkı sahibiyseniz ve istasyonunuzun VintaRadi dizininde yer almasını istemiyorsanız, lütfen aşağıdaki e-posta adresinden bizimle iletişime geçin. Talebiniz derhal işleme alınacak ve istasyon yayını kalıcı olarak listeden çıkarılacaktır.'
                    : 'If you are the copyright holder of any stream or logo indexed in this app and wish for it to be removed, please contact us at the address below for immediate takedown.'}
                </p>

                <div className="p-4 rounded-xl bg-black/50 border border-amber-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-700/40">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-mono-vintage text-amber-400/80 block uppercase">
                        {language === 'tr' ? 'İletişim & DMCA Bildirimi:' : 'DMCA Contact Email:'}
                      </span>
                      <strong className="text-sm font-mono text-amber-200">[email removed]</strong>
                    </div>
                  </div>

                  <a
                    href="mailto:[email removed]?subject=VintaRadi%20Station%20Takedown%20Request"
                    className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{language === 'tr' ? 'E-posta Gönder' : 'Send Takedown Email'}</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPEN SOURCE & LICENSES */}
          {activeTab === 'licenses' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'Açık Kaynak & Dizin Teşekkürleri' : 'Open Source & Data Attributions'}
                </h3>
              </div>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-200 text-xs sm:text-sm font-bold">Radio-Browser Community API</strong>
                    <span className="text-[10px] font-mono text-amber-400/70">Public Domain / CC0</span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 mt-1">
                    Küresel radyo istasyonları dizini ve arama veritabanı açık kaynak topluluk projesi radio-browser.info tarafından sağlanmaktadır.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-200 text-xs sm:text-sm font-bold">Lucide Icons</strong>
                    <span className="text-[10px] font-mono text-amber-400/70">ISC License</span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 mt-1">
                    Vektörel analog ve modern arayüz simgeleri Lucide Icons kütüphanesinden temin edilmiştir.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-200 text-xs sm:text-sm font-bold">Web Audio API Engine</strong>
                    <span className="text-[10px] font-mono text-amber-400/70">W3C Standard</span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 mt-1">
                    Analog radyo statiği, vakum tüp harmonikleri ve 5-bant parametrik filtreleme Web Audio API üzerinde çalışmaktadır.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT & DEVELOPER INFO */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 to-black/60 border border-amber-700/40 flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-600/20 border border-amber-500/40 text-amber-400">
                  <Radio className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                    VintaRadi Superheterodyne Deluxe
                  </h3>
                  <p className="text-xs font-mono text-amber-400/80">
                    Sürüm / Version 1.0.0 (Google Play & Web Edition)
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 space-y-2">
                <div className="flex justify-between py-1 border-b border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">Geliştirici (Developer):</span>
                  <span className="font-semibold text-amber-200">Şaban Çetinkaya</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">Destek E-Posta:</span>
                  <span className="font-mono text-amber-200">[email removed]</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">Platform:</span>
                  <span className="text-amber-200">Android PWA / TWA / Web</span>
                </div>
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-amber-400/70">Ses Motoru:</span>
                  <span className="text-amber-200">Superheterodyne Multi-band DSP</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sticky Footer */}
        <div className="p-3 sm:p-4 border-t border-amber-900/40 flex items-center justify-between shrink-0 bg-[#0f0905]/95 backdrop-blur-sm z-20">
          <span className="text-[10px] sm:text-xs font-mono text-amber-400/70">
            © 2026 VintaRadi • All Rights Reserved
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-black font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer min-h-[40px] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'tr' ? 'Kapat' : 'Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

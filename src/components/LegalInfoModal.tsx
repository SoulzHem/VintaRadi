import React, { useState } from 'react';
import { ThemeConfig } from '../utils/themeConfig';
import { LanguageCode } from '../types';
import { Shield, FileText, Copyright, Info, X, Check, ExternalLink, Code, Radio } from 'lucide-react';

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
        className={`relative w-full max-w-3xl max-h-[92dvh] sm:max-h-[85vh] rounded-2xl border-2 ${theme.chassisBorder} ${theme.cabinetClass} text-amber-100 shadow-2xl flex flex-col overflow-hidden`}
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
          <>
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
                    ? 'VintaRadi hesap oluşturmaz ve uygulama sunucusunda favori ya da liste verisi saklamaz. Ancak istasyon kataloğu, yazı tipleri ve seçtiğiniz yayın için üçüncü taraf sunuculara bağlantı kurulur; bu sunucular bağlantı bilgilerini işleyebilir.'
                    : 'VintaRadi has no user accounts and does not store favorites or playlists on an app server. It does connect to third-party servers for station listings, fonts, and selected streams; those operators may process connection data.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '1. Toplanan Veriler ve Kullanım Amacı' : '1. Data Collection and Usage'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Favoriler, çalma listeleri, ekolayzır tercihleri ve varsa kayıtlar tarayıcının Local Storage / IndexedDB alanında tutulur. İstasyon arama ve listeleme istekleri Radio Browser hizmetine gider; yayın dinlerken cihazınız seçilen istasyon sunucusuna doğrudan bağlanır.'
                    : 'Favorites, playlists, equalizer preferences, and any recordings are kept in browser Local Storage / IndexedDB. Station search and listing requests go to Radio Browser; playback connects your device directly to the selected station server.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '2. Canlı Ses Akışları ve Ağ Trafiği' : '2. Audio Streaming & Network'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Yayın sunucusu ve kullanılan üçüncü taraf hizmetler, IP adresiniz ve standart bağlantı günlükleri gibi teknik verileri alabilir. VintaRadi bu hizmetlerin veri uygulamalarını kontrol etmez.'
                    : 'The stream host and third-party services may receive technical data such as your IP address and standard connection logs. VintaRadi does not control their data practices.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '3. Çerezler ve Üçüncü Taraf İzleyiciler' : '3. Cookies & Tracking'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Uygulama reklam veya davranışsal izleme SDK’sı kullanmaz. Radio Browser, Google Fonts ve istasyon sunucularına yapılan istekler ilgili hizmet sağlayıcılar tarafından kaydedilebilir.'
                    : 'The app does not use advertising or behavioral-tracking SDKs. Requests to Radio Browser, Google Fonts, and station hosts may be logged by those service operators.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {language === 'tr' ? '4. İzinler (Mikrofon / Ses Kayıt)' : '4. Permissions'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm pl-4">
                  {language === 'tr'
                    ? 'Kayıt kontrolleri şu anda arayüzde gizlidir. Kayıt işlevi yeniden etkinleştirilirse yalnızca uygulamadaki ses akışını işler; mikrofon erişimi kullanmaz. Oluşan dosyalar cihazda saklanır.'
                    : 'Recording controls are currently hidden. If recording is re-enabled, it processes only the in-app audio stream and does not use microphone access. Resulting files are stored on the device.'}
                </p>
              </div>
            </div>
          </>
          )}

          {/* TAB 2: TERMS OF SERVICE */}
          {activeTab === 'terms' && (
          <>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'Kullanım Şartları & Yayın Feragatnamesi' : 'Terms of Service & Stream Disclaimer'}
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {language === 'tr'
                    ? 'VintaRadi, Radio Browser dizininden bulunan veya kullanıcı tarafından eklenen çevrimiçi istasyon bağlantılarını analog bir kadranla sunan bir istemcidir.'
                    : 'VintaRadi is an analog tuner interface for online station links returned by the Radio Browser directory or added by users.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '1. Hizmetin Niteliği' : '1. Nature of Service'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'VintaRadi yayın içeriklerini barındırmaz veya yeniden yayınlamaz; istasyon dizinleri ve bağlantıları sunar. Bir yayına internetten erişilebilmesi, yayının uygulamada listelenmesi veya dinlenmesi için izin bulunduğunu tek başına kanıtlamaz.'
                    : 'VintaRadi does not host or retransmit broadcast content; it provides station listings and links. A stream being publicly reachable does not by itself establish permission to list or play it in this app.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '2. Yayın İçeriği ve Sorumluluk' : '2. Content Responsibility'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'İstasyon adları, logoları ve yayın içerikleri ilgili hak sahiplerine ait olabilir. Bu projede yer alan bağlantılar için lisans veya yayın izni doğrulanmış değildir. Hak sahibiyseniz kaldırma talebinizi GitHub deposundaki Issues bölümünden iletebilirsiniz; gönderiler herkese açık olabilir, kişisel veya gizli bilgi paylaşmayın.'
                    : 'Station names, logos, and broadcast content may belong to their respective rights holders. Licenses or broadcast permissions for the links in this project have not been verified. Rights holders may submit removal requests through the repository Issues page; posts may be public, so do not include personal or confidential information.'}
                </p>

                <h4 className="font-bold text-amber-300 text-sm">
                  {language === 'tr' ? '3. Kişisel ve Ticari Olmayan Kullanım' : '3. Personal Non-Commercial Use'}
                </h4>
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'Uygulama bilgilendirme ve dinleme arayüzü olarak sunulur. Bu açıklama, yayınları veya görselleri kullanmak için lisans ya da hukuki izin yerine geçmez.'
                    : 'The app is provided as an informational listening interface. This statement does not grant a license or legal permission to use broadcasts or images.'}
                </p>
              </div>
            </div>
          </>
          )}

          {/* TAB 3: COPYRIGHT & DMCA */}
          {activeTab === 'dmca' && (
          <>
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-700/40">
                <h3 className="text-base sm:text-lg font-display-vintage font-bold text-amber-200">
                  {language === 'tr' ? 'Telif Hakkı ve Kaldırma Talepleri' : 'Copyright & Removal Requests'}
                </h3>
                <p className="text-xs text-amber-300/80 mt-1">
                  {language === 'tr'
                    ? 'Bu projede yer alan bağlantıların ve görsellerin kullanım izinleri doğrulanmış değildir. Herkese açık bağlantıların bulunması telif izni anlamına gelmez.'
                    : 'Permissions for links and images included in this project have not been verified. Public availability does not imply copyright permission.'}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-amber-200/80 text-xs sm:text-sm">
                  {language === 'tr'
                    ? 'Bir istasyon, logo veya başka bir içerikle ilgili hak talebiniz varsa GitHub deposunun Issues sayfasında kaldırma talebi açabilirsiniz. Depo herkese açıktır; talebinize özel veya hassas bilgi eklemeyin.'
                    : 'If you have a rights concern about a station, logo, or other content, you can open a removal request on the GitHub repository Issues page. The repository is public; do not include private or sensitive information.'}
                </p>

                <a
                  href="https://github.com/SoulzHem/VintaRadi/issues"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-3.5 py-2 text-xs font-bold text-black transition-colors hover:bg-amber-500"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>{language === 'tr' ? 'GitHub kaldırma talebi' : 'Submit a GitHub removal request'}</span>
                </a>
              </div>
            </div>
          </>
          )}

          {/* TAB 4: OPEN SOURCE & LICENSES */}
          {activeTab === 'licenses' && (
          <>
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
                    <span className="text-[10px] font-mono text-amber-400/70">Community API</span>
                  </div>
                  <p className="text-[11px] text-amber-300/70 mt-1">
                    <a href="https://www.radio-browser.info/" target="_blank" rel="noreferrer" className="underline underline-offset-2">
                      İstasyon dizini Radio Browser topluluğundan alınır. Veri ve API kullanım koşulları için hizmetin güncel belgelerini inceleyin.
                    </a>
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
          </>
          )}

          {/* TAB 5: ABOUT & DEVELOPER INFO */}
          {activeTab === 'about' && (
          <>
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
                    Sürüm / Version 1.0.0 (Web Edition)
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-black/40 border border-amber-900/40 space-y-2">
                <div className="flex justify-between py-1 border-b border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">Geliştirici (Developer):</span>
                  <span className="font-semibold text-amber-200">SoulzHem</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-900/30 text-xs">
                  <span className="text-amber-400/70">Platform:</span>
                  <span className="text-amber-200">Web / PWA</span>
                </div>
                <div className="flex justify-between py-1 text-xs">
                  <span className="text-amber-400/70">Ses Motoru:</span>
                  <span className="text-amber-200">Superheterodyne Multi-band DSP</span>
                </div>
              </div>
            </div>
          </>
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

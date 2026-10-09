# VintaRadi - Vintage Superheterodyne Web Radio

VintaRadi, React ve Vite ile oluşturulmuş bağımsız bir internet radyosu uygulamasıdır. Analog kadran, radyo keşfi, kişisel istasyon listeleri ve kaset kaydı özelliklerini nostaljik bir arayüzde bir araya getirir.

## ✨ Özellikler

- **Analog Tuner Deneyimi:** FM, AM ve SW bantları arasında geçiş yapın. İstasyonlar arasındaki o meşhur "statik hışırtı" efektini ve manuel frekans arama hissini yaşayın.
- **Airwave Rooms:** Oda paylaşımı ve eşzamanlama, aynı uygulama alanındaki tarayıcı sekmeleri arasında çalışır. Farklı cihazlardaki kullanıcılar arasında senkronizasyon için ayrıca bir gerçek zamanlı sunucu gerekir.
- **Kaset Kayıt Modülü:** Canlı radyo yayınlarını tarayıcı tabanlı kasetlere kaydedin ve daha sonra çevrimdışı (offline) olarak dinleyin.
- **Kişisel öneriler:** Dinleme geçmişinize göre yerel olarak oluşturulan radyo önerileri.
- **Profesyonel Ses Motoru:** 10 bantlı gelişmiş ekolayzır, gerçek zamanlı Analog VU metreler ve özelleştirilebilir ses profilleri.
- **Tema Desteği:** Klasik ahşap (Classic Walnut), Gece Modu (Midnight Valve) ve Modernist gibi farklı estetik seçenekler.
- **PWA Uyumluluğu:** Mobil cihazlarda bir uygulama gibi yüklenebilir ve kullanılabilir.

## 🚀 Hızlı Başlangıç

**Gereksinimler:** Node.js (v18+)

1.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```
2.  **Uygulamayı Çalıştırın:**
    ```bash
    npm run dev
    ```
    Windows'ta aynı geliştirme sunucusunu başlatmak için `start_vintaradi.cmd`
    dosyasını çalıştırın. Uygulama `http://localhost:3000` adresinde açılır.

## ☁️ GitHub ve Vercel'de Yayınlama

1. Bu klasörü GitHub'da yeni bir depoya yükleyin. `node_modules`, `dist`, `.env`
   ve `.env.local` Git'e eklenmez; bağımlılıkları Vercel kurar.
2. Vercel'de **Add New → Project** ile GitHub deposunu içe aktarın.
3. Framework **Vite**, Build Command `npm run build`, Output Directory `dist`
   olarak ayarlı olmalıdır. `vercel.json` bu ayarları ve SPA sayfalarının
   yönlendirmesini içerir.
4. **Deploy** seçeneğine basın. Her GitHub güncellemesi yeni bir dağıtım başlatır.

Vercel dağıtımı uygulamayı kendi alan adının kökünde (`/`) yayınlar. Uygulama
özel bir sunucuya veya backend API'sine ihtiyaç duymaz. İstasyon kataloğu için
Radio Browser hizmeti kullanılır; yayını tarayıcı doğrudan istasyondan alır.
Bazı HTTP yayınları HTTPS altında tarayıcı tarafından engellenebilir. Kullanıcı
ayarları ve kayıtlar bu cihazın tarayıcısında tutulur.

## 🛠 Teknoloji Yığını

- **Frontend:** React 19, TypeScript, Tailwind CSS 4
- **Animasyon:** Motion (Framer Motion)
- **Ses:** Web Audio API & MediaSession API
- **Veri:** IndexedDB (Kayıtlar için) & LocalStorage

## 📂 Proje Yapısı

- `/src/components`: Analog göstergeler, düğmeler ve şasi tasarımı.
- `/src/services`: Ses motoru, senkronizasyon servisi ve depolama yönetimi.
- `/src/utils`: Öneri motoru ve tema yapılandırmaları.
- `/public`: Ses efektleri ve görseller.

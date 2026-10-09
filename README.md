# VintaRadi - Vintage Superheterodyne Web Radio

VintaRadi, React ve Vite ile oluşturulmuş bağımsız bir internet radyosu uygulamasıdır. Analog kadran, radyo keşfi, kişisel istasyon listeleri ve kaset kaydı özelliklerini nostaljik bir arayüzde bir araya getirir.

## ✨ Özellikler

- **Analog Tuner Deneyimi:** FM, AM ve SW bantları arasında geçiş yapın. İstasyonlar arasındaki o meşhur "statik hışırtı" efektini ve manuel frekans arama hissini yaşayın.
- **Airwave Rooms:** Supabase Realtime yapılandırıldığında oda bağlantıları, istasyon değiştirme, oynat/duraklat, sohbet ve tepkiler farklı cihazlardaki kullanıcılar arasında eşzamanlanır. Supabase ayarı olmadan yalnızca aynı tarayıcıdaki sekmeler arası BroadcastChannel desteği kullanılır.
- **Bağlı dinleyici sayacı:** Ana ekrandaki sayaç, uygulamaya açık bağlantı/sekme sayısını ve oda penceresindeki sayaç o odadaki bağlantıları gösterir. Benzersiz kişi sayısı veya toplam ziyaretçi analitiği değildir.
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

Vercel dağıtımı uygulamayı kendi alan adının kökünde (`/`) yayınlar. İstasyon kataloğu için Radio Browser hizmeti kullanılır; yayını tarayıcı doğrudan istasyondan alır. Bazı HTTP yayınları HTTPS altında tarayıcı tarafından engellenebilir. Kullanıcı ayarları ve kayıtlar bu cihazın tarayıcısında tutulur.

### Supabase ile cihazlar arası odalar ve sayaç

1. Supabase projesi oluşturun ve **Project URL** ile **anon/publishable key** değerlerini alın. Yalnızca bu iki public değeri Vercel Project → **Settings → Environment Variables** bölümüne `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` adlarıyla ekleyin. İkisini Preview ve Production ortamlarında da tanımlayın.
2. Yerel geliştirme için `.env.example` dosyasını `.env.local` olarak kopyalayıp değerleri girin. Bu anahtarlar frontend paketinde görünür olacak şekilde tasarlanmış public anahtarlardır; **service role key veya başka bir secret eklemeyin**.
3. Vercel'de yeniden deploy edin. Supabase Realtime, Broadcast ve Presence açık olmalıdır. Uygulama varsayılan olarak herkese açık Realtime kanalları kullanır; oda adları gizli değildir ve bağlantı sayacı kişi değil açık uygulama sekmesi sayar.

Supabase ayarları yapılmadıysa oda senkronizasyonu yalnızca aynı tarayıcıdaki sekmeler arasında çalışır ve çevrimiçi sayaç `—` gösterir.

### GitHub deposunu private yapmak

Private GitHub deposu Vercel ile çalışabilir. Vercel hesabını GitHub'a bağlayıp ilgili private depoya erişim yetkisi verin; push ile deploy tetiklenmeye devam eder. Ancak private repo yalnızca kaynak kodun GitHub üzerinden görüntülenmesini sınırlar. Ziyaretçilere sunulan web uygulamasının istemci kodu ve tarayıcıya gönderilen public yapılandırma herkesçe incelenebilir; web uygulamasında kaynak kodu kullanıcıdan gizlemek mümkün değildir. Gerçek sırlar yalnızca sunucu tarafında tutulmalı, istemciye gönderilmemelidir.

## Yönetim paneli

Statik yönetim paneli `/vintaradi-admin.html` adresinde yayımlanır. Panelin giriş ve kalıcı kayıt işlemleri Vercel API uç noktalarını ve Supabase yapılandırmasını gerektirir. Yönetim parolası, Supabase service role key veya başka bir secret frontend dosyalarına eklenmemelidir.

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

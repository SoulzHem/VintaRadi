# VintaRadi - Google Play Store Yayın ve Android Paketi Rehberi
**Geliştirici:** Şaban Çetinkaya
**Uygulama Adı:** VintaRadi - Vintage Radyo & Kaset Kaydedici (Vintage Radio Player)
**Paket Kimliği (Package ID):** `com.vintaradi.app`

---

## 📁 Bu Klasördeki Dosyalar

1. **`icon_512.jpg`**: Google Play Store için 512x512 piksel yüksek çözünürlüklü Uygulama Simgesi (App Icon).
2. **`banner_1024x500.jpg`**: Google Play Store için 1024x500 piksel Özellik Grafiği (Feature Graphic).
3. **`screenshot_1_dial.jpg`**: 1. Ekran Görüntüsü - Vintage Ahşap Kasa & Analog Frekans Kadranı.
4. **`screenshot_2_world.jpg`**: 2. Ekran Görüntüsü - 35.000+ İstasyonluk Canlı Dünya Atlası.
5. **`screenshot_3_tape.jpg`**: 3. Ekran Görüntüsü - Çevrimdışı Kaset Kayıt Stüdyosu & Ses Arşivi.
6. **`screenshot_4_equalizer.jpg`**: 4. Ekran Görüntüsü - 5-Bant Vakum Tüp Ekolayzır & DSP Lambalı Ses.
7. **`twa-manifest.json`**: Android Bubblewrap TWA paketleme konfigürasyonu.
8. **`assetlinks.json`**: Dijital Varlık Bağlantıları (Digital Asset Links) doğrulama dosyası.
9. **`manifest.webmanifest`**: Standart PWA Manifest dosyası.
10. **`play_store_metadata.md`**: Play Console'a yapıştırılacak Türkçe & İngilizce başlık, kısa açıklama ve tam açıklamalar.

---

## 🚀 1. Google Play Console Mağaza Girişi Metinleri

### Türkçe (Varsayılan Dil)
- **Uygulama Adı (En fazla 30 karakter):** `VintaRadi: Vintage Radyo & FM`
- **Kısa Açıklama (En fazla 80 karakter):** `Analog kadranlı vintage radyo, 35.000+ dünya istasyonu ve canlı kaset kaydı.`
- **Tam Açıklama:**
```
Nostaljik 1950'ler ve 1960'ların lambalı ahşap radyo estetiğini modern dijital müzik teknolojisiyle buluşturan VintaRadi ile radyo dinleme deneyimini yeniden keşfedin!

📻 ÖNE ÇIKAN ÖZELLİKLER:

1. GERÇEKÇİ ANALOG FREKANS KADRANI:
• Altın pirinç döner düğmeler (Knobs), sarı kehribar ışıklı ibre ve stereo analog VU metreler.
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
Gizlilik Politikası: https://vintaradi.app/?page=privacy
```

---

## 📱 2. Android `.AAB` (Android App Bundle) Paketi Oluşturma (2 Yöntem)

### Yöntem A: PWABuilder ile 2 Dakikada Tarayıcıdan Oluşturma (En Kolay)
1. **[PWABuilder.com](https://www.pwabuilder.com)** adresine gidin.
2. Uygulamanızın canlı yayın adresini (URL) girin ve **Start** butonuna basın.
3. **Android** sekmesine tıklayın ve **Generate Package** deyin.
4. Paket Kimliğini `com.vintaradi.app`, Uygulama Adını `VintaRadi` olarak ayarlayın.
5. İndirilen ZIP içerisindeki `.aab` dosyasını doğrudan Google Play Console'a yükleyin!

### Yöntem B: Node.js / Bubblewrap Komut Satırı ile Oluşturma
Terminalinizde şu komutları çalıştırarak resmi Google Bubblewrap aracıyla `.aab` oluşturabilirsiniz:
```bash
npm install -g @bubblewrap/cli
bubblewrap init --manifest=https://vintaradi.app/manifest.webmanifest
bubblewrap build
```
Oluşan `app-release-signed.aab` dosyası Google Play Console'a yüklemeye hazırdır.

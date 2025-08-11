# Job Hunter Assistant Extension

LinkedIn iş ilanlarından otomatik olarak veri toplayan ve analiz eden Chrome extension'ı.

## 🚀 Özellikler

- **Otomatik Veri Toplama**: LinkedIn iş ilanlarında "Uygula" butonuna tıklandığında otomatik veri çekme
- **Toggle Kontrolü**: Veri toplama özelliğini açıp kapatabilme
- **Veri Görüntüleme**: Toplanan iş ilanı verilerini popup'ta görüntüleme
- **API Entegrasyonu**: Backend'e veri gönderimi ve saklama
- **Modern UI**: Glassmorphism tasarım ile şık kullanıcı arayüzü

## 🖼️ Arayüz Görselleri

### Ana Popup Arayüzü
![Ana Popup](https://via.placeholder.com/400x300/667eea/ffffff?text=Ana+Popup+Arayüzü)

**Özellikler:**
- Modern glassmorphism tasarım
- Logo ve başlık
- Veri toplama toggle switch'i
- "Veriyi Göster" butonu

### Veri Görüntüleme Ekranı
![Veri Görüntüleme](https://via.placeholder.com/400x300/764ba2/ffffff?text=Veri+Görüntüleme+Ekranı)

**Özellikler:**
- Geri dönüş butonu
- İş ilanı detayları
- Şirket ve pozisyon bilgileri
- Açıklama ve işe alım yapanlar

## 📋 Gereksinimler

Bu extension'ın çalışması için çalışan bir backend'e ihtiyaç vardır. Backend projesi şu adreste bulunabilir:

**[🔗 Job Hunter Assistant Backend](https://github.com/GorkemKurtkaya/job_hunter_assistant)**

## 🛠️ Kurulum

### 1. Backend Kurulumu

Önce backend'i kurun ve çalıştırın:

```bash
# Backend repository'sini klonlayın
git clone https://github.com/GorkemKurtkaya/job_hunter_assistant.git
cd job_hunter_assistant/backend

# Bağımlılıkları yükleyin
npm install

# .env dosyası oluşturun
PORT=8000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Backend'i başlatın
npm start
```

### 2. Extension Kurulumu

1. **Extension'ı indirin**: Bu repository'yi bilgisayarınıza klonlayın
2. **Chrome'da açın**: `chrome://extensions/` adresine gidin
3. **Developer mode'u açın**: Sağ üstteki "Developer mode" toggle'ını açın
4. **Load unpacked**: "Load unpacked" butonuna tıklayın
5. **Extension klasörünü seçin**: İndirdiğiniz extension klasörünü seçin

### 3. Backend URL'ini Güncelleyin

Extension'ın backend'e bağlanabilmesi için `content.js` dosyasındaki localhost URL'ini güncelleyin:

```javascript
// content.js dosyasında bu satırı bulun ve güncelleyin
const response = await fetch('http://localhost:8000/api/job-applications', {
  // Eğer farklı bir port kullanıyorsanız, burayı değiştirin
});
```

## 🔧 Kullanım

### Veri Toplama

1. **Extension'ı açın**: Chrome toolbar'daki extension ikonuna tıklayın
2. **Toggle'ı açın**: "Veri Toplama" toggle'ını açık konuma getirin
3. **LinkedIn'e gidin**: İş ilanı sayfasına gidin
4. **Veri toplayın**: "Uygula" veya "Başvuru gönder" butonuna tıklayın
5. **Veriyi görüntüleyin**: Extension popup'ında "Veriyi Göster" butonuna tıklayın

### Veri Görüntüleme

- **Pozisyon**: İş ilanının başlığı
- **Şirket**: İlanı veren şirket adı
- **Açıklama**: İş ilanının detaylı açıklaması
- **İşe Alım Yapanlar**: İlanı veren kişiler ve rolleri

## 📁 Dosya Yapısı

```
job_hunter_assistant_extension/
├── manifest.json          # Extension manifest dosyası
├── popup.html            # Popup arayüzü
├── popup.js              # Popup JavaScript kodu
├── content.js            # LinkedIn sayfasında çalışan script
├── style.css             # Stil dosyası
├── icon.png              # Extension ikonu
└── README.md             # Bu dosya
```

## ⚙️ Konfigürasyon

### Manifest.json

Extension'ın temel ayarları `manifest.json` dosyasında bulunur:

- **Permissions**: `activeTab`, `scripting`, `storage`
- **Host permissions**: LinkedIn ve backend URL'leri
- **Content scripts**: LinkedIn sayfalarında çalışan script'ler

### Backend API Endpoint

Extension şu endpoint'e veri gönderir:

```
POST http://localhost:8000/api/job-applications
```

**Request Body:**
```json
{
  "company_name": "Şirket Adı",
  "position": "İş Pozisyonu",
  "description": "İş Açıklaması",
  "recruiters": ["İşe Alım Yapan Kişiler"]
}
```

## 🔒 Güvenlik

- **Toggle Kontrolü**: Veri toplama özelliği kullanıcı tarafından kontrol edilir
- **Local Storage**: Toggle durumu Chrome storage'da güvenli şekilde saklanır
- **API Güvenliği**: Backend'de CORS ve authentication kontrolleri bulunur

## 🐛 Sorun Giderme

### Extension Çalışmıyor

1. **Backend çalışıyor mu?** `http://localhost:8000` adresini kontrol edin
2. **Extension yeniden yüklendi mi?** `chrome://extensions/` adresinde "Reload" yapın
3. **Console hataları**: F12 ile Developer Tools'u açıp hataları kontrol edin

### Veri Toplanmıyor

1. **Toggle açık mı?** Extension popup'ında toggle'ın açık olduğundan emin olun
2. **LinkedIn sayfasında mısınız?** Extension sadece LinkedIn iş ilanı sayfalarında çalışır
3. **"Uygula" butonu var mı?** İş ilanında "Uygula" veya "Başvuru gönder" butonu olmalı

### Backend Bağlantı Hatası

1. **Port doğru mu?** Backend'in 8000 portunda çalıştığından emin olun
2. **CORS ayarları**: Backend'de CORS ayarlarının doğru olduğundan emin olun
3. **Firewall**: Güvenlik duvarının localhost bağlantısını engellemediğinden emin olun

## 🤝 Katkıda Bulunma

1. Repository'yi fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Backend Projesi**: [GitHub Repository](https://github.com/GorkemKurtkaya/job_hunter_assistant)
- **Sorular ve Öneriler**: GitHub Issues kullanın

## 🔄 Güncellemeler

### v1.0.0
- İlk sürüm
- LinkedIn veri toplama
- Toggle kontrolü
- Modern UI tasarımı
- Backend entegrasyonu

---

**Not**: Bu extension'ın çalışması için mutlaka çalışan bir backend'e ihtiyaç vardır. Backend kurulumu için yukarıdaki adımları takip edin.
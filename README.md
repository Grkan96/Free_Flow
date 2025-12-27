# Runway Clear: Air Traffic Control

<div align="center">
  <img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Game Banner" width="800"/>
</div>

## 🎮 Oyun Hakkında

Runway Clear, mobil cihazlar için geliştirilmiş bir hava trafik kontrol simülasyon puzzle oyunudur. Bir hava trafik kontrolörü rolünde pistte bekleyen uçakları güvenli bir şekilde kalkış yapmalarını sağlayın!

### ✨ Özellikler

- 🛫 **3 Farklı Uçak Tipi**: Hafif, Ticari ve Ağır uçaklar
- ⏱️ **Acil Durum Sistemi**: Yakıtı biten uçakları önceliklendirin
- 🌧️ **Dinamik Hava Koşulları**: Yağmur ve fırtına efektleri
- 🚧 **Engeller**: Bakım çalışmaları nedeniyle bloke olmuş alanlar
- 💡 **İpucu Sistemi**: Takıldığınızda yardım alın
- 📱 **Haptic Feedback**: Dokunmatik geri bildirim desteği
- 🔊 **Ses Efektleri**: Gerçekçi uçak sesleri
- 📊 **Artan Zorluk**: 6x6 grid'e kadar büyüyen bulmacalar

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler

- Node.js (v16 veya üzeri)
- npm veya yarn
- Expo Go uygulaması (iOS/Android)

### Adım 1: Bağımlılıkları Yükleyin

```bash
npm install
```

### Adım 2: Geliştirme Sunucusunu Başlatın

```bash
npm start
```

### Adım 3: Uygulamayı Çalıştırın

Expo Go ile QR kodu tarayın veya:

```bash
# Android için
npm run android

# iOS için
npm run ios
```

## 📱 Play Store'a Yayınlama

### 1. Production Build Oluşturma

```bash
# EAS CLI'yi yükleyin
npm install -g eas-cli

# EAS projesini başlatın
eas login
eas build:configure
```

### 2. Android APK/AAB Oluşturma

```bash
# AAB (Play Store için)
eas build --platform android --profile production

# APK (Test için)
eas build --platform android --profile preview
```

### 3. App.json Ayarları

`app.json` dosyasında aşağıdaki ayarları yapın:

```json
{
  "expo": {
    "android": {
      "package": "com.yourcompany.runwayclear",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#000000"
      },
      "permissions": []
    }
  }
}
```

### 4. Play Store Gereksinimleri

- ✅ App Icon (512x512 PNG)
- ✅ Feature Graphic (1024x500 PNG)
- ✅ En az 2 ekran görüntüsü
- ✅ Uygulama açıklaması
- ✅ Gizlilik politikası URL'i

### 5. Yükleme

1. [Google Play Console](https://play.google.com/console)'a gidin
2. Yeni uygulama oluşturun
3. AAB dosyasını yükleyin
4. Store listing bilgilerini doldurun
5. İçerik derecelendirmesi yapın
6. Test ve yayınlama

## 🎯 Nasıl Oynanır

1. **Giriş Yap**: Biometric login ile başlayın
2. **Uçak Seç**: Grid üzerindeki bir uçağa dokunun
3. **Kontrol Et**: Uçağın yolu temizse başarıyla kalkış yapar
4. **Puan Kazan**: Her başarılı kalkış puan getirir
5. **İpucu**: Sağ alttaki şimşek butonuna basarak yardım alın

### 🎮 Oyun Mekanikleri

- **Yeşil Işık**: Uçak kalkışa hazır
- **Kırmızı Uyarı**: Yakıt kritik seviyede (MAYDAY!)
- **Sarı Koni**: Bakım engeli (hareket edemez)
- **Hint Path**: İpucu aktifken sarı yol gösterir

## 🏆 Puanlama Sistemi

| Uçak Tipi | Puan | Hız | Özellik |
|-----------|------|-----|---------|
| Hafif (PVT) | 15 | ⚡⚡⚡ | Özel jetler |
| Ticari (COM) | 25 | ⚡⚡ | Yolcu uçakları |
| Ağır (HVY) | 50 | ⚡ | Kargo uçakları |

## 📊 Zorluk Seviyeleri

- **Level 1-2**: 3x3 Grid (Başlangıç)
- **Level 3-6**: 4x4 Grid (Engeller + Acil Durumlar)
- **Level 7-12**: 5x5 Grid (Hava Koşulları)
- **Level 13+**: 6x6 Grid (Maksimum Zorluk!)

## 🛠️ Teknolojiler

- **React Native 0.74**
- **Expo 51**
- **TypeScript**
- **Expo AV** (Ses efektleri)
- **Expo Haptics** (Titreşim feedback)
- **React Native SVG** (Vektör grafikler)

## 📝 Lisans

Bu proje özel bir projedir. Ticari kullanım için izin gereklidir.

## 🤝 Katkıda Bulunma

Bu proje Play Store'da yayınlanmak üzere hazırlanmıştır. Katkılar için lütfen issue açın.

## 📧 İletişim

Sorular ve geri bildirimler için: [E-posta adresiniz]

## 🎨 Ekran Görüntüleri

(Play Store için ekran görüntüleri ekleyin)

---

**🛫 İyi Uçuşlar! Clear for Takeoff!**

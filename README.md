# Excellence Bedding — 2026 Tanıtım Sitesi

Excellence Bedding 2026 kataloğundan yola çıkılarak hazırlanmış, tek sayfalık
kurumsal tanıtım sitesi. **React + Vite** ile geliştirilmiş, **pnpm** ile yönetilir.

## Çalıştırma

```bash
pnpm install      # bağımlılıkları kur (esbuild build script'i onaylı gelir)
pnpm dev          # http://localhost:5173 geliştirme sunucusu
pnpm build        # dist/ altına production derlemesi
pnpm preview      # üretim derlemesini yerelde önizle
```

## İçerik

- **Hero** — “catch the comfort”, tüy görseli ve marka mesajı
- **Hakkımızda** — 30 yıllık tecrübe, kurumsal metin ve istatistikler
- **Kumaş Teknolojileri** — Viscon, Örme, Pamuk
- **Uyku Teknolojileri** — Pocket Spring, Herkül Yay, Yüksek Yoğunluklu Sünger, Ozone Therapy
- **Koleksiyon** — 7 yatak (Ozone Therapy, BodyBalance, Panthenol, Lavender, Anti-Aging Supreme,
  Manolya, Optimal). Karta tıklayınca kumaş kodu, sertlik, boyutlar ve katman yapısını gösteren
  detay penceresi açılır.
- **Concept** — Space Swing ve Gondol dış mekân ürünleri
- **İletişim** — İstanbul & Kayseri adresleri, telefon, e-posta

## Yapı

```
src/
  App.jsx      # tüm bölüm bileşenleri + ürün modalı
  data.js      # katalogdan çıkarılan ürün/teknoloji/iletişim verisi
  index.css    # tema, tipografi, responsive düzen
public/assets/ # katalogdan çıkarılan ürün ve yaşam görselleri
```

Tüm görseller kaynak PDF kataloğundan çıkarılmıştır. Metinler kataloğun Türkçe
içeriğinden alınmıştır. Ürün özellikleri ve bilgileri temsilidir; değişebilir.

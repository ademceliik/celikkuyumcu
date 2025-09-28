# Çelik Kuyumcu Backend

Bu proje Çelik Kuyumcu web sitesinin backend API'sidir.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables'ları ayarlayın:
```bash
cp env.example .env
```

3. Veritabanını ayarlayın:
```bash
npm run db:push
```

## Geliştirme

```bash
npm run dev
```

## Production Build

```bash
npm run build
npm start
```

## Environment Variables

- `PORT`: Server portu (varsayılan: 5000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL veritabanı URL'i
- `FRONTEND_URL`: Frontend URL'i (CORS için)

## API Endpoints

- `GET /api/products` - Ürünleri listele
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil
- `GET /api/contact-info` - İletişim bilgileri
- `PUT /api/contact-info` - İletişim bilgilerini güncelle
- `GET /api/about-info` - Hakkımızda bilgileri
- `PUT /api/about-info` - Hakkımızda bilgilerini güncelle
- `GET /api/homepage-info` - Anasayfa bilgileri
- `PUT /api/homepage-info` - Anasayfa bilgilerini güncelle
- `GET /api/messages` - Mesajları listele
- `POST /api/messages` - Yeni mesaj gönder
- `PATCH /api/messages/:id` - Mesajı okundu olarak işaretle
- `DELETE /api/messages/:id` - Mesaj sil

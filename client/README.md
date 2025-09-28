# Çelik Kuyumcu Frontend

Bu proje Çelik Kuyumcu web sitesinin frontend uygulamasıdır.

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. Environment variables'ları ayarlayın:
```bash
cp env.example .env
```

## Geliştirme

```bash
npm run dev
```

## Production Build

```bash
npm run build
```

## Environment Variables

- `VITE_API_URL`: Backend API URL'i (varsayılan: http://localhost:5000)

## Özellikler

- Modern React 18 + TypeScript
- TanStack Query (React Query) v5
- Tailwind CSS + Radix UI
- Responsive tasarım
- Admin paneli (/adminpanel)
- Ürün yönetimi
- İletişim formu
- WhatsApp entegrasyonu

## Sayfalar

- `/` - Anasayfa
- `/products` - Ürünler
- `/about` - Hakkımızda
- `/contact` - İletişim
- `/admin` - Admin girişi
- `/adminpanel` - Admin paneli

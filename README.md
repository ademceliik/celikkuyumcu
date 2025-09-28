# Çelik Kuyumcu Web Sitesi

Modern kuyumcu web sitesi - React frontend + Express backend + PostgreSQL veritabanı

## Proje Yapısı

Bu proje 3 ana bölümden oluşur:

### 🎨 Frontend (`client/`)
- React 18 + TypeScript
- TanStack Query (React Query) v5
- Tailwind CSS + Radix UI
- Responsive tasarım
- Admin paneli

### ⚙️ Backend (`server/`)
- Express.js + TypeScript
- Drizzle ORM
- PostgreSQL
- Session yönetimi
- CORS ayarları

### 🗄️ Veritabanı
- PostgreSQL
- Ürün yönetimi
- İletişim mesajları
- Admin kullanıcıları

## 🚀 Render'da Deploy

### 1. Backend (Web Service)
```bash
# Root Directory: server
# Build Command: npm run build
# Start Command: npm start
```

**Environment Variables:**
- `DATABASE_URL`: PostgreSQL URL'i
- `FRONTEND_URL`: Frontend URL'i
- `NODE_ENV`: production

### 2. Frontend (Static Site)
```bash
# Build Command: npm run build
# Publish Directory: dist
```

**Environment Variables:**
- `VITE_API_URL`: Backend URL'i

### 3. PostgreSQL
- Render PostgreSQL servisi kullanın
- Backend'e `DATABASE_URL` olarak bağlayın

## 📁 Proje Yapısı

```
├── client/              # Frontend
│   ├── src/
│   │   ├── pages/       # Sayfalar
│   │   ├── components/  # Bileşenler
│   │   └── lib/         # Utilities
│   ├── package.json
│   └── vite.config.ts
├── server/              # Backend
│   ├── index.ts         # Ana server dosyası
│   ├── routes.ts        # API rotaları
│   ├── db.ts           # Veritabanı bağlantısı
│   ├── package.json
│   └── tsconfig.json
├── shared/              # Paylaşılan kodlar
│   └── schema.ts        # Veritabanı şeması
└── README.md
```

## 🔧 Geliştirme

### Backend
```bash
cd server
npm install
npm run dev
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 📱 Özellikler

- ✅ Responsive tasarım
- ✅ Ürün kataloğu
- ✅ İletişim formu
- ✅ WhatsApp entegrasyonu
- ✅ Admin paneli (/adminpanel)
- ✅ Ürün yönetimi
- ✅ Mesaj yönetimi
- ✅ Modern UI/UX

## 🔐 Admin Panel

Admin paneline `/adminpanel` rotasından erişilebilir. Normal kullanıcılar bu sayfayı göremez.

## 🌐 API Endpoints

- `GET /api/products` - Ürünleri listele
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil
- `GET /api/contact-info` - İletişim bilgileri
- `GET /api/about-info` - Hakkımızda bilgileri
- `GET /api/homepage-info` - Anasayfa bilgileri
- `GET /api/messages` - Mesajları listele
- `POST /api/messages` - Yeni mesaj gönder

## 📞 İletişim

Proje hakkında sorularınız için iletişime geçebilirsiniz.
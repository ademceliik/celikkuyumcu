# Celik Kuyumcu Web Sitesi

React 18 + Express tabanli modern kuyumcu vitrini. Frontend Vite ile hazirlaniyor, backend Firebase Firestore uzerinden veri tutuyor.

## Dizin Yapisi

`
client/   # React + TypeScript arayuz
server/   # Express API + Firebase ile veri erisimi
shared/   # Ortak tipler ve Zod semalari
`

## Gelistirme

### Frontend
`
cd client
npm install
npm run dev
`

### Backend
`
cd server
npm install
npm run dev
`

## Firebase Ayarlari

Backend artk PostgreSQL yerine Firebase Firestore kullaniyor. Render veya lokal gelistirme icin asagidaki ortam degiskenlerini tanimlayin:

- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (\n satir sonlarini unutmayin)

Alternatif olarak tek satirlik FIREBASE_SERVICE_ACCOUNT_JSON degiskeni ile tum bilgileri JSON olarak gonderebilirsiniz. Ayrica asagidaki degiskenler de gerekiyor:

- FRONTEND_URL (CORS icin)
- SESSION_SECRET
- PORT (opsiyonel, varsayilan 5000)

## Render Uzerinde Deploy

### Backend (Web Service)
`
# Root Directory: server
# Build Command: npm run build
# Start Command: npm start
`

Gerekli ortam degiskenleri:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY veya FIREBASE_SERVICE_ACCOUNT_JSON
- FRONTEND_URL
- SESSION_SECRET

### Frontend (Static Site)
`
# Build Command: npm run build
# Publish Directory: dist
`

Gerekli ortam degiskeni:
- VITE_API_URL (backend URL)

### Firestore Koleksiyonlari

Sunucu calisirken su koleksiyonlari kullanir:
- homepageInfo (tek kayit)
- boutInfo (tek kayit)
- contactInfo (tek kayit)
- users
- products
- messages
- exchangeRates

Acilista varsayilan admin kullanicisi (dmin / dmin123) ve ornek icerikler otomatik olusturulur.

## Router Notu

Render Static Site icin /* -> /index.html seklinde rewrite kuralini tanimlayin. Boylece /products gibi dogrudan URL girislerinde frontend dogru calisir.

# Celik Kuyumcu Backend

Express tabanli API, Firestore ile veri yonetimi saglar.

## Kurulum

`
npm install
cp env.example .env
`

.env dosyasinda asagidaki degiskenleri doldurun:
- FIREBASE_PROJECT_ID
- FIREBASE_CLIENT_EMAIL
- FIREBASE_PRIVATE_KEY (satir sonlarini \n olarak yazin) veya FIREBASE_SERVICE_ACCOUNT_JSON
- FRONTEND_URL
- SESSION_SECRET

## Gelistirme

`
npm run dev
`

## Production

`
npm run build
npm start
`

## Baslica API Uclari

- GET /api/products
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id
- GET /api/contact-info
- PUT /api/contact-info
- GET /api/about-info
- PUT /api/about-info
- GET /api/homepage-info
- PUT /api/homepage-info
- GET /api/messages
- POST /api/messages
- PATCH /api/messages/:id
- DELETE /api/messages/:id
- POST /api/admin/login
- POST /api/admin/logout
- GET /api/admin/me

Admin oturumu icin acilis kullanicisi: dmin / dmin123. Gerekirse Firestore uzerinden sifreyi degistirebilirsiniz.

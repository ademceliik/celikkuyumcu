# Çelik Kuyumcu Web Projesi - Deploy ve Kurulum Rehberi

## Gereksinimler
- Node.js (LTS sürümü)
- npm veya yarn

## Proje Kurulumu

1. **Depoyu klonlayın:**
   ```sh
   git clone <repo-url>
   cd CelikKuyumcu
   ```

2. **Sunucu (Backend) bağımlılıklarını yükleyin:**
   ```sh
   cd server
   npm install
   ```

3. **İstemci (Frontend) bağımlılıklarını yükleyin:**
   ```sh
   cd ../client
   npm install
   ```

4. **Geliştirme ortamında çalıştırma:**
   - Sunucu başlat:
     ```sh
     cd ../server
     npm run dev
     ```
   - İstemci başlat:
     ```sh
     cd ../client
     npm run dev
     ```

5. **Canlıya Alma (Deploy):**
   - Vercel, Netlify veya kendi sunucunuza deploy edebilirsiniz.
   - `client` klasörünü Vercel/Netlify'ya yükleyin (build komutu: `npm run build`, output: `dist`)
   - `server` klasörünü bir Node.js sunucusunda çalıştırın veya uygun bir cloud servise yükleyin.

## Admin Paneli
- `/admin` veya `/admin-panel` adresinden giriş yapabilirsiniz.
- Varsayılan giriş: kullanıcı adı `admin`, şifre `admin` (güvenlik için canlıda değiştirin!)

## Notlar
- Tüm kodlar TypeScript ve modern React ile yazılmıştır.
- API endpointleri `/api` ile başlar.
- Veritabanı olarak şimdilik memory (geçici) kullanılmaktadır, canlıya alırken gerçek bir veritabanı entegre edebilirsiniz.

---

Herhangi bir sorunda veya canlıya alma aşamasında destek için iletişime geçebilirsiniz.

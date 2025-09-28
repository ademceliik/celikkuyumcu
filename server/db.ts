import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@shared/schema';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Veritabanı tablolarını otomatik oluştur
export async function initializeDatabase() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    
    // Tabloları oluştur (migration)
    await migrate(db, { migrationsFolder: './drizzle' });
    console.log('Veritabanı tabloları oluşturuldu.');
    
    // Başlangıç verilerini kontrol et ve ekle
    await seedInitialData();
    
    console.log('Veritabanı başlatma tamamlandı.');
    
  } catch (error) {
    console.error('Veritabanı başlatma hatası:', error);
    // Hata olsa bile devam et, tablolar zaten var olabilir
    console.log('Veritabanı başlatma hatası ile devam ediliyor...');
  }
}

// Başlangıç verilerini ekle
async function seedInitialData() {
  try {
    // Admin kullanıcısı var mı kontrol et
    const existingAdmin = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, 'admin')
    });
    
    if (!existingAdmin) {
      await db.insert(schema.users).values({
        username: 'admin',
        password: 'admin123', // Güvenlik için production'da değiştirin
        role: 'admin'
      });
      console.log('Admin kullanıcısı oluşturuldu (admin/admin123)');
    }
    
    // Varsayılan iletişim bilgileri
    const existingContact = await db.query.contactInfo.findFirst();
    if (!existingContact) {
      await db.insert(schema.contactInfo).values({
        address: 'İstanbul, Türkiye',
        phone: '+90 555 123 45 67',
        workingHours: 'Pazartesi - Cumartesi: 09:00 - 18:00'
      });
      console.log('Varsayılan iletişim bilgileri eklendi');
    }
    
    // Varsayılan hakkımızda bilgileri
    const existingAbout = await db.query.aboutInfo.findFirst();
    if (!existingAbout) {
      await db.insert(schema.aboutInfo).values({
        title: 'Çelik Kuyumcu Hakkında',
        description: 'Yılların deneyimi ile kaliteli kuyumculuk hizmeti sunuyoruz.',
        experienceYears: 25,
        customerCount: 1000,
        imageUrl: '/images/about.jpg'
      });
      console.log('Varsayılan hakkımızda bilgileri eklendi');
    }
    
    // Varsayılan anasayfa bilgileri
    const existingHomepage = await db.query.homepageInfo.findFirst();
    if (!existingHomepage) {
      await db.insert(schema.homepageInfo).values({
        title: 'Çelik Kuyumcu',
        description: 'Kaliteli kuyumculuk hizmeti ve özel tasarım takılar.',
        imageUrl: '/images/hero.jpg'
      });
      console.log('Varsayılan anasayfa bilgileri eklendi');
    }
    
  } catch (error) {
    console.error('Başlangıç verileri ekleme hatası:', error);
  }
}

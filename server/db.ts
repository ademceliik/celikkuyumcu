import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;
import * as schema from '@shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

// Veritabanı tablolarını otomatik oluştur
export async function initializeDatabase() {
  try {
    console.log('Veritabanı bağlantısı kuruluyor...');
    
    // Tabloları oluştur
    await createTables();
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

// Tabloları oluştur
async function createTables() {
  const client = await pool.connect();
  try {
    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "users" (
        "id" text PRIMARY KEY NOT NULL,
        "username" text NOT NULL,
        "password" text NOT NULL,
        "role" text DEFAULT 'admin' NOT NULL
      );
    `);
    
    // Products table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "products" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "category" text NOT NULL,
        "weight" numeric(5,2) NOT NULL,
        "gold_karat" integer NOT NULL,
        "image_url" text NOT NULL,
        "is_active" text DEFAULT 'true' NOT NULL,
        "has_workmanship" text DEFAULT 'true' NOT NULL
      );
    `);
    
    // Contact info table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "contact_info" (
        "id" text PRIMARY KEY NOT NULL,
        "address" text NOT NULL,
        "phone" text NOT NULL,
        "working_hours" text NOT NULL
      );
    `);
    
    // About info table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "about_info" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "experience_years" integer NOT NULL,
        "customer_count" integer NOT NULL,
        "image_url" text NOT NULL
      );
    `);
    
    // Homepage info table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "homepage_info" (
        "id" text PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "image_url" text NOT NULL
      );
    `);
    
    // Messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "messages" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "phone" text NOT NULL,
        "message" text NOT NULL,
        "created_at" text DEFAULT now() NOT NULL,
        "is_read" text DEFAULT 'false' NOT NULL
      );
    `);
    
    // Exchange rate table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "exchange_rate" (
        "id" text PRIMARY KEY NOT NULL,
        "currency" text NOT NULL,
        "rate" numeric(10,4) NOT NULL
      );
    `);
    
    // Create indexes
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "users_username_unique" ON "users" ("username");
      CREATE INDEX IF NOT EXISTS "products_category_idx" ON "products" ("category");
      CREATE INDEX IF NOT EXISTS "products_is_active_idx" ON "products" ("is_active");
      CREATE INDEX IF NOT EXISTS "messages_is_read_idx" ON "messages" ("is_read");
      CREATE UNIQUE INDEX IF NOT EXISTS "exchange_rate_currency_unique" ON "exchange_rate" ("currency");
    `);
    
  } finally {
    client.release();
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
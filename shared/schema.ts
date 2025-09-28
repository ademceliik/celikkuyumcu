import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // yuzuk, kupe, kolye, bileklik, bilezik, gerdanlik
  weight: decimal("weight", { precision: 5, scale: 2 }).notNull(), // gram
  goldKarat: integer("gold_karat").notNull(), // 14, 18, 22 ayar
  imageUrl: text("image_url").notNull(),
  isActive: text("is_active").notNull().default("true"),
  hasWorkmanship: text("has_workmanship").notNull().default("true"), // işçilikli mi
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Contact Info Table
export const contactInfo = pgTable("contact_info", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phone: text("phone").notNull(),
});

export const insertContactInfoSchema = createInsertSchema(contactInfo).omit({
  id: true,
});
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = typeof contactInfo.$inferSelect;

// Exchange Rate Table
export const exchangeRate = pgTable("exchange_rate", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  currency: text("currency").notNull(), // örn: USD, EUR, GRAM ALTIN
  rate: decimal("rate", { precision: 10, scale: 4 }).notNull(),
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRate).omit({
  id: true,
});
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
export type ExchangeRate = typeof exchangeRate.$inferSelect;

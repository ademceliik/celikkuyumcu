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

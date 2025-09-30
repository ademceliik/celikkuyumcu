import { z } from "zod";

export const homepageInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string(),
});

export const insertHomepageInfoSchema = homepageInfoSchema.omit({ id: true });
export type InsertHomepageInfo = z.infer<typeof insertHomepageInfoSchema>;
export type HomepageInfo = z.infer<typeof homepageInfoSchema>;

export const aboutInfoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  experienceYears: z.number(),
  customerCount: z.number(),
  imageUrl: z.string(),
});

export const insertAboutInfoSchema = aboutInfoSchema.omit({ id: true });
export type InsertAboutInfo = z.infer<typeof insertAboutInfoSchema>;
export type AboutInfo = z.infer<typeof aboutInfoSchema>;

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  weight: z.string(),
  goldKarat: z.number(),
  imageUrl: z.string(),
  isActive: z.string().default("true"),
  hasWorkmanship: z.string().default("true"),
});

export const insertProductSchema = productSchema.omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = z.infer<typeof productSchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  role: z.string().default("admin"),
});

export const insertUserSchema = userSchema.omit({ id: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = z.infer<typeof userSchema>;

export const contactInfoSchema = z.object({
  id: z.string(),
  address: z.string(),
  phone: z.string(),
  workingHours: z.string(),
});

export const insertContactInfoSchema = contactInfoSchema.omit({ id: true });
export type InsertContactInfo = z.infer<typeof insertContactInfoSchema>;
export type ContactInfo = z.infer<typeof contactInfoSchema>;

export const exchangeRateSchema = z.object({
  id: z.string(),
  currency: z.string(),
  rate: z.string(),
});

export const insertExchangeRateSchema = exchangeRateSchema.omit({ id: true });
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
export type ExchangeRate = z.infer<typeof exchangeRateSchema>;

export const messageSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  message: z.string(),
  createdAt: z.string(),
  isRead: z.string(),
});

export const insertMessageSchema = messageSchema.omit({
  id: true,
  createdAt: true,
  isRead: true,
});
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = z.infer<typeof messageSchema>;

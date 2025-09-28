import { db } from "./db";
import { products, users, contactInfo, exchangeRate } from "@shared/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";
import type { IStorage } from "./storage";

export const drizzleStorage: IStorage = {
  async getUser(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  },
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  },
  async createUser(user) {
    const [created] = await db.insert(users).values({ ...user, id: randomUUID() }).returning();
    return created;
  },
  async getProducts() {
    return db.select().from(products).where(eq(products.isActive, "true"));
  },
  async getProduct(id) {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  },
  async getProductsByCategory(category) {
    return db.select().from(products).where(eq(products.category, category)).where(eq(products.isActive, "true"));
  },
  async createProduct(product) {
    const [created] = await db.insert(products).values({ ...product, id: randomUUID() }).returning();
    return created;
  },
  async updateProduct(id, productUpdate) {
    const [updated] = await db.update(products).set(productUpdate).where(eq(products.id, id)).returning();
    return updated;
  },
  async deleteProduct(id) {
    const [deleted] = await db.delete(products).where(eq(products.id, id)).returning();
    return !!deleted;
  },
  async getContactInfo() {
    const [info] = await db.select().from(contactInfo);
    return info;
  },
  async updateContactInfo(phone) {
    const [info] = await db.select().from(contactInfo);
    if (info) {
      const [updated] = await db.update(contactInfo).set({ phone }).where(eq(contactInfo.id, info.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(contactInfo).values({ id: randomUUID(), phone }).returning();
      return created;
    }
  },
  async getExchangeRates() {
    return db.select().from(exchangeRate);
  },
  async updateExchangeRate(currency, rate) {
    const [ex] = await db.select().from(exchangeRate).where(eq(exchangeRate.currency, currency));
    if (ex) {
      const [updated] = await db.update(exchangeRate).set({ rate }).where(eq(exchangeRate.id, ex.id)).returning();
      return updated;
    } else {
      const [created] = await db.insert(exchangeRate).values({ id: randomUUID(), currency, rate }).returning();
      return created;
    }
  },
};

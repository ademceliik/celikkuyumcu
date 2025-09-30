import { randomUUID } from "crypto";
import {
  type AboutInfo,
  type ContactInfo,
  type ExchangeRate,
  type HomepageInfo,
  type InsertAboutInfo,
  type InsertContactInfo,
  type InsertHomepageInfo,
  type InsertMessage,
  type InsertProduct,
  type InsertUser,
  type Message,
  type Product,
  type User,
} from "@shared/schema";

export interface IStorage {
  getHomepageInfo(): Promise<HomepageInfo | undefined>;
  updateHomepageInfo(data: Partial<InsertHomepageInfo>): Promise<HomepageInfo>;

  getAboutInfo(): Promise<AboutInfo | undefined>;
  updateAboutInfo(data: Partial<InsertAboutInfo>): Promise<AboutInfo>;

  createMessage(message: InsertMessage): Promise<Message>;
  getMessages(): Promise<Message[]>;
  updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;

  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(data: Partial<InsertContactInfo>): Promise<ContactInfo>;

  getExchangeRates(): Promise<ExchangeRate[]>;
  updateExchangeRate(currency: string, rate: string): Promise<ExchangeRate>;
}

export class MemStorage implements IStorage {
  private homepageInfo: HomepageInfo | undefined;
  private aboutInfo: AboutInfo | undefined;
  private messages = new Map<string, Message>();
  private users = new Map<string, User>();
  private products = new Map<string, Product>();
  private contactInfo: ContactInfo | undefined;
  private exchangeRates = new Map<string, ExchangeRate>();

  constructor() {
    this.contactInfo = {
      id: randomUUID(),
      address: "Adres belirtilmedi",
      phone: "+90 555 555 55 55",
      workingHours: "09:00 - 18:00",
    };
    this.homepageInfo = {
      id: randomUUID(),
      title: "Celik Kuyumcu",
      description: "Modern kuyumcu deneyimi",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    };
    this.aboutInfo = {
      id: randomUUID(),
      title: "Hakkimizda",
      description: "Deneyimli kuyumculuk ekibi",
      experienceYears: 20,
      customerCount: 500,
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    };
  }

  async getHomepageInfo(): Promise<HomepageInfo | undefined> {
    return this.homepageInfo;
  }

  async updateHomepageInfo(data: Partial<InsertHomepageInfo>): Promise<HomepageInfo> {
    if (!this.homepageInfo) {
      this.homepageInfo = {
        id: randomUUID(),
        title: data.title ?? "",
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? "",
      };
    } else {
      this.homepageInfo = { ...this.homepageInfo, ...data };
    }
    return this.homepageInfo;
  }

  async getAboutInfo(): Promise<AboutInfo | undefined> {
    return this.aboutInfo;
  }

  async updateAboutInfo(data: Partial<InsertAboutInfo>): Promise<AboutInfo> {
    if (!this.aboutInfo) {
      this.aboutInfo = {
        id: randomUUID(),
        title: data.title ?? "",
        description: data.description ?? "",
        experienceYears: data.experienceYears ?? 0,
        customerCount: data.customerCount ?? 0,
        imageUrl: data.imageUrl ?? "",
      };
    } else {
      this.aboutInfo = { ...this.aboutInfo, ...data } as AboutInfo;
    }
    return this.aboutInfo;
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const newMessage: Message = {
      id,
      name: message.name,
      phone: message.phone,
      message: message.message,
      createdAt,
      isRead: "false",
    };
    this.messages.set(id, newMessage);
    return newMessage;
  }

  async getMessages(): Promise<Message[]> {
    return Array.from(this.messages.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined> {
    const current = this.messages.get(id);
    if (!current) return undefined;
    const updated = { ...current, isRead };
    this.messages.set(id, updated);
    return updated;
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find((user) => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const record: User = {
      id,
      username: user.username,
      password: user.password,
      role: user.role ?? "admin",
    };
    this.users.set(id, record);
    return record;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter((product) => product.isActive !== "false");
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category && product.isActive !== "false",
    );
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const record: Product = {
      id,
      name: product.name,
      category: product.category,
      weight: product.weight,
      goldKarat: product.goldKarat,
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? "true",
      hasWorkmanship: product.hasWorkmanship ?? "true",
    };
    this.products.set(id, record);
    return record;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const current = this.products.get(id);
    if (!current) return undefined;
    const updated: Product = {
      ...current,
      ...product,
      isActive: product.isActive ?? current.isActive,
      hasWorkmanship: product.hasWorkmanship ?? current.hasWorkmanship,
    } as Product;
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfo;
  }

  async updateContactInfo(data: Partial<InsertContactInfo>): Promise<ContactInfo> {
    const base: ContactInfo = this.contactInfo ?? {
      id: randomUUID(),
      address: "",
      phone: "",
      workingHours: "",
    };
    this.contactInfo = {
      ...base,
      ...data,
    } as ContactInfo;
    return this.contactInfo;
  }

  async getExchangeRates(): Promise<ExchangeRate[]> {
    return Array.from(this.exchangeRates.values());
  }

  async updateExchangeRate(currency: string, rate: string): Promise<ExchangeRate> {
    const existing = this.exchangeRates.get(currency);
    const record: ExchangeRate = {
      id: existing?.id ?? randomUUID(),
      currency,
      rate,
    };
    this.exchangeRates.set(currency, record);
    return record;
  }
}

export const storage = new MemStorage();

  updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined>;
  deleteMessage(id: string): Promise<boolean>;
  async updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined> {
    const msg = this.messages.get(id);
    if (!msg) return undefined;
    msg.isRead = isRead;
    this.messages.set(id, msg);
    return msg;
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }
import { type User, type InsertUser, type Product, type InsertProduct, type ContactInfo, type ExchangeRate, type Message, type InsertMessage, type HomepageInfo, type InsertHomepageInfo, type AboutInfo, type InsertAboutInfo } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Homepage Info
  getHomepageInfo(): Promise<HomepageInfo | undefined>;
  updateHomepageInfo(data: Partial<InsertHomepageInfo>): Promise<HomepageInfo>;

  // About Info
  getAboutInfo(): Promise<AboutInfo | undefined>;
  updateAboutInfo(data: Partial<InsertAboutInfo>): Promise<AboutInfo>;
  // Messages
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

  // Contact Info
  getContactInfo(): Promise<ContactInfo | undefined>;
  updateContactInfo(phone: string): Promise<ContactInfo>;

  // Exchange Rate
  getExchangeRates(): Promise<ExchangeRate[]>;
  updateExchangeRate(currency: string, rate: string): Promise<ExchangeRate>;
}

export class MemStorage implements IStorage {
  private homepageInfo: HomepageInfo | undefined;
  private aboutInfo: AboutInfo | undefined;
  private messages: Map<string, Message> = new Map();
  async updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined> {
    const msg = this.messages.get(id);
    if (!msg) return undefined;
    msg.isRead = isRead;
    this.messages.set(id, msg);
    return msg;
  }

  async deleteMessage(id: string): Promise<boolean> {
    return this.messages.delete(id);
  }
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }

  async getMessages(): Promise<Message[]> {
    // Yeni gelen en üstte olacak şekilde sırala
    return Array.from(this.messages.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  private users: Map<string, User>;
  private products: Map<string, Product>;

  private contactInfo: ContactInfo | undefined;
  private exchangeRates: Map<string, ExchangeRate>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.exchangeRates = new Map();
    // Varsayılan iletişim ve kur bilgisi
    this.contactInfo = { id: randomUUID(), phone: "+90 555 555 55 55" };
    this.homepageInfo = {
      id: randomUUID(),
      title: "Altının Büyüsünü Keşfedin",
      description: "Çelik Kuyumcu ile en kaliteli altın ve mücevherat ürünlerini keşfedin.",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };
    this.aboutInfo = {
      id: randomUUID(),
      title: "Hakkımızda",
      description: "1998 yılından bu yana altın ve mücevherat sektöründe hizmet veren Çelik Kuyumcu, müşteri memnuniyetini en üst seviyede tutmaya odaklanıyor.",
      experienceYears: 25,
      customerCount: 1000,
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    };
  // Homepage Info
  async getHomepageInfo(): Promise<HomepageInfo | undefined> {
    return this.homepageInfo;
  }
  async updateHomepageInfo(data: Partial<InsertHomepageInfo>): Promise<HomepageInfo> {
    if (!this.homepageInfo) {
      this.homepageInfo = { id: randomUUID(), ...data } as HomepageInfo;
    } else {
      this.homepageInfo = { ...this.homepageInfo, ...data };
    }
    return this.homepageInfo;
  }

  // About Info
  async getAboutInfo(): Promise<AboutInfo | undefined> {
    return this.aboutInfo;
  }
  async updateAboutInfo(data: Partial<InsertAboutInfo>): Promise<AboutInfo> {
    if (!this.aboutInfo) {
      this.aboutInfo = { id: randomUUID(), ...data } as AboutInfo;
    } else {
      this.aboutInfo = { ...this.aboutInfo, ...data };
    }
    return this.aboutInfo;
  }
    this.initializeProducts();
    this.initializeExchangeRates();
  }

  private async initializeExchangeRates() {
    const rates: [string, string][] = [
      ["USD", "28.50"],
      ["EUR", "31.00"],
      ["GRAM ALTIN", "1700.00"]
    ];
    for (const [currency, rate] of rates) {
      await this.updateExchangeRate(currency, rate);
    }
  }

  private async initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Pırlanta Yüzük",
        category: "yuzuk",
        weight: "8.50",
        goldKarat: 18,
        imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      },
      {
        name: "İnci Kolye",
        category: "kolye",
        weight: "12.30",
        goldKarat: 14,
        imageUrl: "https://images.unsplash.com/photo-1611652022419-a9419f74343d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      },
      {
        name: "Zincir Bilezik",
        category: "bilezik",
        weight: "6.70",
        goldKarat: 22,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      },
      {
        name: "Halka Küpe",
        category: "kupe",
        weight: "3.80",
        goldKarat: 22,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      },
      {
        name: "Kristal Bileklik",
        category: "bileklik",
        weight: "9.40",
        goldKarat: 18,
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      },
      {
        name: "Elegance Gerdanlık",
        category: "gerdanlik",
        weight: "15.20",
        goldKarat: 14,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        isActive: "true",
        hasWorkmanship: "true"
      }
    ];

    for (const product of sampleProducts) {
      await this.createProduct(product);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.isActive === "true");
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      p => p.category === category && p.isActive === "true"
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      isActive: insertProduct.isActive || "true",
      hasWorkmanship: insertProduct.hasWorkmanship || "true"
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, productUpdate: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;
    
    const updatedProduct: Product = { ...existingProduct, ...productUpdate };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Contact Info
  async getContactInfo(): Promise<ContactInfo | undefined> {
    return this.contactInfo;
  }
  async updateContactInfo(phone: string): Promise<ContactInfo> {
    if (!this.contactInfo) {
      this.contactInfo = { id: randomUUID(), phone };
    } else {
      this.contactInfo.phone = phone;
    }
    return this.contactInfo;
  }

  // Exchange Rate
  async getExchangeRates(): Promise<ExchangeRate[]> {
    return Array.from(this.exchangeRates.values());
  }
  async updateExchangeRate(currency: string, rate: string): Promise<ExchangeRate> {
    let ex = Array.from(this.exchangeRates.values()).find(e => e.currency === currency);
    if (!ex) {
      ex = { id: randomUUID(), currency, rate };
    } else {
      ex.rate = rate;
    }
    this.exchangeRates.set(currency, ex);
    return ex;
  }
}

export const storage = new MemStorage();

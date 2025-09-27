import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    
    // Initialize with some sample products
    this.initializeProducts();
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
}

export const storage = new MemStorage();

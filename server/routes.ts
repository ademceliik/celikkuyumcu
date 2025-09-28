import { createServer } from "http";
import type { Express } from "express";
import { drizzleStorage as storage } from "./drizzle-storage";
import { insertProductSchema, insertContactInfoSchema, insertExchangeRateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<ReturnType<typeof createServer>> {
  // Admin login
  app.post("/api/users/login", async (req: any, res: any) => {
    const { username, password } = req.body;
    const user = await storage.getUserByUsername(username);
    if (user && user.password === password) {
      return res.json({ success: true });
    }
    return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
  });
  
  // Get all products
  app.get("/api/products", async (req: any, res: any) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Get products by category
  app.get("/api/products/category/:category", async (req: any, res: any) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products by category:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Create product
  app.post("/api/products", async (req: any, res: any) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      console.error("Error creating product:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Update product
  app.patch("/api/products/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const validatedData = insertProductSchema.partial().parse(req.body);
      const product = await storage.updateProduct(id, validatedData);
      if (!product) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      res.json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      console.error("Error updating product:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Delete product
  app.delete("/api/products/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Ürün bulunamadı" });
      }
      res.json({ message: "Ürün başarıyla silindi" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Get contact info
  app.get("/api/contact-info", async (req: any, res: any) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Update contact info
  app.put("/api/contact-info", async (req: any, res: any) => {
    try {
      const validated = insertContactInfoSchema.partial().parse(req.body);
      if (!validated.phone) return res.status(400).json({ message: "Telefon zorunlu" });
      const info = await storage.updateContactInfo(validated.phone);
      res.json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Get exchange rates
  app.get("/api/exchange-rates", async (req: any, res: any) => {
    try {
      const rates = await storage.getExchangeRates();
      res.json(rates);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Update exchange rate
  app.put("/api/exchange-rates", async (req: any, res: any) => {
    try {
      const validated = insertExchangeRateSchema.partial().parse(req.body);
      if (!validated.currency || !validated.rate) return res.status(400).json({ message: "Para birimi ve kur zorunlu" });
      const rate = await storage.updateExchangeRate(validated.currency, validated.rate);
      res.json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Geçersiz veri", errors: error.errors });
      }
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

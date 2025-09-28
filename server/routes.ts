import { createServer } from "http";
import type { Express } from "express";
import { drizzleStorage as storage } from "./drizzle-storage";
import { insertProductSchema, insertContactInfoSchema, insertExchangeRateSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<ReturnType<typeof createServer>> {
  // Homepage Info
  app.get("/api/homepage-info", async (_req: any, res: any) => {
    try {
      const info = await storage.getHomepageInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });
  app.put("/api/homepage-info", async (req: any, res: any) => {
    try {
      const info = await storage.updateHomepageInfo(req.body);
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // About Info
  app.get("/api/about-info", async (_req: any, res: any) => {
    try {
      const info = await storage.getAboutInfo();
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });
  app.put("/api/about-info", async (req: any, res: any) => {
    try {
      const info = await storage.updateAboutInfo(req.body);
      res.json(info);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });
  // Update message (mark as read/unread)
  app.patch("/api/messages/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { isRead } = req.body;
      const updated = await storage.updateMessageReadStatus(id, isRead);
      if (!updated) {
        return res.status(404).json({ message: "Mesaj bulunamadı" });
      }
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });

  // Delete message
  app.delete("/api/messages/:id", async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Mesaj bulunamadı" });
      }
      res.json({ message: "Mesaj başarıyla silindi" });
    } catch (error) {
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });
  // Create message (contact form)
  app.post("/api/messages", async (req: any, res: any) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(400).json({ message: "Geçersiz veri" });
    }
  });

  // Get all messages
  app.get("/api/messages", async (_req: any, res: any) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "İç sunucu hatası" });
    }
  });
  // Admin login
  app.post("/api/admin/login", async (req: any, res: any) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı ve şifre gerekli" });
      }
      
      const user = await storage.getUserByUsername(username);
      if (user && user.password === password) {
        // Session oluştur
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        
        return res.json({ 
          success: true, 
          user: { 
            id: user.id, 
            username: user.username, 
            role: user.role 
          } 
        });
      }
      
      return res.status(401).json({ message: "Kullanıcı adı veya şifre hatalı" });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Admin logout
  app.post("/api/admin/logout", async (req: any, res: any) => {
    try {
      req.session.destroy((err: any) => {
        if (err) {
          return res.status(500).json({ message: "Çıkış yapılamadı" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({ message: "Sunucu hatası" });
    }
  });

  // Check admin session
  app.get("/api/admin/me", async (req: any, res: any) => {
    try {
      if (req.session.userId) {
        const user = await storage.getUserByUsername(req.session.username);
        if (user) {
          return res.json({ 
            success: true, 
            user: { 
              id: user.id, 
              username: user.username, 
              role: user.role 
            } 
          });
        }
      }
      return res.status(401).json({ message: "Oturum bulunamadı" });
    } catch (error) {
      console.error("Session check error:", error);
      return res.status(500).json({ message: "Sunucu hatası" });
    }
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

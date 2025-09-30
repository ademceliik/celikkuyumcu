import { createServer } from "http";
import type { Express, Response } from "express";
import { firebaseStorage as storage } from "./firebase-storage";
import {
  insertContactInfoSchema,
  insertExchangeRateSchema,
  insertMessageSchema,
  insertProductSchema,
} from "@shared/schema";
import { z } from "zod";

const GENERIC_ERROR = { message: "Sunucu hatasi" };

function handleServerError(res: Response, error?: unknown, logKey?: string) {
  if (logKey) {
    console.error(`${logKey}:`, error);
  }
  res.status(500).json(GENERIC_ERROR);
}

export async function registerRoutes(app: Express): Promise<ReturnType<typeof createServer>> {
  app.get("/api/homepage-info", async (_req, res) => {
    try {
      const info = await storage.getHomepageInfo();
      res.json(info ?? null);
    } catch (error) {
      handleServerError(res, error, "homepage-info:get");
    }
  });

  app.put("/api/homepage-info", async (req, res) => {
    try {
      const info = await storage.updateHomepageInfo(req.body ?? {});
      res.json(info);
    } catch (error) {
      handleServerError(res, error, "homepage-info:put");
    }
  });

  app.get("/api/about-info", async (_req, res) => {
    try {
      const info = await storage.getAboutInfo();
      res.json(info ?? null);
    } catch (error) {
      handleServerError(res, error, "about-info:get");
    }
  });

  app.put("/api/about-info", async (req, res) => {
    try {
      const info = await storage.updateAboutInfo(req.body ?? {});
      res.json(info);
    } catch (error) {
      handleServerError(res, error, "about-info:put");
    }
  });

  app.patch("/api/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { isRead } = req.body ?? {};
      if (typeof isRead !== "string") {
        return res.status(400).json({ message: "isRead alani zorunlu" });
      }
      const updated = await storage.updateMessageReadStatus(id, isRead);
      if (!updated) {
        return res.status(404).json({ message: "Mesaj bulunamadi" });
      }
      res.json(updated);
    } catch (error) {
      handleServerError(res, error, "messages:patch");
    }
  });

  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteMessage(id);
      if (!deleted) {
        return res.status(404).json({ message: "Mesaj bulunamadi" });
      }
      res.json({ message: "Mesaj silindi" });
    } catch (error) {
      handleServerError(res, error, "messages:delete");
    }
  });

  app.post("/api/messages", async (req, res) => {
    try {
      const validated = insertMessageSchema.parse(req.body ?? {});
      const created = await storage.createMessage(validated);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Gecersiz veri", errors: error.errors });
      }
      handleServerError(res, error, "messages:post");
    }
  });

  app.get("/api/messages", async (_req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      handleServerError(res, error, "messages:get");
    }
  });

  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body ?? {};
      if (!username || !password) {
        return res.status(400).json({ message: "Kullanici adi ve sifre gerekli" });
      }
      const user = await storage.getUserByUsername(username);
      if (user && user.password === password) {
        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;
        return res.json({
          success: true,
          user: {
            id: user.id,
            username: user.username,
            role: user.role,
          },
        });
      }
      return res.status(401).json({ message: "Kullanici adi veya sifre hatali" });
    } catch (error) {
      handleServerError(res, error, "admin:login");
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.destroy((destroyErr) => {
        if (destroyErr) {
          return res.status(500).json({ message: "Cikis yapilamadi" });
        }
        res.json({ success: true });
      });
    } catch (error) {
      handleServerError(res, error, "admin:logout");
    }
  });

  app.get("/api/admin/me", async (req, res) => {
    try {
      if (req.session.userId && req.session.username) {
        const user = await storage.getUserByUsername(req.session.username);
        if (user) {
          return res.json({
            success: true,
            user: {
              id: user.id,
              username: user.username,
              role: user.role,
            },
          });
        }
      }
      return res.status(401).json({ message: "Oturum bulunamadi" });
    } catch (error) {
      handleServerError(res, error, "admin:me");
    }
  });

  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getProducts();
      res.json(products);
    } catch (error) {
      handleServerError(res, error, "products:get");
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      handleServerError(res, error, "products:category");
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Urun bulunamadi" });
      }
      res.json(product);
    } catch (error) {
      handleServerError(res, error, "products:getOne");
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body ?? {});
      const created = await storage.createProduct(validated);
      res.status(201).json(created);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Gecersiz veri", errors: error.errors });
      }
      handleServerError(res, error, "products:post");
    }
  });

  app.patch("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertProductSchema.partial().parse(req.body ?? {});
      const updated = await storage.updateProduct(id, validated);
      if (!updated) {
        return res.status(404).json({ message: "Urun bulunamadi" });
      }
      res.json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Gecersiz veri", errors: error.errors });
      }
      handleServerError(res, error, "products:patch");
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Urun bulunamadi" });
      }
      res.json({ message: "Urun silindi" });
    } catch (error) {
      handleServerError(res, error, "products:delete");
    }
  });

  app.get("/api/contact-info", async (_req, res) => {
    try {
      const info = await storage.getContactInfo();
      res.json(info ?? null);
    } catch (error) {
      handleServerError(res, error, "contact:get");
    }
  });

  app.put("/api/contact-info", async (req, res) => {
    try {
      const validated = insertContactInfoSchema.partial().parse(req.body ?? {});
      if (Object.keys(validated).length === 0) {
        return res.status(400).json({ message: "En az bir alan zorunlu" });
      }
      const info = await storage.updateContactInfo(validated);
      res.json(info);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Gecersiz veri", errors: error.errors });
      }
      handleServerError(res, error, "contact:put");
    }
  });

  app.get("/api/exchange-rates", async (_req, res) => {
    try {
      const rates = await storage.getExchangeRates();
      res.json(rates);
    } catch (error) {
      handleServerError(res, error, "exchange:get");
    }
  });

  app.put("/api/exchange-rates", async (req, res) => {
    try {
      const validated = insertExchangeRateSchema.partial().parse(req.body ?? {});
      if (!validated.currency || !validated.rate) {
        return res.status(400).json({ message: "Para birimi ve kur zorunlu" });
      }
      const rate = await storage.updateExchangeRate(validated.currency, validated.rate);
      res.json(rate);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Gecersiz veri", errors: error.errors });
      }
      handleServerError(res, error, "exchange:put");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

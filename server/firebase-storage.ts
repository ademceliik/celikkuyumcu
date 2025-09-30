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
import { initFirebase } from "./firebase";
import type { IStorage } from "./storage";

const firestore = initFirebase();

const COLLECTIONS = {
  homepage: "homepageInfo",
  about: "aboutInfo",
  contact: "contactInfo",
  users: "users",
  products: "products",
  messages: "messages",
  exchangeRates: "exchangeRates",
} as const;

const SINGLETON_IDS = {
  homepage: "default",
  about: "default",
  contact: "default",
} as const;

type SnapshotMapper<T> = (data: FirebaseFirestore.DocumentData | undefined, id: string) => T | undefined;

function mapSnapshot<T extends { id: string }>(
  snapshot: FirebaseFirestore.DocumentSnapshot,
  mapper?: SnapshotMapper<T>,
): T | undefined {
  if (!snapshot.exists) {
    return undefined;
  }
  const data = snapshot.data();
  if (mapper) {
    return mapper(data ?? undefined, snapshot.id);
  }
  if (!data) {
    return undefined;
  }
  return { id: snapshot.id, ...(data as Record<string, unknown>) } as T;
}

function mapQuery<T extends { id: string }>(query: FirebaseFirestore.QuerySnapshot, mapper?: SnapshotMapper<T>): T[] {
  return query.docs
    .map((doc) => mapSnapshot<T>(doc, mapper))
    .filter((item): item is T => Boolean(item));
}

function ensureSingleton<T extends { id: string }>(collection: string, docId: string) {
  return firestore.collection(collection).doc(docId);
}

export const firebaseStorage: IStorage = {
  async getHomepageInfo(): Promise<HomepageInfo | undefined> {
    const doc = await ensureSingleton(COLLECTIONS.homepage, SINGLETON_IDS.homepage).get();
    return mapSnapshot<HomepageInfo>(doc, (data, id) =>
      data ? ({ id, ...(data as Omit<HomepageInfo, "id">) }) : undefined,
    );
  },

  async updateHomepageInfo(data: Partial<InsertHomepageInfo>): Promise<HomepageInfo> {
    const ref = ensureSingleton(COLLECTIONS.homepage, SINGLETON_IDS.homepage);
    await ref.set({ id: ref.id, ...data }, { merge: true });
    const doc = await ref.get();
    return mapSnapshot<HomepageInfo>(doc) as HomepageInfo;
  },

  async getAboutInfo(): Promise<AboutInfo | undefined> {
    const doc = await ensureSingleton(COLLECTIONS.about, SINGLETON_IDS.about).get();
    return mapSnapshot<AboutInfo>(doc, (data, id) =>
      data ? ({ id, ...(data as Omit<AboutInfo, "id">) }) : undefined,
    );
  },

  async updateAboutInfo(data: Partial<InsertAboutInfo>): Promise<AboutInfo> {
    const ref = ensureSingleton(COLLECTIONS.about, SINGLETON_IDS.about);
    await ref.set({ id: ref.id, ...data }, { merge: true });
    const doc = await ref.get();
    return mapSnapshot<AboutInfo>(doc) as AboutInfo;
  },

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const payload: Message = {
      id,
      name: message.name,
      phone: message.phone,
      message: message.message,
      createdAt: new Date().toISOString(),
      isRead: "false",
    };
    await firestore.collection(COLLECTIONS.messages).doc(id).set(payload);
    return payload;
  },

  async getMessages(): Promise<Message[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.messages)
      .orderBy("createdAt", "desc")
      .get();
    return mapQuery<Message>(snapshot);
  },

  async updateMessageReadStatus(id: string, isRead: string): Promise<Message | undefined> {
    const ref = firestore.collection(COLLECTIONS.messages).doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return undefined;
    }
    await ref.update({ isRead });
    const updated = await ref.get();
    return mapSnapshot<Message>(updated) as Message;
  },

  async deleteMessage(id: string): Promise<boolean> {
    const ref = firestore.collection(COLLECTIONS.messages).doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return false;
    }
    await ref.delete();
    return true;
  },

  async getUser(id: string): Promise<User | undefined> {
    const doc = await firestore.collection(COLLECTIONS.users).doc(id).get();
    return mapSnapshot<User>(doc) as User | undefined;
  },

  async getUserByUsername(username: string): Promise<User | undefined> {
    const snapshot = await firestore
      .collection(COLLECTIONS.users)
      .where("username", "==", username)
      .limit(1)
      .get();
    if (snapshot.empty) {
      return undefined;
    }
    return mapSnapshot<User>(snapshot.docs[0]) as User | undefined;
  },

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const payload: User = {
      id,
      username: user.username,
      password: user.password,
      role: user.role ?? "admin",
    };
    await firestore.collection(COLLECTIONS.users).doc(id).set(payload);
    return payload;
  },

  async getProducts(): Promise<Product[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.products)
      .where("isActive", "==", "true")
      .get();
    return mapQuery<Product>(snapshot);
  },

  async getProduct(id: string): Promise<Product | undefined> {
    const doc = await firestore.collection(COLLECTIONS.products).doc(id).get();
    return mapSnapshot<Product>(doc) as Product | undefined;
  },

  async getProductsByCategory(category: string): Promise<Product[]> {
    const snapshot = await firestore
      .collection(COLLECTIONS.products)
      .where("category", "==", category)
      .where("isActive", "==", "true")
      .get();
    return mapQuery<Product>(snapshot);
  },

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const payload: Product = {
      id,
      name: product.name,
      category: product.category,
      weight: product.weight,
      goldKarat: product.goldKarat,
      imageUrl: product.imageUrl,
      isActive: product.isActive ?? "true",
      hasWorkmanship: product.hasWorkmanship ?? "true",
    };
    await firestore.collection(COLLECTIONS.products).doc(id).set(payload);
    return payload;
  },

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const ref = firestore.collection(COLLECTIONS.products).doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return undefined;
    }
    await ref.set(product, { merge: true });
    const updated = await ref.get();
    return mapSnapshot<Product>(updated) as Product;
  },

  async deleteProduct(id: string): Promise<boolean> {
    const ref = firestore.collection(COLLECTIONS.products).doc(id);
    const doc = await ref.get();
    if (!doc.exists) {
      return false;
    }
    await ref.delete();
    return true;
  },

  async getContactInfo(): Promise<ContactInfo | undefined> {
    const doc = await ensureSingleton(COLLECTIONS.contact, SINGLETON_IDS.contact).get();
    return mapSnapshot<ContactInfo>(doc, (data, id) =>
      data ? ({ id, ...(data as Omit<ContactInfo, "id">) }) : undefined,
    );
  },

  async updateContactInfo(data: Partial<InsertContactInfo>): Promise<ContactInfo> {
    const ref = ensureSingleton(COLLECTIONS.contact, SINGLETON_IDS.contact);
    await ref.set({ id: ref.id, ...data }, { merge: true });
    const updated = await ref.get();
    return mapSnapshot<ContactInfo>(updated) as ContactInfo;
  },

  async getExchangeRates(): Promise<ExchangeRate[]> {
    const snapshot = await firestore.collection(COLLECTIONS.exchangeRates).get();
    return mapQuery<ExchangeRate>(snapshot);
  },

  async updateExchangeRate(currency: string, rate: string): Promise<ExchangeRate> {
    const ref = firestore.collection(COLLECTIONS.exchangeRates).doc(currency);
    await ref.set({ id: ref.id, currency, rate }, { merge: true });
    const updated = await ref.get();
    return mapSnapshot<ExchangeRate>(updated) as ExchangeRate;
  },
};

export async function ensureFirebaseDefaults(): Promise<void> {
  const homepage = await firebaseStorage.getHomepageInfo();
  if (!homepage) {
    const defaults: InsertHomepageInfo = {
      title: "Celik Kuyumcu",
      description: "Modern kuyumculuk hizmetleri",
      imageUrl: "https://images.unsplash.com/photo-1605100804763-247f67b3557e",
    };
    await firebaseStorage.updateHomepageInfo(defaults);
  }

  const about = await firebaseStorage.getAboutInfo();
  if (!about) {
    const defaults: InsertAboutInfo = {
      title: "Hakkimizda",
      description: "Yillarin deneyimine sahip kuyumculuk firmasi",
      experienceYears: 20,
      customerCount: 500,
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    };
    await firebaseStorage.updateAboutInfo(defaults);
  }

  const contact = await firebaseStorage.getContactInfo();
  if (!contact) {
    const defaults: InsertContactInfo = {
      address: "Istanbul, Turkiye",
      phone: "+90 555 555 55 55",
      workingHours: "Pazartesi-Cumartesi 09:00-18:00",
    };
    await firebaseStorage.updateContactInfo(defaults);
  }

  const adminUser = await firebaseStorage.getUserByUsername("admin");
  if (!adminUser) {
    const defaults: InsertUser = {
      username: "admin",
      password: "admin123",
      role: "admin",
    };
    await firebaseStorage.createUser(defaults);
  }

  const existingProducts = await firebaseStorage.getProducts();
  if (existingProducts.length === 0) {
    const samples: InsertProduct[] = [
      {
        name: "Klasik Yuzuk",
        category: "yuzuk",
        weight: "4.20",
        goldKarat: 14,
        imageUrl: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3",
        isActive: "true",
        hasWorkmanship: "true",
      },
      {
        name: "Baget Yuzuk",
        category: "yuzuk",
        weight: "5.10",
        goldKarat: 18,
        imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        isActive: "true",
        hasWorkmanship: "true",
      },
      {
        name: "Zincir Bilezik",
        category: "bilezik",
        weight: "6.70",
        goldKarat: 22,
        imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
        isActive: "true",
        hasWorkmanship: "true",
      },
      {
        name: "Kristal Bileklik",
        category: "bileklik",
        weight: "9.40",
        goldKarat: 18,
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c",
        isActive: "true",
        hasWorkmanship: "true",
      },
    ];
    for (const product of samples) {
      await firebaseStorage.createProduct(product);
    }
  }
}

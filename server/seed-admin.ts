import { db } from "./db";
import { users } from "@shared/schema";

async function seedAdminUser() {
  const existing = await db.select().from(users).where(users.username.eq("admin"));
  if (existing.length === 0) {
    await db.insert(users).values({ username: "admin", password: "admin" });
    // NOT: Canlıda şifreyi mutlaka değiştirin!
    console.log("Admin kullanıcısı eklendi: admin / admin");
  } else {
    console.log("Admin kullanıcısı zaten mevcut.");
  }
}

seedAdminUser().then(() => process.exit(0));

import { initFirebase } from "./firebase";
import { ensureFirebaseDefaults } from "./firebase-storage";

export async function initializeDatabase(): Promise<void> {
  try {
    initFirebase();
    await ensureFirebaseDefaults();
    console.log("Firebase baglantisi hazir ve varsayilan veriler kontrol edildi.");
  } catch (error) {
    console.error("Firebase baslatma hatasi:", error);
    throw error;
  }
}

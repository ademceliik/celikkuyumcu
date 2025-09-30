import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let cachedInstance: FirebaseFirestore.Firestore | null = null;

function resolveCredentials() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    return JSON.parse(serviceAccountJson);
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (projectId && clientEmail && privateKey) {
    return { projectId, clientEmail, privateKey };
  }

  throw new Error("Firebase kimlik bilgileri bulunamadi. Ortam degiskenlerini kontrol edin.");
}

export function initFirebase(): FirebaseFirestore.Firestore {
  if (cachedInstance) {
    return cachedInstance;
  }

  if (getApps().length === 0) {
    const credentials = resolveCredentials();
    initializeApp({
      credential: cert(credentials),
    });
  }

  cachedInstance = getFirestore();
  cachedInstance.settings({ ignoreUndefinedProperties: true });
  return cachedInstance;
}

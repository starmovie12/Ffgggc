import * as admin from 'firebase-admin';

/**
 * Firebase Admin SDK - Secure Lazy Initialization
 * SECURITY FIX: No hardcoded credentials. Only reads from process.env.
 */

function initializeFirebase(): admin.app.App {
  // Agar app pehle se initialized hai, toh wahi return karo (Double initialization roko)
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Vercel se FIREBASE_SERVICE_ACCOUNT ka poora JSON string uthao
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountEnv) {
    throw new Error(
      '❌ Firebase credentials missing! Set FIREBASE_SERVICE_ACCOUNT in your Vercel environment variables.'
    );
  }

  let serviceAccount;
  try {
    // String ko wapas JSON Object mein convert karo
    serviceAccount = JSON.parse(serviceAccountEnv);
  } catch (error) {
    throw new Error(
      '❌ FIREBASE_SERVICE_ACCOUNT is not a valid JSON string. Please check Vercel settings.'
    );
  }

  // Private key ke nishaan (\n) ko asli line breaks mein badlo (warna Firebase reject kar dega)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  // Firebase app initialize karo
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialized using Service Account JSON');
  return app;
}

let _db: admin.firestore.Firestore | null = null;

function getDb(): admin.firestore.Firestore {
  if (!_db) {
    const app = initializeFirebase();
    _db = admin.firestore(app);
  }
  return _db;
}

export const db: admin.firestore.Firestore = new Proxy(
  {} as admin.firestore.Firestore,
  {
    get(_target, prop, receiver) {
      const realDb = getDb();
      const value = Reflect.get(realDb, prop, receiver);
      if (typeof value === 'function') {
        return value.bind(realDb);
      }
      return value;
    },
  }
);

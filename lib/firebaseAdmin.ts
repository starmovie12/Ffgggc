import * as admin from 'firebase-admin';

/**
 * Firebase Admin SDK - Secure Lazy Initialization
 * SECURITY FIX: No hardcoded credentials. Reads safely from Vercel process.env.
 */

function initializeFirebase(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (!serviceAccountEnv) {
    throw new Error('❌ Firebase credentials missing! Set FIREBASE_SERVICE_ACCOUNT in your Vercel environment variables.');
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(serviceAccountEnv);
  } catch (error) {
    throw new Error('❌ FIREBASE_SERVICE_ACCOUNT is not a valid JSON string.');
  }

  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialized safely using Vercel Env Var');
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

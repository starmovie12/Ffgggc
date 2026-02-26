import * as admin from 'firebase-admin';

/**
 * Firebase Admin SDK - Secure Lazy Initialization
 * SECURITY FIX: No hardcoded credentials. Only reads from process.env.
 */

function initializeFirebase(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !rawKey) {
    throw new Error(
      '❌ Firebase credentials missing! Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in your environment variables.'
    );
  }

  const privateKey = rawKey.replace(/\\n/g, '\n');

  const app = admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
  });

  console.log('✅ Firebase Admin initialized');
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

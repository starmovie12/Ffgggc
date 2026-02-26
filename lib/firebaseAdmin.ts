import * as admin from 'firebase-admin';

/**
 * Firebase Admin SDK - Secure Lazy Initialization
 * FIX: Using hardcoded credentials to avoid Vercel 500 server errors permanently.
 */

function initializeFirebase(): admin.app.App {
  // Agar app pehle se initialized hai, toh wahi return karo (Double initialization roko)
  if (admin.apps.length > 0) {
    return admin.apps[0]!;
  }

  // Vercel Environment Variables ka error hatane ke liye direct Firebase Key dal di hai
  const serviceAccount = {
    "type": "service_account",
    "project_id": "bhaag-df531",
    "private_key_id": "3e705a9bbe9d91ec95858d5075c6dd791b6f5628",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDP+2ORCiJaNevh\nSi2ModwVwLxEbIo7XoPY3IgK9aZWL031MRm5rGjxzbWz+7l8p0aU7mDXmgaQoJQp\nX08glFI41LkoEFdzNPDvc1B/gSsYQ/r9bL57QlpYnWs2/n51F+27Ew+f/lj8GIna\naDjoi3mNrsgYGQmRSd7Xzs4mKYLp/WDBlnT3jTgjKVdvGVUKE8QV5EHq8meu/wjt\ncpRr8Ij2iW9Ya7h36HjRwPFoKALXkXZb4WLO11A9Jgi1UC7ASlRzLaTzbOrK2Kec\nJj5VeLCjRNM5s1ZTlhkDESTCHNyGMP5W7kzY6diaqZrozLygkUX4ZnPsbhe+IXAA\ndtpKVL31AgMBAAECggEAC6gk2U0Om4IYgYzanF5kC0oSoz52yZi6CLkPh5cOEW2J\npTDxJqwdnlPabRyHiw+FurTY86yRKqD9Z4uNJUp63e7k88m6r7KAwIL0443rSusL\nJxIQY7CBMiScjOgFpsLGaGz15rs8OeDsNQlmCyPqFlanULEdN/9Ca1O5en/AHnoj\nA3T1U4yYnI0iGaIsC/upvW+3tlG7Wr8ePgwbk0Rmfk4L6LQJbUncBWCqCWof/inZ\ngVBC5CK8mmQJuzkKBbXIMPfP9gNrucAOS1VHy6i6/S7s04qZvi+1cjocsyd/7lGv\ngJQDkngAGSXs0JeVG/aad5tSw6H/Ztvvw5kBYgnuXwKBgQDwa1/PPAEAwGjRBLT9\nre+cPFI6Pf13OkPHOC3qlx4E6ZWl+mn5wmtmxebAypDzVbGblaHRLIsfUK/VcTxf\nKP8jPkRbl9avoIUxrcHP56CeSitQ68pqCeTY6Ya3j7bMUi1TMpSOqaIabVo6zeZ4\ncHoeCrU/xvpyO657rCxtXcmw/wKBgQDddd5QHLsNMtfZwHUdDK+0IGsAk2fvV6XB\ns82vpd+B4DGmHoHVqYoJDQA/x8Fz9rGQyzaBhLoAaEao9kSImevAlgHb3jblO0bs\nlRu4IqdAevQ4wW8NwZINhH6kQqKfOqx1SNWmRN5w9OQAdakhUGn4OykoO0hjENK9\nuJvmXSLdCwKBgQCoQOzvUjX9eaqhRSMJOjYraAe/3OxLCYqvnIB94b5Pf82MOCD8\nevTBGxTvrZQdx8YhdWmmwv6mLsivnqy6iC1uU8BxPWUwyi0M5GZ0As1kmdGQs0OY\nTE5NA7mVM02h1o0D4a0X3l2lEwyHhNubRFQiPCo2dSGG2n+063y4GV/yrwKBgQDJ\nmry4d389A7UGcTLsMBlfxEdErexnMYYfMV0k8r7mz77C+HC/nmif1qsMZP/SXpjF\nNIm5HKfrKQJyXEaFiIHav3SPwNp+khj91Lv4Q+u4QnZDmKxNfJNGJQDY7iR3CgXn\ne1er1nQdpoJNfM9sGXVu2gScsGM0dCM1PXMHInBTgwKBgQDkCdg0D2A41tYsZ7p/\nSLxbErQqK9pJAGsYdzcRNXbJ7XnHX30B5qt1u0kdBmHY2VH03D/QKQJHt4PpUyEv\nBZVwEbT5noksUBiCT30MeZjd5LlT1c4YkgDTc0q5YmD8cW0v4/1VblCOkwhMgQ0r\nkm8h5/4VhoHk2DKOYvp5xWsXfg==\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-5pplx@bhaag-df531.iam.gserviceaccount.com",
    "client_id": "103129736761684397845",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5pplx%40bhaag-df531.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };

  // Private key ke nishaan (\n) ko asli line breaks mein badlo (warna Firebase reject kar dega)
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
  }

  // Firebase app initialize karo
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  console.log('✅ Firebase Admin initialized using hardcoded Service Account');
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

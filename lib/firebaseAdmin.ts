import * as admin from 'firebase-admin';
import type { EngineStatus } from './types';

declare global {
  // eslint-disable-next-line no-var
  var __FIREBASE_ADMIN_APP__: admin.app.App | undefined;
  // eslint-disable-next-line no-var
  var __FIREBASE_ADMIN_DB__: admin.firestore.Firestore | undefined;
}

function initializeFirebase(): admin.app.App {
  if (globalThis.__FIREBASE_ADMIN_APP__) return globalThis.__FIREBASE_ADMIN_APP__;
  if (admin.apps.length > 0 && admin.apps[0]) {
    globalThis.__FIREBASE_ADMIN_APP__ = admin.apps[0];
    return admin.apps[0];
  }

  // Tumhara NAYA Firebase Service Account JSON yahan hardcode kar diya gaya hai
  const serviceAccount = {
    "type": "service_account",
    "project_id": "bhaag-df531",
    "private_key_id": "0af0125a62c6f532d0674af6e8c7d18b02150ff4",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQD4SerGxLF4tmIU\nzZhROLq7vERyLNGxVMmAevEYoA9Ntv0iEeepIYGHF7uQQhA47EelQC8L0v34n5N+\nkqFGbhtv/IDLAYS0DjesnJGr9pgkapc9kT/Fnt0u8xjtlvL+jyvF8eUJ6ehR5mh8\nZNiqZECDBW/yjOMBd770kOaroavboGvvZYSmKpGOmG0wQqOWRskAxnr5ZzkaXnXr\naK25HFA2SfIBCkDaJSI6AiNBJIDaKIkTuQ3HhyTKXaD0x0wa75J1ceselOXkziAD\nF+uF65h247qVal3EYca/qUOU5NC4mo4tuDjHX29wc1vDckcU5e11TgmJ+8Ge6aOl\nIA/ZJWo1AgMBAAECggEAF7/UR/aFBkelypke3ngHbpEz19r/JM/4JUS9Po6C4Dtm\na6WcS+KDVgV4YLRdAmDheoZQ6bfhKLC05kjGyeqaz8Oumxx2UdXBUA665WDFTUhv\n1okH+VJ4lDbXFdTYQe62cGzyrFfWK81XBb0Mt4G25QF2Y5RD235VguXAVr70ZiG6\nLUsNjw7BEPAC0dwyjI/6W8/gsosmVyh3uC96V6JmjKsfJvrJaMQbpCUAfO853WFC\nROc0nV+81px/5qirfsW+aMoaLZbGap5ytGcKOHpdk+V2A2LJS/BtU3U1z9ExbDrp\nbdBecg30RZ0UdRtIw4kIGR9abZlU2CYFW7os0tMoWQKBgQD+/KMTfAz8mIcTXQ2z\nhmZ9joIwvamk+V8gtoEz7CdbZT1RTFvyHh3HFzw+ycKvHfk472M74yQQ41kMlYrx\nFFNK6FlZQeHxzed4eTPsNH3RE251cuQKssb5+zD/XBQmFYxsVEXntBPu4kzGkooJ\njost25kPWPLme9sfmvlP1N0CeQKBgQD5RneNWRtSD8L5JcTvNtgex1orE9vYDKsM\nnJz3dpNeHP1nFxTQbqQYFKCPwwO851W0VIELryQWY7OMGy1cpsaJ85j8DVvbavCb\nBy4kmhsXRCJX0GYDu5TjVbotab+YzeaGCPLkpQ7oC39KAwbP/u9+WJVWHmG14j4u\n3OmK9WiWnQKBgGYYwC8wD38gj404SCEm4mjJo+ViO8f7tZRCny8sEoIs4kVoHrSu\nTFwIOK4nWRWHGeArMf+rrig479HzGsP20HcA2626jH6mZFU/qoOcbPhHIIZUb2y9\nMqCrbG4C72pkXGqPv8HLv+N5pyYnTLAQ7Dd7YyjbA783voBELClD4Q55AoGBAIee\n1xyIBl03RhTXf7XGWP8l5uDZBRseiVFrQ9s/IB5sF1InNKPSDmUrk8+jgj0cf3yF\nHVCGEVQ9Gkp33s4xzoLvjaRUgE14eT9fQLOZRHP8FdNBBr+xJugolApxJlS0cV8r\nLztGsj19Q9u4mdRAF3zeJSGdlfunA73rYwS/UA/hAoGAfjryMSu8TuRZPXsfWhVe\n4iA+tu+WSVoGqSIGzTtngmenRoh6/gs58UsaRuVdQavSigOGPLb/N0ZD/W1XkAyg\nNPFeA0NySlilNh5zQ7XqsGU2IIhAtJer2J80S0Y+sJcb7QHZ9P74A06mjHobsdIV\nGZhi6GNsZUyJ5k9Gg5Hsv3s=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-5pplx@bhaag-df531.iam.gserviceaccount.com",
    "client_id": "103129736761684397845",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5pplx%40bhaag-df531.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  };

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key,
    }),
  });

  globalThis.__FIREBASE_ADMIN_APP__ = app;
  console.log('✅ Firebase Admin initialized (JSON-based, HMR-safe)');
  return app;
}

function getDb(): admin.firestore.Firestore {
  if (globalThis.__FIREBASE_ADMIN_DB__) return globalThis.__FIREBASE_ADMIN_DB__;
  const app = initializeFirebase();
  const database = admin.firestore(app);
  try { database.settings({ ignoreUndefinedProperties: true }); } catch {}
  globalThis.__FIREBASE_ADMIN_DB__ = database;
  return database;
}

export const db: admin.firestore.Firestore = new Proxy(
  {} as admin.firestore.Firestore,
  {
    get(_target, prop, receiver) {
      const realDb = getDb();
      const value  = Reflect.get(realDb, prop, receiver);
      if (typeof value === 'function') return value.bind(realDb);
      return value;
    },
  }
);

export async function updateEngineHeartbeat(): Promise<void> {
  try {
    const database = getDb();
    const data: Omit<EngineStatus, 'lastRunAt'> & { lastRunAt: admin.firestore.FieldValue } = {
      lastRunAt: admin.firestore.FieldValue.serverTimestamp(),
      status: 'running',
      message: 'GitHub Auto-Pilot is running background tasks',
    };
    await database.collection('system').doc('engine_status').set(data, { merge: true });
    console.log('💓 Heartbeat updated — Engine is ONLINE');
  } catch (error) {
    console.error('❌ Heartbeat update failed:', error);
  }
}

export { admin };

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

  // Tumhara Firebase Service Account JSON yahan hardcode kar diya gaya hai
  const serviceAccount = {
    "type": "service_account",
    "project_id": "bhaag-df531",
    "private_key_id": "3147179cb40549571be1826b1d9ce392b55c1b85",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC2pjimHN0ONbcy\nWeZkbBTi3Y7Jlnu/cPb+NdlsD7/qZ9UmopH1Vh5ODvT++kLFIMVTP6/mUbS/JR5p\ntMBIFB3qgUH0HfSgJdSQaWmD9Pq8yFNG4jocMSuoDzZR9kAJ7gjbbDCe+ximX58t\neUlOPcjtLGH0Z6r3jV7O428b/pEHgedTYie3bM5fALLFnP252n20e1B7hKPiKHVj\nbebxvKeXd6ibn80CGvL4mRjW3hrcxzHP8/6KJ8xPcPYIzVKKubvtFrF3FAnAKm8a\nY0XLSgAL+NxDjp52CJsVRStyS8QYyAqxzdxBUc67h1funVRuRmIbg31xfnqFazGY\nuQJCYPtPAgMBAAECggEAEpRM/eTAvcHMDVSkwYFXDI7CCBKFKv+oOEqs/7eIa6U9\nQu1VkJG+im0uEcPOR/Qh7mpzj6evDaSOd+05g/t74Y9dcKIdcK74dOosIA6q9Moh\n4nt/sr9zs+g8O9EjSX9LqlpShdF/++iNLhiA0vMo/as+mZh0BTN9uejbtArMoOkz\nOMFtFHrK0j8ICWwGwFQJCCjD9a3ihzm2vaezojnOkOtbZPgP1Hi6M1r0w9MvwoHU\nGvpcxc+hsfokxMrzqYUzUzZf6mdky4IOrGhoo+FWhuFhtbNJZx/MFwlbQKKGNUOn\neB0XDZL/4r4WszHlN1fW7UY58EoLfTS4P/Y2LtdcPQKBgQDtsvFSxUAnLEoCMxyl\nqNpGgvxhpBOjz0+0v6teeGvv8kIlQ6U/w5AHpwQtrcYQrRZNXBMNw0jFnNIPXL9x\nnOq5vbhOEkYJexPoHS3lLpNiExzNn4a1G+sOToxtfNYPkV5V3D/7kjAGJu5Pw+1e\nh38hdlykzyJlhYV2bYQ4dbzEPQKBgQDEtj8viZglIfAlWfQY2EWI4khNlDAm/R8k\ni3k27qbW6guzmeVJCvy2vp1/ILlvjrEKq0X2vdTZg8wDQ5hariUl1/rKWvFmK6wX\nke6pAY4bjdbyR0rvuuDPgRpOydNfBKTL5yO7JA+VP49RlBglUUgAJXZxeC1HnyNd\nyjT0nUqaewKBgQDK4HAYtUKMLMD+H6HTwsqKZEIFFIWuysK9AtrBRwbZRWwvYg0o\n30GPRn3KfwcONK1UWcHpfUQfZjnj4sWDsuqknckw2Wftr57N/hmuApLIoody+TWA\nXtPA4kn5KROLNgfOQK5biepzVccRTajLhdp8NQndoO06uTuwWMkBZ3w2AQKBgDAz\npDoG0lRPA6RzbV/lJuzK3gK8jCwRnF79Gj++rP0+ro1c6ZVDbvdsr/Ul1KqkYXeG\nzocOryh5pjUqjBu0Tn/+c4LAVCTAENRZuwyIyASydfg6Rf+GYG4YaZTi2buPzL32\nLog95t+gioLn8h660xTOGT7mvtmtAiKKWP2TyWMfAoGBAN3OdN+fSmZnyXzyDlPO\n3UUaBSV/vy2t+9iSLAGhQzLIRMax92Oxxr2OrfJ7SM6Gtm3bzxSIdlgXhwLRFHEW\nhUETMpR7FsItl+YEAjPmjPbKifWhLRX2aoNnMrHCJYid8BtDvPJ/TNSlZLgLv0cF\nkodZrWa43AkYtDina4hGX+5I\n-----END PRIVATE KEY-----\n",
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

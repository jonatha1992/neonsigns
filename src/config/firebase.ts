import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  indexedDBLocalPersistence,
  inMemoryPersistence,
  type Auth
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required configuration
const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);

if (missingKeys.length > 0) {
  console.error('Missing Firebase configuration keys:', missingKeys);
  console.error('Please ensure all required environment variables are set in .env.local');
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

try {
  app = initializeApp(firebaseConfig);

  // Choose auth persistence strategy and clear stale tokens when project changes
  const isBrowser = typeof window !== 'undefined';
  const currentProjectId = firebaseConfig.projectId || '';

  if (isBrowser) {
    const PROJECT_KEY = 'neonsigns:firebaseProjectId';
    const previousProjectId = window.localStorage.getItem(PROJECT_KEY);
    const projectChanged = !!previousProjectId && previousProjectId !== currentProjectId;

    if (projectChanged) {
      // Remove stale Firebase auth entries from localStorage to avoid INVALID_ID_TOKEN lookups
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith('firebase:'))
        .forEach((k) => window.localStorage.removeItem(k));

      // Best-effort cleanup of IndexedDB storage used by Firebase Auth
      try {
        // Deleting DB prevents reloading stale users; use in-memory for this session
        window.indexedDB?.deleteDatabase('firebaseLocalStorageDb');
      } catch {
        // ignore cleanup errors
      }
    }

    auth = initializeAuth(app, {
      // If the project changed this session, avoid reading persisted tokens to prevent 400s
      persistence: projectChanged ? inMemoryPersistence : indexedDBLocalPersistence
    });

    window.localStorage.setItem(PROJECT_KEY, currentProjectId);
  } else {
    // Fallback (SSR or no window)
    auth = getAuth(app);
  }
  db = getFirestore(app);
  storage = getStorage(app);

  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

export { app, auth, db, storage };
export default app;

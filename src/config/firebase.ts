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
import logger from '@/utils/logger';

// Firebase configuration - lazy initialization to ensure env vars are loaded
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let initializationPromise: Promise<void> | null = null;

/**
 * Get Firebase configuration from environment variables
 * Ensures variables are loaded before accessing them
 */
function getFirebaseConfig() {
  // Wait a tick to ensure Vite has loaded environment variables
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
  };
}

/**
 * Validate Firebase configuration
 */
function validateFirebaseConfig(config: ReturnType<typeof getFirebaseConfig>): boolean {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !config[key as keyof typeof config]);

  if (missingKeys.length > 0) {
<<<<<<< HEAD
    console.error('[Firebase] Missing configuration keys:', missingKeys);
    console.error('[Firebase] Please ensure all required environment variables are set in .env.local');
=======
    logger.error('[Firebase] Missing configuration keys:', missingKeys);
    logger.error('[Firebase] Please ensure all required environment variables are set in .env.local');
>>>>>>> dev
    return false;
  }

  return true;
}

/**
 * Initialize Firebase (lazy initialization)
 * This function can be called multiple times safely - it will only initialize once
 */
async function initializeFirebaseApp(): Promise<void> {
  // If already initialized, return immediately
  if (app && auth && db && storage) {
    return;
  }

  // If initialization is in progress, wait for it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Start initialization
  initializationPromise = (async () => {
    try {
      // Get configuration (may need a small delay for Vite to load env vars)
      const firebaseConfig = getFirebaseConfig();

      // Validate configuration
      if (!validateFirebaseConfig(firebaseConfig)) {
        console.warn('[Firebase] Initialization skipped due to missing configuration');
        throw new Error('Firebase configuration incomplete');
      }

      // Initialize Firebase app
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

<<<<<<< HEAD
      console.log('[Firebase] Initialized successfully');
    } catch (error) {
      console.error('[Firebase] Error during initialization:', error);
=======
      logger.log('[Firebase] Initialized successfully');
    } catch (error) {
      logger.error('[Firebase] Error during initialization:', error);
>>>>>>> dev
      // Reset initialization promise to allow retry
      initializationPromise = null;
      throw error;
    }
  })();

  return initializationPromise;
}

/**
 * Get Firebase app instance (with automatic initialization)
 */
export async function getApp(): Promise<FirebaseApp> {
  await initializeFirebaseApp();
  if (!app) throw new Error('[Firebase] App not initialized');
  return app;
}

/**
 * Get Firebase auth instance (with automatic initialization)
 */
export async function getAuthInstance(): Promise<Auth> {
  await initializeFirebaseApp();
  if (!auth) throw new Error('[Firebase] Auth not initialized');
  return auth;
}

/**
 * Get Firestore instance (with automatic initialization)
 */
export function getDb(): Firestore {
  if (!db) {
    // Start initialization if not started
    initializeFirebaseApp().catch(err => {
      console.error('[Firebase] Failed to initialize for getDb:', err);
    });
    throw new Error('[Firebase] Firestore not initialized yet - call initializeFirebaseApp() first');
  }
  return db;
}

/**
 * Get Storage instance (with automatic initialization)
 */
export async function getStorageInstance(): Promise<FirebaseStorage> {
  await initializeFirebaseApp();
  if (!storage) throw new Error('[Firebase] Storage not initialized');
  return storage;
}

// Legacy exports for backwards compatibility (synchronous access)
// Note: These may throw if Firebase hasn't been initialized yet
export { app, auth, db, storage };

// Initialize Firebase eagerly when this module loads (non-blocking)
// This ensures Firebase is ready by the time components need it
if (typeof window !== 'undefined') {
  initializeFirebaseApp().catch(err => {
<<<<<<< HEAD
    console.warn('[Firebase] Eager initialization failed:', err);
=======
    logger.warn('[Firebase] Eager initialization failed:', err);
>>>>>>> dev
  });
}

export default app;

// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator, browserLocalPersistence, Auth } from 'firebase/auth';
import { 
  getFirestore, 
  enableMultiTabIndexedDbPersistence,
  initializeFirestore,
  CACHE_SIZE_UNLIMITED,
  persistentLocalCache,
  persistentMultipleTabManager
} from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
  };

  
// Initialize Firebase
let app;
let db;
let auth;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    
    // Initialize Firestore with settings
    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
    
    auth = getAuth(app);

    // Enable auth persistence
    auth.setPersistence(browserLocalPersistence);
    
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
} else {
  app = getApp();
  db = getFirestore(app);
  auth = getAuth(app);
}

export { app, auth, db };
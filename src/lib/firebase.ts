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
    apiKey: "AIzaSyB2An-_fM3jEZFiPCvFPlQL6fDjXT0bpJM",
    authDomain: "maai-7c768.firebaseapp.com",
    projectId: "maai-7c768",
    storageBucket: "maai-7c768.appspot.com",
    messagingSenderId: "271401318015",
    appId: "1:271401318015:web:8e97020eb43bb83a1db14a",
    measurementId: "G-Q39YGKPM61"
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
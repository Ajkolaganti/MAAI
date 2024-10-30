// src/lib/firebase.ts
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
const apps = getApps();

if (!apps.length) {
  initializeApp({
    credential: cert({
    projectId: "maai-7c768",
      clientEmail: "firebase-adminsdk-7a5t2@maai-7c768.iam.gserviceaccount.com",
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
  });
}

export const adminAuth = getAuth();
export const adminDb = getFirestore(); 
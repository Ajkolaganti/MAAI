'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  Auth
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot,
  serverTimestamp,
  DocumentReference,
  Firestore,
  Timestamp
} from 'firebase/firestore';
import { auth as firebaseAuth, db as firebaseDb } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia', // Use the latest API version
});

// Type assertions for Firebase instances
const auth = firebaseAuth as Auth;
const db = firebaseDb as Firestore;

// Define interface for user data structure
interface UserData {
  email: string | null;
  credits: UserCredits;
  createdAt: Timestamp;
  lastSeen: Timestamp;
  plan: 'free' | 'pro' | 'ultra';
}

interface UserCredits {
  total: number;
  used: number;
}

type User = {
  id: string;
  email: string;
  // add other user properties you need
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  credits: UserCredits;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkCredits: () => Promise<boolean>;
  useCredits: (amount: number) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_CREDITS: UserCredits = {
  total: 10,
  used: 0
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [credits, setCredits] = useState<UserCredits>(DEFAULT_CREDITS);
  const router = useRouter();

  // Initialize user document
  const initializeUserDocument = async (
    userRef: DocumentReference,
    userData: Partial<UserData>
  ) => {
    try {
      await setDoc(
        userRef,
        {
          ...userData,
          credits: DEFAULT_CREDITS,
          plan: 'free',
          createdAt: serverTimestamp(),
          lastSeen: serverTimestamp()
        },
        { merge: true }
      );
    } catch (error) {
      console.error('Error initializing user document:', error);
      throw new Error('Failed to initialize user data');
    }
  };

  // Update last seen timestamp
  const updateLastSeen = async (userId: string) => {
    try {
      await setDoc(
        doc(db, 'users', userId),
        { lastSeen: serverTimestamp() },
        { merge: true }
      );
    } catch (error) {
      console.error('Error updating last seen:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', !!user);
      
      if (user) {
        setUser({
          id: user.uid,
          email: user.email || ''
        });
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeDoc = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            const userData = doc.data() as UserData;
            setCredits(userData.credits);
          }
          setLoading(false);
        });

        return () => unsubscribeDoc();
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await initializeUserDocument(userRef, { email: result.user.email });
      } else {
        await updateLastSeen(result.user.uid);
      }
      
      // Set a cookie for middleware
      document.cookie = `auth-token=${await result.user.getIdToken()};path=/`;
      
      // Force navigation
      window.location.replace('/generate');
      
    } catch (error) {
      setLoading(false);
      console.error('Error during sign in:', error);
      throw error;
    }
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userRef = doc(db, 'users', userCredential.user.uid);
      
      await initializeUserDocument(userRef, { email: userCredential.user.email });
    } catch (error) {
      console.error('Error during signup:', error);
      throw new Error('Failed to create account');
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await updateLastSeen(user.id);
      }
      await signOut(auth);
      router.push('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Error signing out:', error);
      throw new Error('Failed to sign out');
    }
  };

  const checkCredits = async () => {
    return credits.total - credits.used > 0;
  };

  const useCredits = async (amount: number = 1) => {
    if (!user) return false;
    if (amount <= 0) throw new Error('Credit amount must be positive');
    
    try {
      const remainingCredits = credits.total - credits.used;
      if (remainingCredits >= amount) {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, {
          credits: {
            total: credits.total,
            used: credits.used + amount
          }
        }, { merge: true });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error using credits:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    credits,
    signIn,
    signUp,
    logout,
    checkCredits,
    useCredits,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
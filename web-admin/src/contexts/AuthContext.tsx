// src/contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import Cookies from 'js-cookie';

export interface UserData {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'user';
  createdAt?: any;
  lastLoginAt?: any;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from Firestore
  const fetchUserData = async (uid: string): Promise<UserData | null> => {
    try {
      const userDoc = await getDoc(doc(db, 'admins', uid));
      if (userDoc.exists()) {
        return { uid, ...userDoc.data() } as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  // Create or update user document in Firestore
  const createUserDocument = async (user: User, additionalData: Partial<UserData> = {}) => {
    if (!user) return;

    const userRef = doc(db, 'admins', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const userData: Partial<UserData> = {
        displayName: displayName || additionalData.displayName || '',
        email: email || '',
        photoURL: photoURL || '',
        role: 'admin',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        ...additionalData
      };

      try {
        await setDoc(userRef, userData);
      } catch (error) {
        console.error('Error creating user document:', error);
        throw error;
      }
    } else {
      // Update last login time
      try {
        await setDoc(userRef, { lastLoginAt: serverTimestamp() }, { merge: true });
      } catch (error) {
        console.error('Error updating user document:', error);
      }
    }
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      // Create Firebase user
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create admin document in Firestore
      await createUserDocument(user, { displayName, role: 'admin' });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message);
    }
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await createUserDocument(user);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message);
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      await createUserDocument(user);
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(error.message);
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      Cookies.remove('auth-token');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // Auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      setUser(user);
      
      if (user) {
        // Get ID token and store it in cookie
        const token = await user.getIdToken();
        Cookies.set('auth-token', token, { expires: 7 }); // Expires in 7 days
        
        // Fetch user data from Firestore
        const userData = await fetchUserData(user.uid);
        setUserData(userData);
      } else {
        setUserData(null);
        Cookies.remove('auth-token');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

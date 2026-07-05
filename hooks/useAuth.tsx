'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { UserSession } from '@/types';

// Define the absolute shape of our Authentication Context State
interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Establish the persistent client subscription with Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        // Enforce administrative email scoping for dashboard access security
        // Replace with your actual admin email when deployment variables are set
        const isAdminUser = firebaseUser.email === 'j2willy03@gmail.com';

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: isAdminUser,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount to prevent memory leaks
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error standardizing application sign-out execution:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook matching production abstraction clean practices
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be wrapped within a valid explicit AuthProvider system');
  }
  return context;
}
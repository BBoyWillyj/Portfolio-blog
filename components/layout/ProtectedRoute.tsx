'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait until the Firebase session listener settles before running evaluation
    if (!loading) {
      if (!user || !user.isAdmin) {
        // Enforce boundary redirect to the authentication portal
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // While checking auth token states, display a high-fidelity loading placeholder
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          {/* Custom Premium Minimalist Spinner */}
          <div className="w-8 h-8 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
          <p className="text-xs font-mono text-brand-muted tracking-widest uppercase">
            Verifying Credentials...
          </p>
        </div>
      </div>
    );
  }

  // Prevent UI flash: if authentication check finishes and user isn't admin, do not render children
  if (!user || !user.isAdmin) {
    return null;
  }

  // Identity verified successfully - grant rendering pass-through
  return <>{children}</>;
}
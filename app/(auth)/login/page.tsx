'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/services/firebase/config';
import { useAuth } from '@/hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-hot-toast';
import { LucideLock, LucideMail, LucideEye, LucideEyeOff } from 'lucide-react';

// Form validation schema enforced strictly at client state runtime
const loginSchema = z.object({
  email: z.string().min(1, 'Email address is required').email('Invalid email address format'),
  password: z.string().min(6, 'Password must consist of at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If an authorized admin user wanders to login, automatically fast-track them to dashboard
  React.useEffect(() => {
    if (user && user.isAdmin) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      // Execute the security authentication handshake with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // Secondary check: verify the authenticated session matches admin constraints
      const isAdminUser = userCredential.user.email === 'j2willy03@gmail.com'; // Adjust configuration variable identically to useAuth
      
      if (isAdminUser) {
        toast.success('Access Granted. Welcome back, Architect.');
        router.push('/dashboard');
      } else {
        toast.error('Unauthorized access profile detected.');
      }
    } catch (error: any) {
      console.error('Login error sequence caught:', error);
      // Clean parsing of typical Firebase security authentication errors
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        toast.error('Invalid administrative credentials provided.');
      } else {
        toast.error('An error occurred during system authentication.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center p-4">
      {/* Premium Glassmorphism Container */}
      <div className="w-full max-w-md bg-zinc-950/40 border border-zinc-800/80 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Background Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="mb-8 text-center">
          <h1 className="text-xl font-medium tracking-tight text-zinc-100 font-sans">
            Control Center Gateway
          </h1>
          <p className="text-xs text-brand-muted font-mono mt-1 uppercase tracking-wider">
            Authorized Personnel Access Only
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Input Block */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 font-sans" htmlFor="email">
              Identity Identifier
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <LucideMail size={16} />
              </span>
              <input
                {...register('email')}
                type="email"
                id="email"
                placeholder="name@domain.com"
                className="w-full pl-10 pr-4 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-400 font-mono mt-0.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input Block */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400 font-sans" htmlFor="password">
              Secure Key Token
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <LucideLock size={16} />
              </span>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 bg-zinc-900/50 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {showPassword ? <LucideEyeOff size={16} /> : <LucideEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 font-mono mt-0.5">{errors.password.message}</p>
            )}
          </div>

          {/* Premium Form Dispatch Execution Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-medium text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed mt-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                <span>Synchronizing Session...</span>
              </>
            ) : (
              <span>Decrypt Access Gateway</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
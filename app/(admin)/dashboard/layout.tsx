'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { 
  LucideLayoutDashboard, 
  LucideFileText, 
  LucideFolderOpen, 
  LucideTag, 
  LucideLogOut, 
  LucideTerminal 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navigationItems = [
    { name: 'Overview', href: '/dashboard', icon: LucideLayoutDashboard },
    { name: 'Manage Posts', href: '/dashboard/posts', icon: LucideFileText },
    { name: 'Categories', href: '/dashboard/categories', icon: LucideFolderOpen },
    { name: 'Tags Engine', href: '/dashboard/tags', icon: LucideTag },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-brand-background flex">
        
        {/* Fixed Left Sidebar Panel Component */}
        <aside className="w-64 border-r border-zinc-800/80 bg-zinc-950/20 backdrop-blur-xl flex flex-col justify-between p-6">
          <div className="space-y-8">
            {/* Branding Console Header */}
            <div className="flex items-center gap-3 px-2">
              <span className="text-brand-accent bg-brand-accent/10 p-2 rounded-lg border border-brand-accent/20">
                <LucideTerminal size={18} />
              </span>
              <div>
                <h2 className="text-sm font-medium text-zinc-200 font-sans tracking-tight">Architect OS</h2>
                <span className="text-[10px] font-mono text-brand-muted uppercase tracking-wider">v1.0.0 Stable</span>
              </div>
            </div>

            {/* Core Navigation Cluster */}
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group font-sans ${
                      isActive
                        ? 'bg-zinc-800/60 text-zinc-100 font-medium border border-zinc-700/50 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40 border border-transparent'
                    }`}
                  >
                    <Icon 
                      size={16} 
                      className={`transition-colors ${
                        isActive ? 'text-brand-accent' : 'text-zinc-500 group-hover:text-zinc-400'
                      }`} 
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Sign-Out Execution Block */}
          <div className="border-t border-zinc-900 pt-4">
            <button
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all duration-200 cursor-pointer font-sans"
            >
              <LucideLogOut size={16} />
              <span>Terminate Session</span>
            </button>
          </div>
        </aside>

        {/* Dynamic Content Display Board Canvas viewport */}
        <main className="flex-grow overflow-y-auto px-10 py-8 bg-zinc-900/10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>

      </div>
    </ProtectedRoute>
  );
}
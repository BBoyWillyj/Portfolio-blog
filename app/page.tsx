'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllPostsFromFirestore } from '@/services/firebase/posts';
import { BlogPost } from '@/types';
import { LucideArrowRight, LucideCalendar, LucideClock, LucideLock } from 'lucide-react';

export default function PortfolioLandingPage() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadPreviewLogs = async () => {
      try {
        const data = await fetchAllPostsFromFirestore(false);
        // Display only the top 2 elements inside the micro portfolio dashboard preview window
        setLatestPosts(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to resolve preview post frames:', error);
      }
    };
    loadPreviewLogs();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1A1A] font-['DM_Sans',sans-serif] selection:bg-[#C8522A]/20 selection:text-[#C8522A]">
      
      {/* ======================== FIXED HEADER NAVBAR ======================== */}
      <nav className="py-5 px-6 md:px-12 sticky top-0 bg-[#F5F0E8]/90 backdrop-blur-md z-50 border-b border-[#E8E0D0]/60">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-2 no-underline">
            <div className="w-8 h-8 bg-[#1A1A1A] rounded flex items-center justify-center">
              <span className="font-['Syne',sans-serif] font-extrabold text-[#F5F0E8] text-sm">W</span>
            </div>
            <span className="font-['Syne',sans-serif] font-bold text-[#1A1A1A] text-base tracking-tight">
              WillyJ<span className="text-[#C8522A]">.</span>
            </span>
          </Link>
         
          {/* Main Integrated Desktop Navigation Links Layout */}
          <div className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider font-light">
            <a href="#home" className="hover:text-[#C8522A] transition-colors">Home</a>
            <a href="#services" className="hover:text-[#C8522A] transition-colors">Services</a>
            <a href="#projects" className="hover:text-[#C8522A] transition-colors">Projects</a>
            
            {/* Direct, clean path transition link out to your new blog engine directory page route */}
            <Link href="/blog" className="hover:text-[#C8522A] transition-colors">
              Blog
            </Link>

            {/* Secure Admin Workspace Console Dashboard Portal Gateway Trigger Link */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 hover:text-[#C8522A] opacity-60 hover:opacity-100 transition-all text-[11px]"
              title="Console Admin Dashboard Workspace Terminal Gateway"
            >
              <LucideLock size={12} />
              <span>Console</span>
            </Link>
          </div>
          
          <a href="mailto:j2willy03@gmail.com" className="hidden md:inline-flex items-center justify-center px-4 py-2 border border-[#1A1A1A] bg-[#1A1A1A] text-[#F5F0E8] rounded hover:bg-transparent hover:text-[#1A1A1A] transition-all duration-300 text-xs font-medium">
            Let's Talk <span className="ml-1">→</span>
          </a>

          <button className="md:hidden flex flex-col gap-1.5 p-1" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-[#1A1A1A] transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>

        {/* Mobile View Navigation Toggle Block Drawer Layout */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#E8E0D0] mt-4 rounded-lg border border-[#D8D0C2]">
            <div className="flex flex-col p-6 gap-5 text-xs font-mono uppercase tracking-wider">
              <a href="#home" onClick={() => setMobileMenuOpen(false)}>Home</a>
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#projects" onClick={() => setMobileMenuOpen(false)}>Projects</a>
              <Link href="/blog" onClick={() => setMobileMenuOpen(false)}>Blog Directory</Link>
              <Link href="/dashboard" className="flex items-center gap-1 text-[#C8522A]" onClick={() => setMobileMenuOpen(false)}>
                <LucideLock size={12} /> Dashboard Console
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ======================== CANVAS HERO SECTION ======================== */}
      <section id="home" className="min-h-[85vh] flex items-center py-16 px-6 md:px-12 relative overflow-hidden">
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="px-3 py-1 text-xs font-mono tracking-wider border border-[#C8522A]/30 text-[#C8522A] bg-[#C8522A]/5 rounded-full inline-block">Web Developer & Engineer</span>
            <div className="space-y-2">
              <p className="text-base text-[#7A8C7E] font-light tracking-wide">Hello, I am</p>
              <h1 className="font-['Syne',sans-serif] font-extrabold leading-none tracking-tight text-5xl md:text-7xl text-[#1A1A1A]">
                Joshua<br/>
                <span className="text-transparent" style={{ WebkitTextStroke: '1px #1A1A1A' }}>Williams</span>
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-gray-600 max-w-md font-light">
              I build production-quality web applications combining minimalist design frameworks with high-performance automated software architectures.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#projects" className="px-5 py-3 bg-[#1A1A1A] text-[#F5F0E8] text-xs font-mono uppercase tracking-wider rounded hover:bg-transparent hover:text-[#1A1A1A] border border-[#1A1A1A] transition-all">View Blueprints ↓</a>
              <Link href="/blog" className="px-5 py-3 border border-gray-400 text-xs font-mono uppercase tracking-wider rounded hover:border-[#1A1A1A] transition-all">Read Logs</Link>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="w-72 h-80 md:w-80 md:h-96 rounded-2xl overflow-hidden border border-[#E8E0D0] bg-gradient-to-br from-[#E8E0D0] to-[#D8D0C2] flex flex-col items-center justify-center p-6 shadow-xl">
                <div className="w-24 h-24 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4 shadow-md">
                  <span className="font-['Syne',sans-serif] font-extrabold text-3xl text-[#F5F0E8]">JW</span>
                </div>
                <span className="font-['Syne',sans-serif] font-semibold text-lg text-[#1A1A1A]">Joshua Williams</span>
                <span className="text-xs text-[#7A8C7E] tracking-widest uppercase mt-1 font-mono">Full-Stack Dev</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SERVICES PLATFORM ======================== */}
      <section id="services" className="py-24 px-6 md:px-12 border-t border-[#E8E0D0]/60">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-mono tracking-widest text-[#C8522A] uppercase block mb-2">Core Solutions</span>
              <h2 className="font-['Syne',sans-serif] font-extrabold text-3xl md:text-4xl text-[#1A1A1A]">
                Services I <span className="text-transparent" style={{ WebkitTextStroke: '1px #1A1A1A' }}>Provide</span>
              </h2>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#E8E0D0]/20 border border-[#E8E0D0] rounded-xl p-6 space-y-3">
              <h3 className="font-['Syne',sans-serif] font-bold text-base">Full-Stack Engineering</h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">Blazing-fast interactive user interfaces built with React, Next.js 15, and typed structures.</p>
            </div>
            <div className="bg-[#E8E0D0]/20 border border-[#E8E0D0] rounded-xl p-6 space-y-3">
              <h3 className="font-['Syne',sans-serif] font-bold text-base">Headless CMS Platforms</h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">Tailored integrations using modular custom Rich Text systems bound with real-time firestore layers.</p>
            </div>
            <div className="bg-[#E8E0D0]/20 border border-[#E8E0D0] rounded-xl p-6 space-y-3">
              <h3 className="font-['Syne',sans-serif] font-bold text-base">Logic Automation</h3>
              <p className="text-xs text-gray-600 font-light leading-relaxed">Scripting background operational tasks, script automation hooks, and custom API tracking controllers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== SHORT PREVIEW LOGS SUB-SECTION ======================== */}
      {latestPosts.length > 0 && (
        <section className="py-20 px-6 md:px-12 bg-[#EDE8DF] border-y border-[#E8E0D0]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between border-b border-[#D8D0C2] pb-4">
              <h3 className="font-['Syne',sans-serif] font-bold text-lg text-[#1A1A1A]">Recent Writing Logs</h3>
              <Link href="/blog" className="text-xs font-mono uppercase tracking-wider text-[#C8522A] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors">
                <span>All Logs</span> <LucideArrowRight size={12} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {latestPosts.map(post => (
                <div key={post.id} className="bg-[#F5F0E8] border border-[#E8E0D0] rounded-xl p-6 space-y-3 group hover:border-[#C8522A]/40 transition-all duration-300">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <span>•</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h4 className="font-['Syne',sans-serif] font-bold text-base text-[#1A1A1A] group-hover:text-[#C8522A] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h4>
                  <p className="text-xs text-gray-600 font-light line-clamp-2">{post.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ======================== FOOTER SECTION ======================== */}
      <footer className="py-16 px-6 md:px-12 text-center max-w-4xl mx-auto space-y-4">
        <h2 className="font-['Syne',sans-serif] font-extrabold text-2xl md:text-3xl text-[#1A1A1A]">Let's build web platforms.</h2>
        <p className="text-xs text-gray-500 font-mono">DESIGNED & ENGINERED BY JOSHUA WILLIAMS © 2026</p>
      </footer>

    </div>
  );
}
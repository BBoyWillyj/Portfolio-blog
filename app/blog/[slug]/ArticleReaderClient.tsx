'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchPostBySlugFromFirestore } from '@/services/firebase/posts';
import { BlogPost } from '@/types';
import { LucideArrowLeft, LucideCalendar, LucideClock } from 'lucide-react';
import Link from 'next/link';

export default function ArticleReaderPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const loadFullArticle = async () => {
      try {
        const postData = await fetchPostBySlugFromFirestore(slug as string);
        if (!postData) {
          // If the page doesn't exist, bounce the reader back to the index grid
          router.push('/');
          return;
        }
        setPost(postData);
      } catch (error) {
        console.error('Critical reading viewport initialization fault:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFullArticle();
  }, [slug, router]);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-background flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Parsing Matrix Blocks...</span>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-brand-background text-zinc-100 selection:bg-brand-accent/30 selection:text-white">
      <main className="max-w-3xl mx-auto px-6 py-20 space-y-10">
        
        {/* Back Navigation Command Trigger */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 hover:text-zinc-300 transition-colors group"
        >
          <LucideArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Feed</span>
        </Link>

        {/* Article Meta Header Cluster */}
        <header className="space-y-4 border-b border-zinc-800 pb-8">
          <h1 className="text-2xl md:text-4xl font-semibold font-sans text-zinc-100 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 pt-2">
            <span className="flex items-center gap-1.5">
              <LucideCalendar size={13} className="text-zinc-600" />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <LucideClock size={13} className="text-zinc-600" />
              {post.readingTime}
            </span>
          </div>
        </header>

        {/* Dynamic HTML Inject Canvas Viewport Container */}
        {/* Tailwind v4 Typography 'prose' flags structure semantic rendering output smoothly */}
        <article 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="prose prose-invert max-w-none text-zinc-300 font-sans text-sm md:text-base leading-relaxed prose-headings:text-zinc-100 prose-headings:font-medium prose-headings:tracking-tight prose-p:mb-5 prose-blockquote:border-l-brand-accent prose-blockquote:bg-zinc-950/40 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-a:text-brand-accent prose-code:text-brand-accent prose-code:font-mono prose-code:bg-zinc-900/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        />

      </main>
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchPostBySlugFromFirestore } from '@/services/firebase/posts';
import { BlogPost } from '@/types';
import { LucideArrowLeft, LucideCalendar, LucideClock } from 'lucide-react';
import Link from 'next/link';

interface BlogReaderContentProps {
  slug: string;
}

export default function BlogReaderContent({ slug }: BlogReaderContentProps) {
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFullArticle = async () => {
      try {
        const postData = await fetchPostBySlugFromFirestore(slug);
        if (!postData) {
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
      <div className="min-h-screen bg-[#F5F0E8] flex flex-col items-center justify-center gap-2">
        <div className="w-6 h-6 border-2 border-[#C8522A]/20 border-t-[#C8522A] rounded-full animate-spin" />
        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Parsing Matrix Blocks...</span>
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1A1A] font-['DM_Sans',sans-serif] selection:bg-[#C8522A]/20 selection:text-[#C8522A]">
      <main className="max-w-3xl mx-auto px-6 py-20 space-y-10">
        
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-[#1A1A1A] transition-colors group"
        >
          <LucideArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Return to Feed</span>
        </Link>

        <header className="space-y-4 border-b border-[#E8E0D0] pb-8">
          <h1 className="font-['Syne',sans-serif] font-extrabold text-2xl md:text-4xl text-[#1A1A1A] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-gray-500 pt-2">
            <span className="flex items-center gap-1.5">
              <LucideCalendar size={13} />
              {formatDate(post.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <LucideClock size={13} />
              {post.readingTime}
            </span>
          </div>
        </header>

        <article 
          dangerouslySetInnerHTML={{ __html: post.content }} 
          className="prose max-w-none text-gray-800 font-sans text-sm md:text-base leading-relaxed prose-headings:font-['Syne',sans-serif] prose-headings:text-[#1A1A1A] prose-headings:font-bold prose-headings:tracking-tight prose-p:mb-5 prose-blockquote:border-l-[#C8522A] prose-blockquote:bg-[#E8E0D0]/20 prose-blockquote:p-4 prose-blockquote:rounded-r-xl prose-a:text-[#C8522A] prose-code:text-[#C8522A] prose-code:font-mono prose-code:bg-[#E8E0D0]/40 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
        />

      </main>
    </div>
  );
}
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllPostsFromFirestore } from '@/services/firebase/posts';
import { BlogPost } from '@/types';
import { LucideArrowLeft, LucideCalendar, LucideClock, LucideArrowRight } from 'lucide-react';

export default function PublicBlogFeedPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getPublishedContent = async () => {
      try {
        const data = await fetchAllPostsFromFirestore(false);
        setPosts(data);
      } catch (error) {
        console.error('Error loading public blog feed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getPublishedContent();
  }, []);

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1A1A] font-['DM_Sans',sans-serif] px-6 py-20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gray-500 hover:text-[#1A1A1A] transition-colors group">
          <LucideArrowLeft size={14} className="transform group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Portfolio</span>
        </Link>

        <header className="space-y-4 border-b border-[#E8E0D0] pb-8">
          <h1 className="font-['Syne',sans-serif] font-extrabold text-4xl tracking-tight text-[#1A1A1A]">
            Engineering Logs & blueprints
          </h1>
          <p className="text-sm text-gray-600 max-w-xl font-light leading-relaxed">
            A structured directory of digital assets, production system architectures, and framework design logs.
          </p>
        </header>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-[#E8E0D0]/30 rounded-xl animate-pulse border border-[#E8E0D0]" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="border border-dashed border-gray-400 rounded-xl p-12 text-center">
            <p className="text-sm text-gray-500 font-mono">No published log specifications available yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <article key={post.id} className="bg-[#E8E0D0]/20 border border-[#E8E0D0] hover:border-[#C8522A]/40 rounded-xl p-6 transition-all duration-300 group flex flex-col justify-between gap-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-[11px] font-mono text-gray-500">
                    <span className="flex items-center gap-1"><LucideCalendar size={12} />{formatDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1"><LucideClock size={12} />{post.readingTime}</span>
                  </div>
                  <h2 className="font-['Syne',sans-serif] font-bold text-lg text-[#1A1A1A] group-hover:text-[#C8522A] transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h2>
                  <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>
                <div>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-1 text-xs font-medium text-[#C8522A] group-hover:text-[#1A1A1A] transition-colors">
                    <span>Inspect Blueprint</span>
                    <LucideArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
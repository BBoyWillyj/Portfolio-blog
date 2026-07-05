'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchAllPostsFromFirestore } from '@/services/firebase/posts';
import { BlogPost } from '@/types';
import { LucidePlus, LucideFileEdit, LucideCalendar, LucideEye } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PostsManagementPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadWorkspaceCatalog = async () => {
      try {
        // Fetch every article document, including internal rough drafts
        const catalogData = await fetchAllPostsFromFirestore(true);
        setPosts(catalogData);
      } catch (error: any) {
        console.error('Failed to populate master layout stream:', error);
        toast.error('Error synchronizing database content directory maps.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorkspaceCatalog();
  }, []);

  // Format date strings neatly for human administrative review
  const formatDateString = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Catalog Header Navigation Bar Row */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-medium text-zinc-100 font-sans tracking-tight">
            Article Inventory Index
          </h1>
          <p className="text-xs text-brand-muted font-sans mt-0.5">
            Audit, inspect, and organize your structural system content blueprints.
          </p>
        </div>

        <Link
          href="/dashboard/posts/create"
          className="px-4 py-2 bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm font-sans"
        >
          <LucidePlus size={14} />
          <span>Forge New Article</span>
        </Link>
      </div>

      {/* Conditional State Layout Viewport Branching */}
      {isLoading ? (
        <div className="min-h-[200px] flex flex-col items-center justify-center gap-2">
          <div className="w-5 h-5 border-2 border-brand-accent/20 border-t-brand-accent rounded-full animate-spin" />
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Hydrating Catalog...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="border border-dashed border-zinc-800 rounded-xl p-12 text-center space-y-3 bg-zinc-950/10">
          <p className="text-sm text-zinc-400 font-sans">No content records located inside your database cloud tree.</p>
          <p className="text-xs text-brand-muted font-sans max-w-sm mx-auto">
            Click the "Forge New Article" action trigger above to commit your initial document matrix.
          </p>
        </div>
      ) : (
        /* Inventory System Asset Grid Framework */
        <div className="border border-zinc-800 rounded-xl bg-zinc-950/20 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/40 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
                  <th className="py-3 px-5">Composition Title</th>
                  <th className="py-3 px-4">Status Token</th>
                  <th className="py-3 px-4">Timeline Index</th>
                  <th className="py-3 px-4">Metrics</th>
                  <th className="py-3 px-4 text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-sm font-sans text-zinc-300">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-zinc-900/20 transition-colors">
                    {/* Title Cell */}
                    <td className="py-4 px-5 font-medium text-zinc-200 max-w-xs truncate">
                      {post.title}
                    </td>
                    
                    {/* Status Badge Cell */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wide uppercase font-mono ${
                        post.status === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        <span className={`w-1 h-1 rounded-full ${post.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                        {post.status}
                      </span>
                    </td>

                    {/* Timeline Date Cell */}
                    <td className="py-4 px-4 text-xs text-zinc-400 font-mono flex items-center gap-2 mt-2 border-none">
                      <LucideCalendar size={12} className="text-zinc-600" />
                      <span>{formatDateString(post.createdAt)}</span>
                    </td>

                    {/* Metrics Cell */}
                    <td className="py-4 px-4 text-xs font-mono text-zinc-500">
                      <span className="flex items-center gap-1.5">
                        <LucideEye size={12} />
                        <span>{post.views} Views</span>
                      </span>
                    </td>

                    {/* Operations Trigger Actions Cell */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {/* Edit and Delete operations will latch to these handles next */}
                        <button 
                          onClick={() => toast('Modification portal system pipeline loading...')}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all cursor-pointer"
                          title="Edit Blueprint"
                        >
                          <LucideFileEdit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
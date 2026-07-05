'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import TipTapEditor from '@/components/editor/TipTapEditor';
import { createPostInFirestore } from '@/services/firebase/posts';
import { LucideSave, LucideLoader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('draft');
  const [isSaving, setIsSaving] = useState(false);

  // Helper routine to generate clean, SEO-optimized URL path fragments
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace spaces and special symbols with thin hyphens
      .replace(/(^-|-$)+/g, '');    // Trim hanging hyphens from the edges
  };

  // Helper routine estimating general human reader processing speed parameters
  const calculateReadingTime = (textString: string): string => {
    const wordCount = textString.replace(/<[^>]*>/g, '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.ceil(wordCount / 200); // Standard average human metric: 200 words per minute
    return `${minutes} min read`;
  };

  const handlePublishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('An article title identifier is required.');
      return;
    }
    if (!content.trim() || content === '<p></p>') {
      toast.error('Cannot commit an empty body composition database record.');
      return;
    }

    setIsSaving(true);
    try {
      const generatedSlugStr = generateSlug(title);
      const estReadingTime = calculateReadingTime(content);

      const postPayload = {
        title: title.trim(),
        slug: generatedSlugStr,
        excerpt: excerpt.trim() || `${title.trim()}...`,
        content: content,
        coverImage: '', // Storage asset pipeline bypassed per operational directives
        status: status,
        views: 0,
        readingTime: estReadingTime,
        categoryId: 'general-engineering', // Default placeholder category assignment mapping
        tags: ['webdev', 'architecture'],   // Default placeholder tags grouping setup arrays
      };

      // Dispatch the payload package via the Firestore CRUD controller pipeline
      const targetDocumentId = await createPostInFirestore(postPayload);
      
      toast.success(`Composition committed securely! ID: ${targetDocumentId}`);
      
      // Route the admin back to the master dashboard workspace console grid layout
      router.push('/dashboard/posts');
    } catch (error: any) {
      console.error('Data write sequence encountered an abort fault:', error);
      toast.error(error.message || 'Database link execution write failure.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Master Action Core Header Component Row Layout */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h1 className="text-xl font-medium text-zinc-100 font-sans tracking-tight">
            Forge New Article
          </h1>
          <p className="text-xs text-brand-muted font-sans mt-0.5">
            Construct production-ready blog records synced instantly with cloud collections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Select Toggle */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as any)}
            className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-brand-accent transition-colors cursor-pointer font-sans"
          >
            <option value="draft">Save As Draft</option>
            <option value="published">Publish Active</option>
          </select>

          <button
            onClick={handlePublishSubmit}
            disabled={isSaving}
            className="px-4 py-2 bg-zinc-100 hover:bg-white disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-500 font-medium text-xs rounded-lg transition-all duration-200 flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            {isSaving ? (
              <LucideLoader2 size={14} className="animate-spin" />
            ) : (
              <LucideSave size={14} />
            )}
            <span>Commit Architecture</span>
          </button>
        </div>
      </div>

      {/* Editor Content Entry Field Canvas Workspace */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 font-sans">Article Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a descriptive title..."
            disabled={isSaving}
            className="w-full px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-accent transition-all duration-200 disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 font-sans">Excerpt / Preview</label>
          <textarea
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A short summary for the index feed cards..."
            rows={2}
            disabled={isSaving}
            className="w-full px-4 py-2.5 bg-zinc-900/40 border border-zinc-800 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-accent transition-all duration-200 resize-none disabled:opacity-50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-400 font-sans">Body Architecture</label>
          <TipTapEditor 
            content={content} 
            onChange={(htmlString) => setContent(htmlString)} 
            placeholder="Begin drafting your medium-style post engineering notes..."
          />
        </div>
      </form>
      
    </div>
  );
}
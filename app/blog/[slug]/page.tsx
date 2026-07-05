import React from 'react';
import { fetchAllPostsFromFirestore } from '@/services/firebase/posts';
import BlogReaderContent from './BlogReaderContent';

export const dynamicParams = false;

/**
 * Compiles a static map array of all available Firestore slugs at build time.
 */
export async function generateStaticParams() {
  try {
    const posts = await fetchAllPostsFromFirestore(false);
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Failed to generate static parameters for build export:", error);
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Server Component execution root that intercepts parameters and hands them to the viewport canvas.
 */
export default async function DynamicArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  
  return <BlogReaderContent slug={resolvedParams.slug} />;
}
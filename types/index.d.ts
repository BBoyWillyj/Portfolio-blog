// Core Application Shared Types

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export type PostStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: PostStatus;
  views: number;
  readingTime: string;
  categoryId: string;
  tags: string[];
  createdAt: string; // ISO String format for clean serializing across RSCs
  updatedAt: string;
}
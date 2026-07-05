import { db } from './config';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { BlogPost } from '@/types';

const POSTS_COLLECTION = 'posts';

/**
 * Standardizes raw Firestore document schemas into clean, serialized application interfaces.
 */
const serializePost = (docId: string, data: any): BlogPost => {
  return {
    id: docId,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    coverImage: data.coverImage || '',
    status: data.status || 'draft',
    views: data.views || 0,
    readingTime: data.readingTime || '1 min read',
    categoryId: data.categoryId || '',
    tags: data.tags || [],
    // Safely parse Firestore server timestamps into standard ISO strings for RSC serialization
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
  };
};

/**
 * Commits a brand new blog article document securely to Cloud Firestore.
 */
export const createPostInFirestore = async (postData: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    
    const docPayload = {
      ...postData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docReference = await addDoc(postsCollectionRef, docPayload);
    return docReference.id;
  } catch (error: any) {
    console.error('Firestore create action encountered a structural failure:', error);
    throw new Error(`Database transaction aborted: ${error.message}`);
  }
};

/**
 * Fetches every single post record from the collection, ordered by compilation date.
 */
export const fetchAllPostsFromFirestore = async (includeDrafts = false): Promise<BlogPost[]> => {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    let firestoreQuery = query(postsCollectionRef, orderBy('createdAt', 'desc'));

    // If reading from public feeds, restrict results to published compositions only
    if (!includeDrafts) {
      firestoreQuery = query(postsCollectionRef, where('status', '==', 'published'), orderBy('createdAt', 'desc'));
    }

    const querySnapshot = await getDocs(firestoreQuery);
    return querySnapshot.docs.map(doc => serializePost(doc.id, doc.data()));
  } catch (error: any) {
    console.error('Firestore query array fetch operation failure:', error);
    throw new Error(`Failed to retrieve records: ${error.message}`);
  }
};

/**
 * Updates an explicit, existing document within our data directory.
 */
export const updatePostInFirestore = async (postId: string, updatedData: Partial<BlogPost>): Promise<void> => {
  try {
    const postDocumentRef = doc(db, POSTS_COLLECTION, postId);
    
    const docPayload = {
      ...updatedData,
      updatedAt: serverTimestamp(),
    };

    // Strip out immutable identification attributes to maintain indexing data hygiene
    delete (docPayload as any).id;
    delete (docPayload as any).createdAt;

    await updateDoc(postDocumentRef, docPayload);
  } catch (error: any) {
    console.error('Firestore document modification exception caught:', error);
    throw new Error(`Failed to update post record: ${error.message}`);
  }
};

/**
 * Completely purges an individual entry permanently out of the database repository.
 */
export const deletePostFromFirestore = async (postId: string): Promise<void> => {
  try {
    const postDocumentRef = doc(db, POSTS_COLLECTION, postId);
    await deleteDoc(postDocumentRef);
  } catch (error: any) {
    console.error('Firestore hard purge data deletion failure:', error);
    throw new Error(`Purge target rejected: ${error.message}`);
  }
};

/**
 * Resolves an individual blog document matching a specific URL slug string.
 */
export const fetchPostBySlugFromFirestore = async (slug: string): Promise<BlogPost | null> => {
  try {
    const postsCollectionRef = collection(db, POSTS_COLLECTION);
    const slugQuery = query(postsCollectionRef, where('slug', '==', slug));
    const querySnapshot = await getDocs(slugQuery);
    
    if (querySnapshot.empty) return null;
    
    // Snag the first matching document snapshot record
    const targetDoc = querySnapshot.docs[0];
    return serializePost(targetDoc.id, targetDoc.data());
  } catch (error: any) {
    console.error('Error fetching individual post document by slug:', error);
    throw new Error(`Failed to isolate database record: ${error.message}`);
  }
};
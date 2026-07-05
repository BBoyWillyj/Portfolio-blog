// import { storage } from './config';
// import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// interface UploadProgressOptions {
//   folder: 'covers' | 'inline-images';
//   allowedTypes?: string[];
//   maxSizeInMB?: number;
// }

// /**
//  * Handles security checking and binary transmission of files to Firebase Storage.
//  * @param file Raw browser File object from form input structures
//  * @param options Configuration settings determining the path boundary and validation parameters
//  * @returns Secure public download URL string from the storage repository
//  */
// export const uploadMediaAsset = async (
//   file: File,
//   options: UploadProgressOptions
// ): Promise<string> => {
//   const { 
//     folder, 
//     allowedTypes = ['image/jpeg', 'image/png', 'image/webp'], 
//     maxSizeInMB = 5 
//   } = options;

//   // 1. Structural File Validation Layer
//   if (!allowedTypes.includes(file.type)) {
//     throw new Error(`Security validation failure: Unsupported format type (${file.type})`);
//   }

//   const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
//   if (file.size > maxSizeInBytes) {
//     throw new Error(`File size threshold exceeded: Maximum allowance limit is ${maxSizeInMB}MB`);
//   }

//   // 2. Hash and Identity Key Generation
//   const fileExtension = file.name.split('.').pop();
//   const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
//   const secureFileName = `${uniqueId}.${fileExtension}`;
  
//   // Assemble isolated resource tree path mapping matching the project constitution
//   const storageFilePath = `blog/${folder}/${secureFileName}`;
  
//   // 3. Establish storage bucket pipeline references
//   const storageReference = ref(storage, storageFilePath);

//   try {
//     // Execute raw binary array transmission loop to the bucket
//     const uploadSnapshot = await uploadBytes(storageReference, file);
    
//     // Extract the final production-ready secure download link token identifier
//     const downloadUrl = await getDownloadURL(uploadSnapshot.ref);
//     return downloadUrl;
//   } catch (error: any) {
//     console.error('Firebase Storage interaction sequence encountered a structural fault:', error);
//     throw new Error(`Media pipeline transaction aborted: ${error.message || 'Unknown network error'}`);
//   }
// };
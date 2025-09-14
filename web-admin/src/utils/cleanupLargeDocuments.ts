// web-admin/src/utils/cleanupLargeDocuments.ts
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { auth } from '@/lib/firebase';

export const cleanupLargeDocuments = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User must be authenticated');
    }

    console.log('🧹 Starting cleanup of large documents...');

    // Get all projects for current user
    const q = query(
      collection(db, 'projects'),
      where('userId', '==', user.uid)
    );
    
    const querySnapshot = await getDocs(q);
    let cleanedCount = 0;
    let deletedCount = 0;

    for (const docSnap of querySnapshot.docs) {
      const data = docSnap.data();
      const docId = docSnap.id;
      
      // Check if document has large images (base64 previews)
      if (data.images && Array.isArray(data.images)) {
        let hasLargeImages = false;
        const cleanedImages = data.images.map((image: any) => {
          if (image.preview && image.preview.length > 100000) { // > 100KB base64
            hasLargeImages = true;
            // Compress the large preview to reduce size
            const compressedPreview = image.preview.length > 200000 
              ? image.preview.substring(0, 50000) + '...' // Truncate very large images
              : image.preview.substring(0, 100000) + '...'; // Truncate moderately large images
            
            return {
              id: image.id,
              label: image.label,
              fileName: image.fileName,
              preview: compressedPreview // Keep compressed preview
            };
          }
          return image;
        });

        if (hasLargeImages) {
          try {
            // Try to update with cleaned images
            await updateDoc(doc(db, 'projects', docId), {
              images: cleanedImages
            });
            console.log('✅ Cleaned document:', docId);
            cleanedCount++;
          } catch (updateError) {
            console.error('❌ Failed to update document, attempting deletion:', docId);
            
            // If update still fails (still too large), delete the document
            try {
              await deleteDoc(doc(db, 'projects', docId));
              console.log('🗑️ Deleted large document:', docId);
              deletedCount++;
            } catch (deleteError) {
              console.error('❌ Failed to delete document:', docId, deleteError);
            }
          }
        }
      }
    }

    console.log(`✅ Cleanup completed: ${cleanedCount} cleaned, ${deletedCount} deleted`);
    return { cleanedCount, deletedCount };

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
};

// Function to check document size estimate
export const estimateDocumentSize = (data: any): number => {
  const jsonString = JSON.stringify(data);
  return new Blob([jsonString]).size;
};

// Function to compress images in memory before saving
export const compressImageData = (imageData: string, quality: number = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Reduce dimensions if image is too large
      const maxWidth = 800;
      const maxHeight = 600;
      
      let { width, height } = img;
      
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      ctx?.drawImage(img, 0, 0, width, height);
      
      // Convert to compressed base64
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      resolve(compressedDataUrl);
    };
    
    img.src = imageData;
  });
};

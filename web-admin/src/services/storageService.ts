// web-admin/src/services/storageService.ts
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth } from '@/lib/firebase';

export interface UploadImageResult {
  fileName: string;
  downloadURL: string;
  storagePath: string;
}

export const storageService = {
  // Upload image to Firebase Storage
  async uploadImage(file: File, projectId: string): Promise<UploadImageResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to upload images');
      }

      // Create unique filename
      const timestamp = Date.now();
      const fileName = `${timestamp}_${file.name}`;
      const storagePath = `projects/${user.uid}/${projectId}/${fileName}`;
      
      console.log('📤 Uploading image to Storage:', storagePath);

      // Create storage reference
      const storageRef = ref(storage, storagePath);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Image uploaded successfully:', downloadURL);

      return {
        fileName,
        downloadURL,
        storagePath
      };
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  },

  // Upload image from base64 (for existing preview data)
  async uploadImageFromBase64(base64Data: string, fileName: string, projectId: string): Promise<UploadImageResult> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to upload images');
      }

      // Convert base64 to blob
      const response = await fetch(base64Data);
      const blob = await response.blob();
      
      // Create unique filename
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}_${fileName}`;
      const storagePath = `projects/${user.uid}/${projectId}/${uniqueFileName}`;
      
      console.log('📤 Uploading base64 image to Storage:', storagePath);

      // Create storage reference
      const storageRef = ref(storage, storagePath);
      
      // Upload blob
      const snapshot = await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      console.log('✅ Base64 image uploaded successfully:', downloadURL);

      return {
        fileName: uniqueFileName,
        downloadURL,
        storagePath
      };
    } catch (error) {
      console.error('❌ Error uploading base64 image:', error);
      throw error;
    }
  },

  // Delete image from Firebase Storage
  async deleteImage(storagePath: string): Promise<boolean> {
    try {
      console.log('🗑️ Deleting image from Storage:', storagePath);
      
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      
      console.log('✅ Image deleted successfully');
      return true;
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      return false;
    }
  },

  // Delete all images for a project
  async deleteProjectImages(projectId: string): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      // Note: Firebase Storage doesn't have a direct way to delete folders
      // You would need to list all files and delete them individually
      // For now, we'll handle individual image deletion when updating projects
      console.log('🗑️ Project images cleanup for:', projectId);
    } catch (error) {
      console.error('❌ Error deleting project images:', error);
    }
  }
};

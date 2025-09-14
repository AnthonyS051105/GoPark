// web-admin/src/services/projectService.ts
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { auth } from '@/lib/firebase';

export interface ProjectData {
  id: string;
  name: string;
  address: string;
  images: ImageData[];
  userId: string; // Add user ID to track ownership
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageData {
  id: string;
  label: string;
  preview: string; // Base64 data - compressed
  fileName: string;
}

// Convert Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp?.seconds) {
    return new Date(timestamp.seconds * 1000);
  }
  return new Date();
};

export const projectService = {
  // Save a new project
  async saveProject(data: { name: string; address: string; images: ImageData[] }): Promise<ProjectData> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated to save projects');
      }

      console.log('💾 Saving project to Firestore for user:', user.uid);
      
      // Compress images before saving to avoid document size limits
      const compressedImages: ImageData[] = [];
      for (const image of data.images) {
        try {
          // Compress image if it's too large
          let compressedPreview = image.preview;
          if (image.preview.length > 400000) { // If > 400KB (increased threshold)
            console.log('🔄 Compressing large image:', image.fileName);
            compressedPreview = await this.compressImage(image.preview, 0.6); // Medium compression
          } else if (image.preview.length > 250000) { // If > 250KB
            compressedPreview = await this.compressImage(image.preview, 0.8); // Light compression
          }
          
          compressedImages.push({
            id: image.id,
            label: image.label,
            preview: compressedPreview,
            fileName: image.fileName
          });
        } catch (compressionError) {
          console.error('❌ Error compressing image, using original:', compressionError);
          // Use original if compression fails, but truncate if too large
          const truncatedPreview = image.preview.length > 150000 
            ? image.preview.substring(0, 150000) + '...' 
            : image.preview;
          
          compressedImages.push({
            id: image.id,
            label: image.label,
            preview: truncatedPreview,
            fileName: image.fileName
          });
        }
      }

      const projectData = {
        name: data.name,
        address: data.address,
        images: compressedImages,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'projects'), projectData);
      console.log('✅ Project saved with ID:', docRef.id);

      const project: ProjectData = {
        id: docRef.id,
        name: data.name,
        address: data.address,
        images: compressedImages,
        userId: user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return project;
    } catch (error) {
      console.error('❌ Error saving project:', error);
      throw error;
    }
  },

  // Compress image helper function
  async compressImage(base64String: string, quality: number = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (better resolution)
        const maxWidth = quality > 0.5 ? 1200 : 800;  // Increased from 800/400
        const maxHeight = quality > 0.5 ? 900 : 600;   // Increased from 600/300
        
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
      
      img.onerror = () => {
        // Return original if compression fails
        resolve(base64String);
      };
      
      img.src = base64String;
    });
  },

  // Get all projects for current user
  async getProjects(): Promise<ProjectData[]> {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('⚠️ No authenticated user, returning empty projects');
        return [];
      }

      console.log('📥 Getting projects from Firestore for user:', user.uid);
      
      const q = query(
        collection(db, 'projects'),
        where('userId', '==', user.uid)
        // Temporarily removed orderBy to avoid index requirement
        // orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const projects: ProjectData[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        projects.push({
          id: doc.id,
          name: data.name,
          address: data.address,
          images: data.images || [],
          userId: data.userId,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        });
      });

      // Sort manually by createdAt descending
      projects.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      console.log('📤 Retrieved projects from Firestore:', projects.length);
      return projects;
    } catch (error) {
      console.error('❌ Error getting projects:', error);
      return [];
    }
  },

  // Get a project by ID
  async getProjectById(id: string): Promise<ProjectData | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      console.log('📥 Getting project by ID:', id);
      
      const docRef = doc(db, 'projects', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        // Check if project belongs to current user
        if (data.userId !== user.uid) {
          console.log('⚠️ Project does not belong to current user');
          return null;
        }

        return {
          id: docSnap.id,
          name: data.name,
          address: data.address,
          images: data.images || [],
          userId: data.userId,
          createdAt: convertTimestamp(data.createdAt),
          updatedAt: convertTimestamp(data.updatedAt)
        };
      } else {
        console.log('⚠️ No project found with ID:', id);
        return null;
      }
    } catch (error) {
      console.error('❌ Error getting project by ID:', error);
      return null;
    }
  },

  // Update a project
  async updateProject(id: string, data: Partial<ProjectData>): Promise<ProjectData | null> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      console.log('🔄 Updating project:', id);

      // First verify project belongs to user
      const project = await this.getProjectById(id);
      if (!project) {
        return null;
      }

      const docRef = doc(db, 'projects', id);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };

      await updateDoc(docRef, updateData);
      console.log('✅ Project updated successfully');

      // Return updated project
      return await this.getProjectById(id);
    } catch (error) {
      console.error('❌ Error updating project:', error);
      return null;
    }
  },

  // Delete a project
  async deleteProject(id: string): Promise<boolean> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User must be authenticated');
      }

      console.log('🗑️ Deleting project:', id);

      // First verify project belongs to user
      const project = await this.getProjectById(id);
      if (!project) {
        return false;
      }

      const docRef = doc(db, 'projects', id);
      await deleteDoc(docRef);
      console.log('✅ Project deleted successfully');

      return true;
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      return false;
    }
  }
};

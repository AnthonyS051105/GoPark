"use client";
import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export type ImageData = {
  id: string;
  file: File;
  label: string;
  preview: string;
};

export type SavedImageData = {
  id: string;
  label: string;
  preview: string; // Base64 image data (compressed)
  fileName: string;
};

export type ProjectData = {
  id?: string;
  name: string;
  address: string;
  images: ImageData[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type SavedProject = {
  id: string;
  name: string;
  address: string;
  images: SavedImageData[];
  createdAt: Date;
  updatedAt: Date;
};

type ModalContextType = {
  isOpen: boolean;
  isImageModalOpen: boolean;
  projectData: ProjectData;
  savedProjects: SavedProject[];
  openModal: () => void;
  closeModal: () => void;
  openImageModal: () => void;
  closeImageModal: () => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  addImage: (image: ImageData) => void;
  removeImage: (imageId: string) => void;
  updateImageLabel: (imageId: string, label: string) => void;
  addSavedProject: (project: SavedProject) => void;
  loadSavedProjects: () => Promise<void>;
  clearSavedProjects: () => void;
  deleteSavedProject: (projectId: string) => Promise<boolean>;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside ModalProvider");
  return ctx;
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    address: '',
    images: []
  });
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);

  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Reset project data when main modal closes
    setProjectData({ name: '', address: '', images: [] });
  }, []);

  const openImageModal = useCallback(() => setIsImageModalOpen(true), []);
  const closeImageModal = useCallback(() => setIsImageModalOpen(false), []);

  const updateProjectData = useCallback((data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }));
  }, []);

  const addImage = useCallback((image: ImageData) => {
    setProjectData(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
  }, []);

  const removeImage = useCallback((imageId: string) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  }, []);

  const updateImageLabel = useCallback((imageId: string, label: string) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, label } : img
      )
    }));
  }, []);

  const addSavedProject = useCallback((project: SavedProject) => {
    setSavedProjects(prev => [project, ...prev]);
  }, []);

  const loadSavedProjects = useCallback(async () => {
    try {
      console.log('🔄 Loading saved projects...');
      // Import here to avoid circular dependencies
      const { projectService } = await import('../../services/projectService');
      const projects = await projectService.getProjects();
      console.log('📊 Projects fetched from Firestore:', projects.length);
      
      // Convert service ProjectData to SavedProject format
      const convertedProjects: SavedProject[] = projects.map(project => ({
        id: project.id,
        name: project.name,
        address: project.address,
        images: project.images, // Already in SavedImageData format
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));
      
      console.log('✅ Setting saved projects from Firestore:', convertedProjects.length);
      setSavedProjects(convertedProjects);
    } catch (error) {
      console.error('❌ Failed to load saved projects from Firestore:', error);
      setSavedProjects([]); // Clear projects on error
    }
  }, []);

  const clearSavedProjects = useCallback(() => {
    console.log('🧹 Clearing saved projects');
    setSavedProjects([]);
  }, []);

  const deleteSavedProject = useCallback(async (projectId: string): Promise<boolean> => {
    try {
      console.log('🗑️ Deleting project:', projectId);
      // Import here to avoid circular dependencies
      const { projectService } = await import('../../services/projectService');
      const success = await projectService.deleteProject(projectId);
      
      if (success) {
        // Remove from local state
        setSavedProjects(prev => prev.filter(project => project.id !== projectId));
        console.log('✅ Project deleted and removed from state');
        return true;
      } else {
        console.error('❌ Failed to delete project from Firebase');
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      return false;
    }
  }, []);

  return (
    <ModalContext.Provider value={{ 
      isOpen, 
      isImageModalOpen,
      projectData,
      savedProjects,
      openModal, 
      closeModal,
      openImageModal,
      closeImageModal,
      updateProjectData,
      addImage,
      removeImage,
      updateImageLabel,
      addSavedProject,
      loadSavedProjects,
      clearSavedProjects,
      deleteSavedProject
    }}>
      {children}
    </ModalContext.Provider>
  );
};

"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type ImageData = {
  id: string;
  file: File;
  label: string;
  preview: string;
};

export type SavedImageData = {
  id: string;
  label: string;
  preview: string;
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

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    // Reset project data when main modal closes
    setProjectData({ name: '', address: '', images: [] });
  };

  const openImageModal = () => setIsImageModalOpen(true);
  const closeImageModal = () => setIsImageModalOpen(false);

  const updateProjectData = (data: Partial<ProjectData>) => {
    setProjectData(prev => ({ ...prev, ...data }));
  };

  const addImage = (image: ImageData) => {
    setProjectData(prev => ({
      ...prev,
      images: [...prev.images, image]
    }));
  };

  const removeImage = (imageId: string) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
  };

  const updateImageLabel = (imageId: string, label: string) => {
    setProjectData(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, label } : img
      )
    }));
  };

  const addSavedProject = (project: SavedProject) => {
    setSavedProjects(prev => [project, ...prev]);
  };

  const loadSavedProjects = async () => {
    try {
      console.log('🔄 Loading saved projects...');
      // Import here to avoid circular dependencies
      const { projectService } = await import('../../services/projectService');
      const projects = await projectService.getProjects();
      console.log('📊 Projects fetched from service:', projects.length);
      
      // Convert service ProjectData to SavedProject format
      const convertedProjects: SavedProject[] = projects.map(project => ({
        id: project.id,
        name: project.name,
        address: project.address,
        images: project.images, // Already in SavedImageData format
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      }));
      
      console.log('✅ Setting saved projects:', convertedProjects.length);
      setSavedProjects(convertedProjects);
    } catch (error) {
      console.error('❌ Failed to load saved projects:', error);
    }
  };

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
      loadSavedProjects
    }}>
      {children}
    </ModalContext.Provider>
  );
};

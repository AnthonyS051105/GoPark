"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export type ImageData = {
  id: string;
  file: File;
  label: string;
  preview: string;
};

export type ProjectData = {
  name: string;
  address: string;
  images: ImageData[];
};

type ModalContextType = {
  isOpen: boolean;
  isImageModalOpen: boolean;
  projectData: ProjectData;
  openModal: () => void;
  closeModal: () => void;
  openImageModal: () => void;
  closeImageModal: () => void;
  updateProjectData: (data: Partial<ProjectData>) => void;
  addImage: (image: ImageData) => void;
  removeImage: (imageId: string) => void;
  updateImageLabel: (imageId: string, label: string) => void;
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

  return (
    <ModalContext.Provider value={{ 
      isOpen, 
      isImageModalOpen,
      projectData,
      openModal, 
      closeModal,
      openImageModal,
      closeImageModal,
      updateProjectData,
      addImage,
      removeImage,
      updateImageLabel
    }}>
      {children}
    </ModalContext.Provider>
  );
};

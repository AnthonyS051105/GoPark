"use client";
import React, { useState } from "react";
import { Info, Image } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "../app/context/modalContext";
import { projectService } from "../services/projectService";

export default function Modal() {
  const { 
    isOpen, 
    closeModal, 
    projectData, 
    updateProjectData, 
    openImageModal,
    addSavedProject 
  } = useModal();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projectData.name || !projectData.address) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      // Save project to database
      const savedProject = await projectService.saveProject({
        name: projectData.name,
        address: projectData.address,
        images: projectData.images.map(img => ({
          id: img.id,
          label: img.label,
          preview: img.preview,
          fileName: img.file.name
        }))
      });
      
      console.log('Project saved successfully:', savedProject);
      
      // Add to context for immediate UI update
      addSavedProject(savedProject);
      
      // Navigate to form page with project ID
      router.push(`/newFormPage?projectId=${savedProject.id}`);
      closeModal();
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProjectData({ name: e.target.value });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateProjectData({ address: e.target.value });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-4xl p-6 w-[520px] shadow-lg z-10">
        <div className="flex items-center mb-4">
          <Info className="fill-[#093E47] mr-2" size={40} color="#ffffff" strokeWidth={2.75} />
          <h1 className="text-lg font-semibold text-black">
            Create New Parking Project
          </h1>
        </div>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <div>
            <p className="text-[#909090] font-semibold text-sm mb-2">Nama Tempat *</p>
            <input
              type="text"
              value={projectData.name}
              onChange={handleNameChange}
              className="w-full bg-[#E2E2E2] rounded-xl px-3 py-2 h-[40px] focus:outline-none focus:ring-2 focus:ring-[#2F6E77]"
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <p className="text-[#909090] font-semibold text-sm mb-2">Alamat *</p>
            <input
              type="text"
              value={projectData.address}
              onChange={handleAddressChange}
              className="w-full bg-[#E2E2E2] rounded-xl px-3 py-2 h-[40px] focus:outline-none focus:ring-2 focus:ring-[#2F6E77]"
              placeholder="Enter project address"
              required
            />
          </div>

          <div>
            <p className="text-[#909090] font-semibold text-sm mb-2">Images</p>
            <button
              type="button"
              onClick={openImageModal}
              className="w-full flex items-center justify-center gap-2 bg-[#E2E2E2] hover:bg-gray-300 text-[#093E47] py-2 px-4 rounded-xl transition-colors"
            >
              <Image className="w-5 h-5" />
              Add Images ({projectData.images.length} uploaded)
            </button>
          </div>

          {projectData.images.length > 0 && (
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-sm text-gray-600 mb-2">Uploaded Images:</p>
              <div className="flex flex-wrap gap-2">
                {projectData.images.map((image, index) => (
                  <div key={image.id} className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg text-xs">
                    <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                      <img 
                        src={image.preview} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-gray-700">
                      {image.label || `Image ${index + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-[245px] py-2 bg-[#2F6E77] text-white rounded-full hover:bg-[#093E47] transition duration-200 flex items-center justify-center font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)] disabled:opacity-70"
            >
              {loading ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

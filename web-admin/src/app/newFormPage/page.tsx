// web-admin/src/app/newFormPage/page.tsx
"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { projectService, ProjectData } from "@/services/projectService";
import { useModal } from "../context/modalContext";

interface ImageData {
  id: string;
  label: string;
  preview: string;
}

export default function NewFormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  
  const { loadSavedProjects } = useModal();

  useEffect(() => {
    const loadProject = async () => {
      const projectId = searchParams.get('projectId');
      
      if (projectId) {
        try {
          const projectData = await projectService.getProjectById(projectId);
          if (projectData) {
            setProject(projectData);
          } else {
            console.error('Project not found');
            router.push('/'); // Redirect if project not found
          }
        } catch (error) {
          console.error('Failed to load project:', error);
          router.push('/'); // Redirect on error
        }
      } else {
        console.error('No project ID provided');
        router.push('/'); // Redirect if no project ID
      }
      
      setLoading(false);
    };

    loadProject();
  }, [searchParams, router]);

  const nextImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % project.images.length);
    }
  };

  const prevImage = () => {
    if (project?.images && project.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + project.images.length) % project.images.length);
    }
  };

  const currentImage = project?.images?.[currentImageIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!project) return;
    
    setSaving(true);
    
    try {
      // Here you would normally save the form configuration data
      // For now, we'll just simulate a save and reload projects
      
      console.log('Saving project configuration...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the projects list in the context
      await loadSavedProjects();
      
      alert('Project configuration saved successfully!');
      
    } catch (error) {
      console.error('Error saving project configuration:', error);
      alert('Failed to save project configuration. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2F6E77] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project...</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  if (!project) {
    return (
      <ProtectedRoute>
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Project not found</p>
          </div>
        </main>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main>
        <div className="flex min-h-screen w-full bg-white">
          {/* Bagian Kiri */}
          <div className="w-[35%] p-10 flex flex-col gap-4">
            {/* Project Info */}
            <div className="flex flex-col gap-5 mt-4">
              <h1 className="text-4xl font-extrabold text-teal-900">{project.name}</h1>
              <p className="text-gray-600 text-sm">
                {project.address}
              </p>
            </div>

            {/* Project Info Banner */}
            <div className="mt-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-semibold text-blue-800">Project Information</span>
                </div>
                <p className="text-xs text-blue-700">
                  {project.images && project.images.length > 0 
                    ? `This project has ${project.images.length} image${project.images.length !== 1 ? 's' : ''} with labels. Configure parking details for each area below.`
                    : 'No images uploaded for this project. You can still configure basic parking details.'}
                </p>
              </div>
            </div>

            {/* Dynamic Form Fields based on Images */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              {project.images && project.images.length > 0 ? (
                project.images.map((image, index) => (
                  <div key={image.id}>
                    <div className="flex flex-col gap-3 rounded-lg mt-3">
                      <input 
                        type="text" 
                        value={image.label || ''}
                        placeholder="Label" 
                        readOnly
                        className="bg-gray-100 border-gray-200 text-black py-2.5 px-3 rounded-lg font-semibold cursor-not-allowed" 
                      />

                      {/* Mobil */}
                      <div className="flex items-center gap-3 ml-1">
                        <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                        <span className="w-14 text-[#6F6F6F]">Mobil</span>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                        />
                        <button 
                          type="button" 
                          onClick={() => setCurrentImageIndex(index)}
                          className="ml-auto h-9 w-35 px-3 py-1 rounded-lg bg-[#EAEAEA] text-[#6F6F6F] text-sm hover:bg-gray-300 transition-colors"
                        >
                          View Image
                        </button>
                      </div>

                      {/* Motor */}
                      <div className="flex items-center gap-3 ml-1">
                        <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                        <span className="w-14 text-[#6F6F6F]">Motor</span>
                        <input
                          type="number"
                          defaultValue={0}
                          className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                        />
                      </div>
                    </div>
                    
                    {/* Add separator except for last item */}
                    {index < project.images.length - 1 && (
                      <hr className="border-gray-300 mt-6"/>
                    )}
                  </div>
                ))
              ) : (
                /* Fallback form when no images */
                <div>
                  <div className="flex flex-col gap-3 rounded-lg mt-3">
                    <input 
                      type="text" 
                      placeholder="Label" 
                      className="bg-[#EAEAEA] border-[#EAEAEA] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 text-black py-2.5 px-3 rounded-lg" 
                    />

                    {/* Mobil */}
                    <div className="flex items-center gap-3 ml-1">
                      <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                      <span className="w-14 text-[#6F6F6F]">Mobil</span>
                      <input
                        type="number"
                        defaultValue={0}
                        className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                      />
                    </div>

                    {/* Motor */}
                    <div className="flex items-center gap-3 ml-1">
                      <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                      <span className="w-14 text-[#6F6F6F]">Motor</span>
                      <input
                        type="number"
                        defaultValue={0}
                        className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Submit Button */}
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-3 bg-[#2F6E77] text-white rounded-lg hover:bg-[#093E47] transition-colors font-semibold disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving Configuration...' : 'Save Project Configuration'}
                </button>
              </div>
            </form>
          </div>

          {/* Bagian Kanan - Image Gallery */}
          <div className="w-[65%] p-6">
            <div className="h-full border-2 border-dashed border-[#EAEAEA] rounded-lg flex flex-col">
              {project.images && project.images.length > 0 ? (
                <>
                  {/* Image Display */}
                  <div className="flex-1 flex items-center justify-center p-4 relative">
                    {currentImage && (
                      <img 
                        src={currentImage.preview} 
                        alt={currentImage.label || `Image ${currentImageIndex + 1}`}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                      />
                    )}
                    
                    {/* Navigation Arrows */}
                    {project.images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Image Info */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {currentImage?.label || `Image ${currentImageIndex + 1}`}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {currentImageIndex + 1} of {project.images.length} images
                        </p>
                      </div>
                      
                      {/* Image Indicators */}
                      {project.images.length > 1 && (
                        <div className="flex gap-2">
                          {project.images.map((_, index: number) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`w-3 h-3 rounded-full transition-colors ${
                                index === currentImageIndex 
                                  ? 'bg-[#2F6E77]' 
                                  : 'bg-gray-300 hover:bg-gray-400'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* All Images Preview */}
                  {project.images.length > 1 && (
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex gap-2 overflow-x-auto">
                        {project.images.map((image: ImageData, index: number) => (
                          <button
                            key={image.id}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                              index === currentImageIndex 
                                ? 'border-[#2F6E77]' 
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            <img 
                              src={image.preview} 
                              alt={image.label || `Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                /* Placeholder when no images */
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center text-gray-400">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-lg font-semibold mb-2">No Images Uploaded</p>
                    <p className="text-sm">
                      Images uploaded in the project creation will appear here
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}

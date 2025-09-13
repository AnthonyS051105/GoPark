"use client";
import React, { useState } from "react";
import { X, Upload, Trash2 } from "lucide-react";
import { useModal, ImageData } from "../app/context/modalContext";

export default function ImageModal() {
  const { 
    isImageModalOpen, 
    closeImageModal, 
    projectData, 
    addImage, 
    removeImage, 
    updateImageLabel 
  } = useModal();
  
  const [dragActive, setDragActive] = useState(false);

  if (!isImageModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImage: ImageData = {
            id: Math.random().toString(36).substr(2, 9),
            file,
            label: '',
            preview: e.target?.result as string
          };
          addImage(newImage);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeImageModal}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-4xl p-6 w-[800px] max-h-[600px] overflow-y-auto shadow-lg z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-black">Upload Images & Add Labels</h2>
          <button
            onClick={closeImageModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${
            dragActive 
              ? 'border-[#2F6E77] bg-[#2F6E77]/10' 
              : 'border-gray-300 hover:border-[#2F6E77]'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Drag and drop images here, or{' '}
            <label className="text-[#2F6E77] cursor-pointer hover:underline">
              browse files
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </p>
          <p className="text-sm text-gray-500">
            Supports: PNG, JPG, JPEG, SVG, WebP
          </p>
        </div>

        {/* Images List */}
        {projectData.images.length > 0 && (
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-black">Uploaded Images</h3>
            {projectData.images.map((image, index) => (
              <div key={image.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl">
                <img
                  src={image.preview}
                  alt={`Preview ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2">
                    {image.file.name}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter label for this image (e.g., Basement, Lower Basement)"
                    value={image.label}
                    onChange={(e) => updateImageLabel(image.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#E2E2E2] border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6E77] focus:border-transparent text-sm"
                  />
                </div>
                <button
                  onClick={() => removeImage(image.id)}
                  className="text-red-500 hover:text-red-700 transition-colors p-2"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={closeImageModal}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={closeImageModal}
            className="px-6 py-2 bg-[#2F6E77] text-white rounded-full hover:bg-[#093E47] transition-colors"
          >
            Save Images
          </button>
        </div>
      </div>
    </div>
  );
}

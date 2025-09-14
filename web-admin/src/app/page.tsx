// web-admin/src/app/page.tsx

"use client";
import Modal from "../components/modal";
import ImageModal from "../components/imageModal";
import { useModal } from "./context/modalContext";
import { ModalProvider } from "../app/context/modalContext";
import { useRouter } from "next/navigation";
import Link from "next/link"; 
import Image from "next/image";
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const router = useRouter();
  const { isOpen, openModal, closeModal, savedProjects, loadSavedProjects } = useModal();
  const { user, userData, logout } = useAuth();

  useEffect(() => {
    // Load saved projects when component mounts
    if (user) {
      console.log('🏠 Homepage: Loading saved projects for user:', user.uid);
      loadSavedProjects();
    }
  }, [user, loadSavedProjects]);

  useEffect(() => {
    console.log('🏠 Homepage: Saved projects updated:', savedProjects.length);
  }, [savedProjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/create-new");
  };

  const handleProjectClick = (projectId: string) => {
    router.push(`/newFormPage?projectId=${projectId}`);
  };

  return (
    <ProtectedRoute>
      <main className="flex flex-col items-center min-h-screen bg-[#EAEAEA]">

      <div className="flex flex-col items-center mt-8">
          <img src="/cargradien.png" alt="Logo2" 
              className="size-[40%] justify-center items-center"/>
      </div>

      <div className="flex flex-col items-center space-y-4">
          {/* <h1 className="text-7xl font-extrabold h-[105px] w-[551px] justify-center items-center text-center
                      bg-gradient-to-r from-[#093E47] to-[#1698AD] bg-clip-text text-transparent">
              Go Parking
          </h1> */}
          <p className="text-gray-600 text-center">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. <br />
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. <br />
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </p>
      </div> 

      <button onClick={openModal}
              className="flex flex-col items-center justify-center w-[246px] h-[39px] mt-[30px] shadow-xl rounded-[24px] bg-[#2F6E77] cursor-pointer hover:bg-[#093E47] transition duration-200">
        <div className="flex items-center space-x-[8px]">
          <img src="/Add.png" alt="Tambah"/>
          <p className="font-extrabold text-white">Create New</p>
        </div>
      </button>

      <div className="w-[90%] max-w-[1306px] mx-auto px-4 py-10">
        <div className="relative w-full p-5 border-2 border-dashed border-gray-400 rounded-lg bg-transparent">
          {/* Label */}
          <div className="absolute -top-3 left-4 bg-[#EAEAEA] px-2 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3v18l7-5 7 5V3z" />
            </svg>
            <span className="text-lg font-bold text-teal-700">Your Project</span>
            <button 
              onClick={loadSavedProjects}
              className="ml-2 text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded hover:bg-teal-200 transition-colors"
              title="Refresh projects"
            >
              🔄
            </button>
          </div>

          {/* Isi card */}
          <div className="flex flex-wrap gap-6 mt-6 justify-center">
            {/* Dynamic Project Cards */}
            {savedProjects.length > 0 ? (
              savedProjects.map((project) => (
                <div 
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-[#2F6E77] shadow-xl/10 cursor-pointer hover:bg-[#093E47] transition-all duration-300 transform hover:-translate-y-2 animate-fade-in text-white p-6 rounded-xl flex flex-col justify-between w-[388px] h-[173px]"
                >
                  <div className="flex items-center justify-between">
                    {/* Kiri: icon + text */}
                    <div className="flex items-center gap-2">
                      <img src="/centang.png" alt="centang" className="w-5 h-5" />
                      <p className="font-semibold truncate max-w-[250px]" title={project.name}>
                        {project.name}
                      </p>
                    </div>

                    {/* Kanan: icon edit */}
                    <span>
                      <img src="/edit.png" alt="pencil" className="w-5 h-5" />
                    </span>
                  </div>
                  
                  {/* Project Details */}
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-xs text-gray-200 truncate" title={project.address}>
                      {project.address}
                    </p>
                    <p className="text-xs text-gray-300">
                      {project.images.length} image{project.images.length !== 1 ? 's' : ''} • Created {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProjectClick(project.id);
                    }}
                    className="bg-white text-teal-700 px-4 py-1 rounded-full font-semibold mt-4 cursor-pointer hover:bg-[#E2E2E2] transition-colors"
                  >
                    Review
                  </button>
                </div>
              ))
            ) : (
              /* Placeholder when no projects */
              <div className="w-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-lg font-semibold text-gray-500 mb-2">No Projects Yet</p>
                  <p className="text-sm text-gray-400 mb-4">Create your first parking project to get started</p>
                  <button 
                    onClick={openModal}
                    className="inline-flex items-center gap-2 bg-[#2F6E77] text-white px-6 py-2 rounded-full hover:bg-[#093E47] transition-colors"
                  >
                    <span className="text-lg">+</span>
                    Create New Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-gradient-to-b w-full h-[368px] from-[#306972] to-[#062C32] text-white py-10 px-8 mt-20 justify-center">
        {/* Bagian Atas */}
        <div className="flex flex-col w-[95%] h-32  md:flex-row items-center justify-around gap-6">
          
          {/* Kiri: Logo + Nama */}
          <div className="flex items-center px-5 gap-4">
            <img src="/logoputih.png" alt="logoputih" className="size-26 object-contain" />
            <div className="text-4xl px-4 font-bold leading-tight">
              GoPark
            </div>
          </div>

          {/* Tengah: Deskripsi */}
          <p className="text-center max-w-xl text-sm md:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>

          {/* Kanan: Tombol */}
          <button onClick={openModal}
          className="w-[200px] h-[45px] cursor-pointer flex items-center gap-2 border border-white rounded-full px-4 py-2 hover:bg-white hover:text-teal-900 transition justify-center">
            <span className="text-xl">+</span> Create New
          </button>
        </div>

        {/* Garis */}
        <div className="flex justify-center">
          <hr className="my-8 border-gray-300/50 mt-10 w-[95%]" />
        </div>

        {/* Bagian Bawah: Sosmed */}
        <div className="flex justify-center gap-6 ">
          <a href="#"><img src="/instagram.png" alt="instagram" className="size-[40px] transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" /></a>
          <a href="#"><img src="/twitter.png" alt="twitter" className="size-[40px] transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" /></a>
          <a href="#"><img src="/facebook.png" alt="facebook" className="size-[40px] transition-all duration-300 transform hover:-translate-y-2 animate-fade-in" /></a>
        </div>
      </footer>

      
      </main>
    </ProtectedRoute>
  );
}

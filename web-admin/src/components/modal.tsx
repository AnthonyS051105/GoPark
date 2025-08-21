"use client";
import React from "react";
import { Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useModal } from "../app/context/modalContext";


export default function Modal() {
  const { isOpen, closeModal } = useModal();
  const router = useRouter();

  if (!isOpen) return null; // kalau modal close → tidak render apa2

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/create-new");
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeModal}
      />

      {/* Modal Box */}
      <div className="relative bg-white rounded-4xl p-5 w-[480px] h-[290px] shadow-lg z-10">
        <div className="flex items-center mb-1.5">
          <Info className="fill-[#093E47] mr-1" size={40} color="#ffffff" strokeWidth={2.75} />
          <h1 className="text-base font-semibold ml-2 text-black">
            Berikan nama untuk footage parkir anda
          </h1>
        </div>

        <form className="flex flex-col mx-12" onSubmit={handleSubmit}>
          <p className="text-[#909090] font-semibold text-sm mx-1 mb-1">Nama</p>
          <input
            type="text"
            className="bg-[#E2E2E2] rounded-xl px-3 py-2 h-[40px] focus:outline-none focus:ring-2 focus:ring-[#2F6E77]"
          />

          <p className="text-[#909090] font-semibold text-sm mx-1 my-1">Alamat</p>
          <input
            type="text"
            className="bg-[#E2E2E2] rounded-xl px-3 py-2 h-[40px] focus:outline-none focus:ring-2 focus:ring-[#2F6E77]"
          />
          <div className="flex justify-center items-center mt-6">
            <button
              type="submit"
              className="w-[245px] py-2 bg-[#2F6E77] text-white size-base rounded-full hover:bg-[#093E47] transition duration-200 flex items-center justify-center font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

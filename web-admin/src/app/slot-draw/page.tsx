// web-admin/src/app/slot-draw/page.tsx
"use client";  
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RotateCcw } from "lucide-react";
import { PencilLine } from "lucide-react";
import { Eraser } from "lucide-react";

export default function SlotDrawPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

    return (
        <main>
            <div className="flex min-h-screen w-full bg-white">
                {/* Bagian Kiri */}
                <div className="w-[65%] flex items-center mx-8">
                    <img
                    className="w-full h-auto object-contain"
                    src="/footage.png"
                    alt="footage"
                    />
                </div>

                {/* Bagian Kanan */}
                <div className="w-[35%] p-5 flex flex-col gap-6">

                    <div className="flex-row flex justify-between mt-8 gap-4">
                        <h1 className="font-bold text-2xl text-[#062C32]">Label:</h1>

                        {/* Contoh tombol label */}
                        <div className="flex mt-1 gap-2 flex-wrap text-sm">
                            <button className="px-4 py-0.5 font-medium rounded-lg bg-[#219BA2] text-white">Upper Basement</button>
                            <button className="px-4 py-0.5 font-medium rounded-lg bg-[#909090] text-white">Basement</button>
                            <button className="px-4 py-0.5 font-medium rounded-lg bg-[#909090] text-white">Lower Basement</button>
                        </div>
                    </div>
                    

                    <p className="text-black text-sm">
                    Beri 4 titik pada setiap titik sudut pada area parkiran <br />untuk menandai tempat parkir untuk satu mobil.
                    </p>

                    {/* Tools */}
                    <div className="flex gap-4 justify-center">
                    <button className="size-[50px] rounded-full bg-gray-200 text-black cursor-pointer hover:bg-[#d6d6d6] items-center justify-center flex"><RotateCcw color="#062C32" strokeWidth={3} /></button>
                    <button className="size-[50px] rounded-full bg-gray-200 text-black cursor-pointer hover:bg-[#d6d6d6] items-center justify-center flex"><PencilLine color="#062C32" strokeWidth={3} /></button>
                    <button className="size-[50px] rounded-full bg-gray-200 text-black cursor-pointer hover:bg-[#d6d6d6] items-center justify-center flex"><Eraser color="#062C32" strokeWidth={3} /></button>
                    </div>

                    <p className="text-black font-medium text-sm my-3">Total Parking Slot: 0</p>

                    <div className="mt-auto ml-10">
                        <button className="cursor-pointer w-xs mt-auto bg-teal-60 py-2 bg-[#2F6E77] text-white rounded-full hover:bg-[#093E47] transition duration-200 flex items-center justify-center font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                        Save
                        </button>
                    </div>
                    <div className="ml-10 mb-5">
                        <button onClick={() => router.push("/formPage")} 
                        className="cursor-pointer w-xs bg-teal-60 py-2 bg-[#2F6E77] text-white rounded-full hover:bg-[#093E47] transition duration-200 flex items-center justify-center font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]">
                        Next
                        </button>
                    </div>
                </div>
            </div>


        </main>
    );
}
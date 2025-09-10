// web-admin/src/app/formPage/page.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function FormPage() {
    return (
        <main>
            <div className="flex min-h-screen w-full bg-white">
                {/* Bagian Kiri */}
                <div className="w-[35%] p-10 flex flex-col gap-4">
                    {/* Form Title */}
                    <div className="flex flex-col gap-5 mt-4">
                        <h1 className="text-4xl font-extrabold text-teal-900">Margo City</h1>
                        <p className="text-gray-600 text-sm">
                            Jl. Margonda Raya No.358, Kemiri Muka, Kecamatan Beji,
                            Kota Depok, Jawa Barat 16423
                        </p>
                    </div>
                    {/* Add Details button */}
                    <div className="mt-3">
                        <button className="w-full border-2 border-dotted font-semibold border-black-100 text-[#0C5965] py-2 rounded-lg hover:bg-[#EAEAEA] cursor-pointer transition">
                        + Add Details
                        </button>
                    </div>
                    {/* Form Fields */}
                    <form className="flex flex-col gap-6">
                        <div>
                            <div className="flex flex-col gap-3 rounded-lg mt-3">
                                <input type="text" placeholder="Label" className="bg-[#EAEAEA] border-[#EAEAEA] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 text-black py-2.5 px-3 rounded-lg" />

                            {/* Mobil */}
                            <div className="flex items-center gap-3 ml-1">
                                <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                                <span className="w-14 text-[#6F6F6F]">Mobil</span>
                                <input
                                type="number"
                                defaultValue={0}
                                className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                                />
                                <button className="ml-auto h-9 w-35 px-3 py-1 rounded-lg bg-[#EAEAEA] text-[#6F6F6F] text-sm">
                                + Add Image
                                </button>
                            </div>

                            {/* Motor */}
                            <div className="flex items-center gap-3 ml-1">
                                <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                                <span className="w-14 text-[#6F6F6F] ">Motor</span>
                                <input
                                type="number"
                                defaultValue={0}
                                className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                                />
                            </div>
                            </div>
                        </div>
                        <hr className="border-gray-300"/>
                        <div>
                            <div className="flex flex-col gap-3 rounded-lg mt-3">
                                <input type="text" placeholder="Label" className="bg-[#EAEAEA] border-[#EAEAEA] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 text-black py-2.5 px-3 rounded-lg" />

                            {/* Mobil */}
                            <div className="flex items-center gap-3 ml-1">
                                <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                                <span className="w-14 text-[#6F6F6F]">Mobil</span>
                                <input
                                type="number"
                                defaultValue={0}
                                className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                                />
                                <button className="ml-auto h-9 w-35 px-3 py-1 rounded-lg bg-[#EAEAEA] text-[#6F6F6F] text-sm">
                                + Add Image
                                </button>
                            </div>

                            {/* Motor */}
                            <div className="flex items-center gap-3 ml-1">
                                <input type="checkbox" className="size-[18px] bg-[#EAEAEA] text-[#6F6F6F]"/>
                                <span className="w-14 text-[#6F6F6F] ">Motor</span>
                                <input
                                type="number"
                                defaultValue={0}
                                className="w-12 bg-[#EAEAEA] text-[#6F6F6F] focus:outline-2 focus:outline-[#0C5965] focus:outline-offset-2 rounded px-2 py-1"
                                />
                            </div>
                            </div>
                        </div>
                        <hr className="border-gray-300"/>
                        
                    </form>
            </div>
            {/* Bagian Kanan */}
            <div className="w-[65%] border-2">
                <div className="p-4 m-15 border-dotted rounded-lg border-2 border-[#EAEAEA] items-center justify-center">
                    <img src="/footage1.png" alt="footage1" />
                </div>
            </div>
        </div>
        </main>
    );
}
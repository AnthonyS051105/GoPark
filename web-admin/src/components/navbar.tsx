"use client";
import Link from "next/link";
import { useModal } from "../app/context/modalContext";
import React from "react";

export default function Navbar() {
    const { openModal } = useModal();
    
    return (
        <nav className="navbar sticky bg-[#0A4852] shadow-md w-full h-[75px]">
            <div className="max-w mx-7 px-4 flex items-center justify-between">
                <div className="flex items-center ml-4">
                    <img className="size-[5%] object-contain" 
                        src="/logoputih.png" alt="logoputih" />
                    <Link href="/" className="py-6 px-3 text-2xl font-bold text-[20px] text-white italic hover:text-gray-400 align-vertical-middle cursor-pointer">
                        GoPark
                    </Link>
                </div>
                <div className="py-6 gap-2 space-x-4 adjust ml-auto font-semibold text-white inline-flex">
                    <div><button onClick={openModal} className="hover:text-gray-400 cursor-pointer">Create</button></div>
                    <div><Link href="/profile" className=" hover:text-gray-400 cursor-pointer">Profile</Link></div>
                </div>
            </div>
        </nav>
    );
}
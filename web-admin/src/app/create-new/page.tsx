"use client";
import { ArrowBigDown } from "lucide-react";
import { ArrowBigLeft } from "lucide-react";
import { ArrowBigRight } from "lucide-react";
import { ArrowBigUp } from "lucide-react";
import { Info } from "lucide-react";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function createParking() {
    const router = useRouter();
      const [isOpen, setIsOpen] = useState(false);

    return (
        <main className="flex flex-col items-center min-h-screen bg-[#EAEAEA]">
            <div className="relative w-[97%] h-[650px] m-6 px-4 py-10 bg-[#909090] rounded-lg justify-center flex flex-col items-center">
                <div className="flex flex-col items-center justify-center h-full">
                    <p className="font-extrabold text-lg text-white">Footage</p>
                </div>
                
                <div className="absolute top-8 rounded-lg w-fit h-[40px] bg-[#2F6E77] flex items-center justify-center text-white px-4">
                    <p>Nama Footage</p>
                </div>

                <div>
                    <button onClick={() => setIsOpen(true)}
                            className="hover:bg-[#093E47] absolute bottom-7 right-10 bg-[#062C32] rounded-full size-[85px] justify-center flex items-center">
                        <img className="h-[45px] w-[55px]" src="/cam.png" alt="camera" />
                    </button>
                </div>

                <div className="absolute w-fit justify-center flex items-center bottom-32 right-6 text-[#062C32]">
                    <p className="font-extrabold text-sm">Take a footage!!</p>
                </div>

                <div>
                    <button className="hover:bg-[#093E47] absolute bottom-16 left-8 bg-[#062C32] rounded-full size-[45px] justify-center flex items-center">
                        <ArrowBigLeft className="fill-white size-[30px]" size={36} color="#ffffff" strokeWidth={1.5} />
                    </button>
                </div>
                <div>
                    <button className="hover:bg-[#093E47] absolute bottom-6 left-20 bg-[#062C32] rounded-full size-[45px] justify-center flex items-center">
                        <ArrowBigDown className="fill-white size-[30px]" size={36} color="#ffffff" strokeWidth={1.5} />
                    </button>
                </div>
                <div>
                    <button className="hover:bg-[#093E47] absolute bottom-16 left-32 bg-[#062C32] rounded-full size-[45px] justify-center flex items-center">
                        <ArrowBigRight className="fill-white size-[30px]" size={36} color="#ffffff" strokeWidth={1.5} />
                    </button>
                </div>
                <div>
                    <button className="hover:bg-[#093E47] absolute bottom-28 left-20 bg-[#062C32] rounded-full size-[45px] justify-center flex items-center">
                        <ArrowBigUp className="fill-white size-[30px]" size={36} color="#ffffff" strokeWidth={1.5} />
                    </button>
                </div>
                
            </div>

            {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)} // klik backdrop untuk close
          ></div>

          {/* Modal Box */}
          <div className="relative bg-white rounded-4xl p-5 w-[480px] h-[290px] shadow-lg z-10">
            <div className="flex items-center mb-1.5">
              <Info className="fill-[#093E47] mr-1" size={40} color="#ffffff" strokeWidth={2.75} />
            <h1 className="text-base font-semibold items-center justify-center ml-2 text-black">
              Berikan nama untuk footage parkir anda
            </h1>
            </div>

            <form className="flex flex-col mx-12">
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
                <button onClick={() => router.push("/create-new")}
                  type="submit"
                  className="w-[245px] py-2 bg-[#2F6E77] text-white size-base rounded-full hover:bg-[#093E47] transition duration-200 flex items-center justify-center font-semibold
                  shadow-[0_8px_20px_rgba(0,0,0,0.25)] 
                  hover:shadow-[0_10px_25px_rgba(0,0,0,0.3)]"
                >
                  Save
                </button>
              </div>
              
            </form>
          </div>
        </div>
      )}

        </main>
    );
}
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";
import { ModalProvider } from "./context/modalContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Modal from "../components/modal";

const poppins = Poppins({
  subsets: ['latin'],   // dukungan karakter
  weight: ['400', '500', '600', '700'], // pilih ketebalan
});

export const metadata = {
  title: 'Web Admin',
  description: 'Smart Parking Admin Panel',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* tambahkan className={poppins.className} di body */}
      <body className={poppins.className}>
        <AuthProvider>
          <ModalProvider>
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Modal />
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
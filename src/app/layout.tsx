// app/layout.tsx  
import type { Metadata } from "next";  
import { Geist, Geist_Mono } from "next/font/google";  
import "./globals.css";  
import { ToastContainer } from 'react-toastify'; // Import ToastContainer  
import 'react-toastify/dist/ReactToastify.css'; // Import CSS untuk Toast  
import { Toaster } from "@/components/ui/toaster"
  
const geistSans = Geist({  
  variable: "--font-geist-sans",  
  subsets: ["latin"],  
});  
  
const geistMono = Geist_Mono({  
  variable: "--font-geist-mono",  
  subsets: ["latin"],  
});  
  
export const metadata: Metadata = {  
  title: "Ayo App",  
  description: "Plaform Sharing Sport Reservation",  
};  
  
export default function RootLayout({  
  children,  
}: Readonly<{  
  children: React.ReactNode;  
}>) {  
  return (  
    <html lang="en">  
      <body  
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}  
      >  
        {children}  
        <ToastContainer /> {/* Tambahkan ToastContainer di sini */}  
        <Toaster />
      </body>  
    </html>  
  );  
}  

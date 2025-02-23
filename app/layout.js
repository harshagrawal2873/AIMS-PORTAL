import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import { AuthProvider } from "../context/AuthContext";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Aims ",
  description: " Academic Information Management System",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-slate-900 via-slate-700 to-slate-500 min-h-screen flex flex-col`}
        >
          <Header />
          <main className="flex-grow">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
           </main>
          <Footer />
        </body>
      </html>
    </AuthProvider>
  );
}

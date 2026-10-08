import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "TUNTAS — Basis Pengetahuan & Solusi APBN",
  description: "Tuntaskan tugas, temukan solusi. Komunitas pelaksana APBN di K/L dan satker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="flex-1 pb-16 md:pb-6">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}

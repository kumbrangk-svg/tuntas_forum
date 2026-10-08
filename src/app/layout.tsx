import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'TUNTAS — Basis Pengetahuan APBN & Forum',
  description: 'Tuntaskan tugas, temukan solusi seputar APBN untuk pelaksana K/L dan Satker.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 pb-16 md:pb-0">
        {/* Top Header Desktop & Mobile */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">T</span>
              <span className="font-extrabold text-blue-700 tracking-tight text-lg">TUNTAS</span>
            </Link>

            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/" className="hover:text-blue-600">Beranda</Link>
              <Link href="/cari" className="hover:text-blue-600">Cari</Link>
              <Link href="/tulis" className="hover:text-blue-600">Tulis Catatan</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/masuk"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
              >
                Masuk
              </Link>
            </div>
          </div>
        </header>

        {/* Konten Halaman */}
        <main className="flex-1">{children}</main>

        {/* Bottom Navigation Khusus Mobile (Sesuai Mockup) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-50 flex justify-around py-2.5 text-xs text-slate-500">
          <Link href="/" className="flex flex-col items-center">
            <span>🏠</span>
            <span className="mt-0.5">Beranda</span>
          </Link>
          <Link href="/cari" className="flex flex-col items-center">
            <span>🔍</span>
            <span className="mt-0.5">Cari</span>
          </Link>
          <Link href="/tulis" className="flex flex-col items-center text-blue-600 font-bold">
            <span>✏️</span>
            <span className="mt-0.5">Tulis</span>
          </Link>
          <Link href="/pengaturan" className="flex flex-col items-center">
            <span>👤</span>
            <span className="mt-0.5">Profil</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}

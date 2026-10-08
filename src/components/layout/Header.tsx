import Link from "next/link";
import { Search, Bell, User } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/" className="font-extrabold text-blue-700 tracking-tight text-xl">
            TUNTAS
          </Link>
        </div>

        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari di TUNTAS (tugas, masalah, regulasi)..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button aria-label="Notifikasi" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full">
            <Bell className="h-5 w-5" />
          </button>
          <Link
            href="/masuk"
            className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-600 px-3 py-1.5 rounded-full border border-slate-200"
          >
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Masuk</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

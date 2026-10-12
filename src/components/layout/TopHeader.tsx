import Link from "next/link";
import { getUser } from "@/lib/auth";
import { Search, Bell, Plus, LogIn } from "lucide-react";

export async function TopHeader() {
  const user = await getUser();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Member";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <header className="h-16 bg-white/95 backdrop-blur border-b border-slate-200 px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 shrink-0">
      {/* Mobile Brand (Hanya tampil di HP) */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
          T
        </div>
        <span className="font-extrabold text-slate-900 tracking-wide">TUNTAS</span>
      </div>

      {/* Quick Search Header (Desktop) - Mengisi ruang tengah agar fit */}
      <div className="hidden md:flex items-center flex-1 max-w-md mr-4">
        <form action="/cari" method="GET" className="relative w-full">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            name="q"
            type="search"
            placeholder="Cari tugas, masalah, atau regulasi..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-4 py-2 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          />
        </form>
      </div>

      {/* Sisi Kanan: Aksi & Profil */}
      <div className="flex items-center gap-3 ml-auto">
        <Link
          href="/tulis"
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Tulis</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:border-l sm:border-slate-200">
            <Link
              href="/notifikasi"
              aria-label="Notifikasi"
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Link>

            <Link href="/pengaturan" className="flex items-center gap-2 hover:opacity-85 transition">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-blue-100">
                {initials}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                  {displayName}
                </p>
                <p className="text-[10px] text-slate-500">Anggota</p>
              </div>
            </Link>
          </div>
        ) : (
          <Link
            href="/masuk"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            <LogIn className="h-3.5 w-3.5" />
            <span>Masuk</span>
          </Link>
        )}
      </div>
    </header>
  );
}

import Link from "next/link";
import { getUser } from "@/lib/auth";

export async function TopHeader() {
  const user = await getUser();

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Mobile Brand */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          T
        </div>
        <span className="font-extrabold text-slate-900 tracking-wide">TUNTAS</span>
      </div>

      {/* Desktop Search Bar Filler */}
      <div className="hidden md:block w-96" />

      {/* Profile & Notifications */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/notifikasi" className="relative p-2 text-slate-500 hover:text-slate-800">
              <span className="text-lg">🔔</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </Link>
            <Link href="/pengaturan" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AS
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-none">Andi Santoso</p>
                <p className="text-[10px] text-slate-500 mt-0.5">Member</p>
              </div>
            </Link>
          </div>
        ) : (
          <Link
            href="/masuk"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Masuk
          </Link>
        )}
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const MENUS = [
  { label: "Beranda", href: "/", icon: "🏠" },
  { label: "Cari", href: "/cari", icon: "🔍" },
  { label: "Catatan", href: "/cari?jenis=tugas", icon: "📄" },
  { label: "Forum", href: "/forum", icon: "💬" },
  { label: "Tag", href: "/tag", icon: "🏷️" },
  { label: "Regulasi", href: "/regulasi", icon: "⚖️" },
  { label: "Notifikasi", href: "/notifikasi", icon: "🔔", badge: 3 },
  { label: "Profil", href: "/pengaturan", icon: "👤" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen bg-[#0b1728] text-slate-300 p-4 border-r border-slate-800 shrink-0 sticky top-0 h-screen">
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-2 py-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
          T
        </div>
        <div>
          <h1 className="font-extrabold text-white text-lg tracking-wider">TUNTAS</h1>
          <p className="text-[10px] text-slate-400">Tuntaskan tugas, temukan solusi.</p>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1">
        {MENUS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* CTA Box Bawah */}
      <div className="bg-gradient-to-br from-blue-950/70 to-slate-900 border border-blue-600/30 rounded-2xl p-4 text-xs">
        <p className="text-slate-300 leading-relaxed mb-3">
          Bergabung dengan komunitas TUNTAS untuk berbagi ilmu dan solusi seputar APBN.
        </p>
        <Link
          href="/tulis"
          className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition"
        >
          Tulis Sekarang &rarr;
        </Link>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Beranda", href: "/", icon: "🏠" },
  { label: "Cari", href: "/cari", icon: "🔍" },
  { label: "Tulis", href: "/tulis", icon: "✍️", highlight: true },
  { label: "Notifikasi", href: "/notifikasi", icon: "🔔" },
  { label: "Profil", href: "/pengaturan", icon: "👤" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around px-2 z-40 shadow-lg">
      {ITEMS.map((item) => {
        const isActive = pathname === item.href;
        if (item.highlight) {
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 text-xl font-bold">
                +
              </div>
              <span className="text-[10px] font-medium text-slate-600 mt-0.5">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center py-1 text-[10px] font-medium transition ${
              isActive ? "text-blue-600" : "text-slate-400"
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

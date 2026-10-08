"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/cari", label: "Cari", icon: Search },
  { href: "/tulis", label: "Tulis", icon: PlusCircle, isPrimary: true },
  { href: "/tanya", label: "Forum", icon: MessageSquare },
  { href: "/pengaturan", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center text-blue-600 font-semibold"
              >
                <div className="bg-blue-600 text-white p-2 rounded-full -mt-5 shadow-md">
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[10px] mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-3 text-xs transition",
                isActive ? "text-blue-600 font-bold" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

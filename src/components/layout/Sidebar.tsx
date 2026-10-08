import Link from "next/link";
import { 
  Home, Search, BookOpen, MessageSquare, 
  Tag, Scale, PlusCircle, Shield 
} from "lucide-react";

const MENU_ITEMS = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/cari", label: "Cari", icon: Search },
  { href: "/catatan", label: "Catatan", icon: BookOpen },
  { href: "/tanya", label: "Forum", icon: MessageSquare },
  { href: "/tag", label: "Tag", icon: Tag },
  { href: "/regulasi", label: "Regulasi", icon: Scale },
];

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 bg-white min-h-screen p-4 shrink-0">
      <div className="px-3 py-2 mb-6">
        <Link href="/" className="text-2xl font-black text-blue-700 tracking-wider">
          TUNTAS
        </Link>
        <p className="text-xs text-slate-500 mt-0.5">Tuntaskan tugas, temukan solusi</p>
      </div>

      <nav className="space-y-1 flex-1">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-100 space-y-2">
        <Link
          href="/tulis"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          Tulis Catatan
        </Link>

        <Link
          href="/admin"
          className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-slate-800 rounded-lg"
        >
          <Shield className="h-3.5 w-3.5" />
          Dasbor Admin
        </Link>
      </div>
    </aside>
  );
}

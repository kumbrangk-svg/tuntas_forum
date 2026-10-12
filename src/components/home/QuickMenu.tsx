import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const CARDS = [
  {
    title: "Catatan Kerja",
    desc: "Panduan SOP tugas dan solusi masalah teknis.",
    icon: "📄",
    href: "/cari?jenis=tugas",
    badge: "SOP & Masalah",
    color: "from-blue-50 to-indigo-50/50 hover:border-blue-300 text-blue-700",
  },
  {
    title: "Forum Diskusi",
    desc: "Tanya jawab praktis antar pelaksana satker.",
    icon: "💬",
    href: "/forum",
    badge: "Komunitas",
    color: "from-emerald-50 to-teal-50/50 hover:border-emerald-300 text-emerald-700",
  },
  {
    title: "Basis Regulasi",
    desc: "Katalog PMK, Perdirjen, dan regulasi APBN.",
    icon: "⚖️",
    href: "/regulasi",
    badge: "Terkait",
    color: "from-purple-50 to-violet-50/50 hover:border-purple-300 text-purple-700",
  },
  {
    title: "Jelajah Tag",
    desc: "Eksplorasi topik, aplikasi, dan unit kerja.",
    icon: "🏷️",
    href: "/tag",
    badge: "Taksonomi",
    color: "from-amber-50 to-orange-50/50 hover:border-amber-300 text-amber-700",
  },
];

export function QuickMenu() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {CARDS.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className={`group relative p-4 bg-gradient-to-br ${card.color} bg-white border border-slate-200/80 rounded-2xl shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col justify-between`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                {card.badge}
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1 group-hover:text-blue-600 transition">
              <span>{card.title}</span>
              <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition" />
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-snug">{card.desc}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

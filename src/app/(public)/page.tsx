import Link from "next/link";
import { BookOpen, MessageSquare, Scale, Tag, ArrowRight } from "lucide-react";

const QUICK_ACTIONS = [
  { href: "/catatan", label: "Catatan", desc: "Tugas & masalah APBN", icon: BookOpen, color: "text-blue-600 bg-blue-50" },
  { href: "/tanya", label: "Forum", desc: "Tanya jawab pelaksana", icon: MessageSquare, color: "text-emerald-600 bg-emerald-50" },
  { href: "/regulasi", label: "Regulasi", desc: "Peraturan terkait", icon: Scale, color: "text-purple-600 bg-purple-50" },
  { href: "/tag", label: "Tag", desc: "Jelajahi per topik", icon: Tag, color: "text-amber-600 bg-amber-50" },
];

export default function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Banner Hero */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-6 md:p-8 text-white shadow-sm">
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Selamat datang di TUNTAS!</h1>
        <p className="mt-2 text-blue-100 max-w-2xl text-sm md:text-base">
          Basis pengetahuan kerja + forum tanya-jawab seputar APBN untuk pelaksana di K/L dan satker. Informal & berbasis komunitas.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          {["#LaporanKeuangan", "#BLU", "#Perdirjen28/2019", "#SIPD", "#SPM"].map((t) => (
            <span key={t} className="bg-white/10 hover:bg-white/20 px-2.5 py-1 rounded-full cursor-pointer transition">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Grid 4 Kartu Fitur Cepat */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href} className="bg-white border border-slate-200 p-4 rounded-xl hover:shadow-sm transition">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.color} mb-2`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-slate-800 text-sm">{a.label}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{a.desc}</p>
            </Link>
          );
        })}
      </section>

      {/* Konten Placeholder Feed */}
      <section className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-slate-800">Catatan Terbaru</h2>
          <Link href="/catatan" className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1">
            Lihat semua <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        <p className="text-sm text-slate-500">Belum ada catatan. Buat catatan pertama Anda pada menu Tulis.</p>
      </section>
    </div>
  );
}

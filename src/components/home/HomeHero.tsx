import Link from "next/link";
import { Search } from "lucide-react";

const QUICK_TAGS = [
  { name: "#LaporanKeuangan", slug: "laporan-keuangan" },
  { name: "#BLU", slug: "blu" },
  { name: "#Perdirjen 28/2019", slug: "perdirjen-28-2019" },
  { name: "#SIPD", slug: "sipd" },
  { name: "#SPM", slug: "spm" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-800 p-6 md:p-8 text-white shadow-md">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Kolom Kiri: Judul, Cari, dan Tag */}
        <div className="lg:col-span-7 xl:col-span-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-blue-100 text-xs font-medium mb-3 border border-white/20">
            <span>🏛️</span>
            <span>Basis Pengetahuan Kerja Komunitas APBN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
            Selamat datang di TUNTAS!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 mb-5 max-w-xl">
            Tuntaskan tugas satker, temukan solusi kendala operasional, dan diskusikan regulasi keuangan negara.
          </p>

          <form action="/cari" method="GET" className="flex items-center gap-2 max-w-xl mb-3.5">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="search"
                name="q"
                placeholder="Cari tugas, masalah SAKTI/SPAN, atau regulasi..."
                className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-800 placeholder-slate-400 border-0 rounded-xl text-xs sm:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm shadow transition shrink-0"
            >
              Cari
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-blue-200 text-[11px] font-semibold mr-1">Topik populer:</span>
            {QUICK_TAGS.map((t) => (
              <Link
                key={t.slug}
                href={`/cari?q=${encodeURIComponent(t.name.replace("#", ""))}`}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-blue-50 font-medium rounded-lg border border-white/15 backdrop-blur transition text-[11px]"
              >
                {t.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Kolom Kanan: 2 Kartu Fitur Ringkas Mengisi Sisi Kanan */}
        <div className="hidden lg:grid lg:col-span-5 xl:col-span-4 grid-cols-2 gap-3 z-10">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-2xl mb-2">📑</div>
            <div className="text-sm font-bold text-white">SOP & Solusi</div>
            <p className="text-[11px] text-blue-100/80 mt-1 leading-snug">
              Template terstandar untuk panduan tugas dan langkah penanganan masalah.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="text-2xl mb-2">⚖️</div>
            <div className="text-sm font-bold text-white">Uji Regulasi</div>
            <p className="text-[11px] text-blue-100/80 mt-1 leading-snug">
              Status aturan diperbarui otomatis ketika ada peraturan pengganti.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

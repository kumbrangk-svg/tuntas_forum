import Link from "next/link";

const QUICK_TAGS = [
  { name: "#LaporanKeuangan", slug: "laporan-keuangan" },
  { name: "#BLU", slug: "blu" },
  { name: "#Perdirjen 28/2019", slug: "perdirjen-28-2019" },
  { name: "#SIPD", slug: "sipd" },
  { name: "#SPM", slug: "spm" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100 p-6 md:p-8 border border-blue-200/60 shadow-sm">
      {/* Siluet Gedung/Monas Samar di Kanan */}
      <div className="absolute right-4 md:right-10 bottom-0 pointer-events-none opacity-20 select-none hidden sm:block">
        <svg width="180" height="180" viewBox="0 0 100 100" fill="currentColor" className="text-blue-900">
          <path d="M48 5 h4 v15 h-4 z M46 20 h8 v15 h-8 z M42 35 h16 v25 h-16 z M30 60 h40 v40 h-40 z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Selamat datang di TUNTAS!
        </h1>
        <p className="text-xs md:text-sm text-slate-600 mt-1 mb-5">
          Basis pengetahuan kerja + forum tanya-jawab seputar APBN untuk pelaksana di K/L dan satker.
        </p>

        {/* Search Bar Besar */}
        <form action="/cari" method="GET" className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-slate-400 text-sm">🔍</span>
            <input
              type="text"
              name="q"
              placeholder="Cari catatan, pertanyaan, tag, atau regulasi..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs md:text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-semibold shadow-sm transition"
          >
            Cari
          </button>
        </form>

        {/* Quick Tag Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          {QUICK_TAGS.map((t) => (
            <Link
              key={t.slug}
              href={`/cari?q=${encodeURIComponent(t.name.replace("#", ""))}`}
              className="px-2.5 py-1 bg-white/80 hover:bg-white text-blue-700 font-medium rounded-full border border-blue-200/60 shadow-2xs transition"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

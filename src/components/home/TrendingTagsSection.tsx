import Link from "next/link";

const TAGS = [
  { name: "#LaporanKeuangan", count: 124 },
  { name: "#BLU", count: 98 },
  { name: "#Perdirjen 28/2019", count: 76 },
  { name: "#SPM", count: 62 },
  { name: "#SIPD", count: 48 },
  { name: "#AkuntansiPemerintah", count: 37 },
];

export function TrendingTagsSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h2 className="font-bold text-slate-900 text-sm">Trending Tag</h2>
        </div>

        <div className="space-y-2">
          {TAGS.map((t) => (
            <Link
              key={t.name}
              href={`/cari?q=${encodeURIComponent(t.name.replace("#", ""))}`}
              className="flex items-center justify-between text-xs py-1 px-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              <span className="text-blue-700 font-medium">{t.name}</span>
              <span className="text-[11px] text-slate-400 font-semibold">{t.count}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

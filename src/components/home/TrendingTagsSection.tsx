import Link from "next/link";
import { Hash, ArrowRight } from "lucide-react";

const TAGS = [
  { name: "LaporanKeuangan", count: 124, pct: 100 },
  { name: "BLU", count: 98, pct: 79 },
  { name: "Perdirjen 28/2019", count: 76, pct: 61 },
  { name: "SPM", count: 62, pct: 50 },
  { name: "SIPD", count: 48, pct: 38 },
  { name: "AkuntansiPemerintah", count: 37, pct: 30 },
];

export function TrendingTagsSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🔥</span>
            <h2 className="font-bold text-slate-900 text-sm">Trending Tag</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Minggu ini</span>
        </div>

        <div className="space-y-2.5">
          {TAGS.map((t, idx) => (
            <Link
              key={t.name}
              href={`/cari?q=${encodeURIComponent(t.name)}`}
              className="group block p-1.5 rounded-xl hover:bg-slate-50 transition"
            >
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-semibold text-slate-700 group-hover:text-blue-600 flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400 font-bold w-3.5">{idx + 1}</span>
                  <span>#{t.name}</span>
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{t.count} catatan</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all group-hover:bg-blue-500"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100">
        <Link
          href="/tag"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-amber-50 text-slate-600 hover:text-amber-700 rounded-xl text-xs font-semibold transition"
        >
          <span>Jelajahi Semua Tag</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

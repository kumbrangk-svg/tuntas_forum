import Link from "next/link";
import { Clock, MessageSquare, ArrowRight } from "lucide-react";

interface NoteItem {
  id: string;
  title: string;
  slug: string;
  kind: "tugas" | "masalah";
  created_at: string;
}

export function LatestNotesSection({ notes }: { notes: NoteItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">📝</span>
            <h2 className="font-bold text-slate-900 text-sm">Catatan Terbaru</h2>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Terverifikasi</span>
        </div>

        <div className="divide-y divide-slate-100">
          {notes.map((n) => (
            <div key={n.id} className="py-2.5 group first:pt-0 last:pb-0">
              <Link
                href={`/catatan/${n.slug}`}
                className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition leading-snug"
              >
                {n.title}
              </Link>
              <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-semibold uppercase text-[9px] ${
                    n.kind === "tugas"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {n.kind}
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" /> Baru saja
                </span>
                <span className="inline-flex items-center gap-1 text-slate-400 ml-auto">
                  <MessageSquare className="h-3 w-3" /> 0
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100">
        <Link
          href="/cari"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-xl text-xs font-semibold transition"
        >
          <span>Lihat Semua Catatan</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

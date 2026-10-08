import Link from "next/link";

interface NoteItem {
  id: string;
  title: string;
  slug: string;
  kind: "tugas" | "masalah";
  created_at: string;
}

export function LatestNotesSection({ notes }: { notes: NoteItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h2 className="font-bold text-slate-900 text-sm">Catatan Terbaru</h2>
          <Link href="/cari" className="text-xs text-blue-600 hover:underline font-medium">
            Lihat semua &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className="group">
              <Link
                href={`/catatan/${n.slug}`}
                className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1"
              >
                {n.title}
              </Link>
              <div className="flex items-center gap-2 mt-1 text-[10px]">
                <span
                  className={`px-1.5 py-0.5 rounded font-medium ${
                    n.kind === "tugas" ? "bg-blue-50 text-blue-700" : "bg-rose-50 text-rose-700"
                  }`}
                >
                  {n.kind}
                </span>
                <span className="text-slate-400">2 jam lalu</span>
                <span className="text-slate-400">💬 12</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

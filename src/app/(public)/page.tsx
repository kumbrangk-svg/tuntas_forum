import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  // Ambil Catatan Trending
  const { data: trending } = await supabase
    .from("trending_notes")
    .select("note_id, notes(id, title, slug, kind, rating_avg, rating_count, summary)")
    .limit(5);

  // Ambil Catatan Terbaru
  const { data: latest } = await supabase
    .from("notes")
    .select("id, title, slug, kind, rating_avg, rating_count, summary, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(8);

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="text-center space-y-3">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Tuntaskan Tugas, Temukan Solusi APBN
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Basis pengetahuan kerja & penyelesaian masalah satker seputar SAKTI, SP2D, dan regulasi keuangan negara.
        </p>
        <div className="pt-2 max-w-lg mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Trending Section */}
      {trending && trending.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-1.5">
              🔥 Sedang Hangat Minggu Ini
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trending.map((t: any) => {
              const item = t.notes;
              if (!item) return null;
              return (
                <div key={item.id} className="p-4 bg-white border border-amber-200 rounded-xl shadow-sm hover:border-amber-400">
                  <div className="flex items-center gap-2 text-xs mb-1">
                    <span className={`px-2 py-0.5 rounded font-semibold ${item.kind === "tugas" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"}`}>
                      {item.kind}
                    </span>
                    <span className="text-slate-500">★ {item.rating_avg.toFixed(1)}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    <Link href={`/catatan/${item.slug}`} className="hover:text-emerald-700">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{item.summary}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Terbaru Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Catatan & Panduan Terbaru</h2>
        <div className="divide-y bg-white rounded-xl border border-slate-200">
          {latest?.map((item: any) => (
            <div key={item.id} className="p-4 hover:bg-slate-50">
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className="text-emerald-800 font-medium">★ {item.rating_avg.toFixed(1)}</span>
                <span className="text-slate-400">({item.rating_count} ulasan)</span>
              </div>
              <h3 className="font-semibold text-slate-900 text-sm">
                <Link href={`/catatan/${item.slug}`} className="hover:text-emerald-700">
                  {item.title}
                </Link>
              </h3>
              <p className="text-xs text-slate-600 line-clamp-1 mt-1">{item.summary}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

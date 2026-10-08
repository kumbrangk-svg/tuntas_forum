import Link from "next/link";
import { SearchBar } from "@/components/layout/SearchBar";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Props {
  searchParams: Promise<{ q?: string; jenis?: string; urutan?: string; tag?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params.q || "";
  const jenis = params.jenis || null;
  const sort = params.urutan || "relevan";
  const tag = params.tag || null;

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: results } = await supabase.rpc("search_all", {
    p_q: q,
    p_kind: jenis,
    p_tag_slug: tag,
    p_sort: sort,
    p_limit: 20,
    p_offset: 0,
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Pencarian Pengetahuan APBN</h1>
      <SearchBar defaultValue={q} />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <Link
          href={`/cari?q=${q}&urutan=${sort}`}
          className={`px-3 py-1.5 rounded-full border ${!jenis ? "bg-emerald-700 text-white" : "bg-white text-slate-700"}`}
        >
          Semua
        </Link>
        <Link
          href={`/cari?q=${q}&jenis=tugas&urutan=${sort}`}
          className={`px-3 py-1.5 rounded-full border ${jenis === "tugas" ? "bg-emerald-700 text-white" : "bg-white text-slate-700"}`}
        >
          Tugas & SOP
        </Link>
        <Link
          href={`/cari?q=${q}&jenis=masalah&urutan=${sort}`}
          className={`px-3 py-1.5 rounded-full border ${jenis === "masalah" ? "bg-emerald-700 text-white" : "bg-white text-slate-700"}`}
        >
          Solusi Masalah
        </Link>
      </div>

      {/* Daftar Hasil */}
      <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200">
        {!results || results.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Tidak ada catatan yang cocok dengan kata kunci &quot;{q}&quot;.
          </div>
        ) : (
          results.map((item: any) => (
            <article key={item.id} className="p-4 hover:bg-slate-50">
              <div className="flex items-center gap-2 text-xs mb-1">
                <span
                  className={`px-2 py-0.5 rounded font-medium ${item.kind === "tugas" ? "bg-blue-100 text-blue-800" : "bg-rose-100 text-rose-800"}`}
                >
                  {item.kind === "tugas" ? "SOP Tugas" : "Masalah"}
                </span>
                {item.is_verified && (
                  <span className="text-emerald-700 font-semibold">✓ Terverifikasi</span>
                )}
                <span className="text-slate-400">★ {item.rating_avg.toFixed(1)} ({item.rating_count})</span>
              </div>
              <h2 className="text-base font-semibold text-slate-900">
                <Link href={`/catatan/${item.slug}`} className="hover:text-emerald-700">
                  {item.title}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.summary}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

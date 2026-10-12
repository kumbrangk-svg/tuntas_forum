import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Scale, Search } from 'lucide-react';

export default async function RegulasiIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('regulations')
    .select('id, type, number, year, title, status, url, created_at')
    .order('year', { ascending: false });

  if (q) query = query.ilike('title', `%${q}%`);
  if (status) query = query.eq('status', status);

  const { data: regulations } = await query.limit(20);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
          <Scale className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Katalog Regulasi & Dasar Hukum</h1>
          <p className="text-xs text-slate-500">Kumpulan peraturan APBN dan status keberlakuannya.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <form method="GET" className="mt-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Cari peraturan berdasarkan nomor atau judul..."
            className="w-full pl-9 pr-3 py-2 border rounded-xl text-xs bg-white"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold">
          Cari
        </button>
      </form>

      {/* Grid Regulasi */}
      <div className="mt-6 divide-y border bg-white rounded-2xl overflow-hidden shadow-xs">
        {regulations && regulations.length > 0 ? (
          regulations.map((r: any) => (
            <Link key={r.id} href={`/regulasi/${r.id}`} className="p-4 block hover:bg-slate-50 transition">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-purple-700 text-sm">
                  {r.type} {r.number} Tahun {r.year}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  r.status === 'berlaku' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {r.status}
                </span>
              </div>
              <p className="text-xs text-slate-700 line-clamp-2">{r.title}</p>
            </Link>
          ))
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">Belum ada regulasi yang sesuai.</div>
        )}
      </div>
    </div>
  );
}

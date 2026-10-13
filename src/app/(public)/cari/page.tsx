import Link from 'next/link';
import { SearchBar } from '@/components/layout/SearchBar';
import { createClient } from '@/lib/supabase/server';

interface ResultItem {
  id: string;
  title: string;
  snippet: string;
  url: string;
  badge: string;
  badgeClass: string;
  meta: string;
}

async function fetchQuestions(supabase: any, q: string, limit = 10): Promise<ResultItem[]> {
  let query = supabase
    .from('questions')
    .select('id, title, body_text, answers_count')
    .neq('status', 'hidden')
    .order('created_at', { ascending: false });

  if (q.trim()) query = query.ilike('title', `%${q.trim()}%`);
  const { data } = await query.limit(limit);
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    snippet: item.body_text || '',
    url: `/tanya/${item.id}`,
    badge: 'Forum Diskusi',
    badgeClass: 'bg-indigo-100 text-indigo-800',
    meta: `${item.answers_count || 0} jawaban`,
  }));
}

async function fetchNotes(supabase: any, q: string, kind: string | null, tag: string | null, sort: string): Promise<ResultItem[]> {
  const { data } = await supabase.rpc('search_all', {
    p_q: q.trim(),
    p_kind: kind,
    p_tag_slug: tag,
    p_sort: sort,
    p_limit: 20,
    p_offset: 0,
  });
  if (!data) return [];

  return data.map((item: any) => ({
    id: item.id,
    title: item.title,
    snippet: item.summary || '',
    url: `/catatan/${item.slug}`,
    badge: item.kind === 'tugas' ? 'SOP Tugas' : 'Solusi Masalah',
    badgeClass: item.kind === 'tugas' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800',
    meta: `★ ${(Number(item.rating_avg) || 0).toFixed(1)} (${item.rating_count || 0})`,
  }));
}

function FilterTabs({ q, jenis, sort }: { q: string; jenis: string | null; sort: string }) {
  const tabs = [
    { key: null, label: 'Semua' },
    { key: 'tugas', label: 'Tugas & SOP' },
    { key: 'masalah', label: 'Solusi Masalah' },
    { key: 'tanya', label: 'Forum Diskusi' },
  ];
  return (
    <div className="flex flex-wrap gap-2 text-xs">
      {tabs.map((t) => {
        const isActive = jenis === t.key;
        const href = t.key ? `/cari?q=${q}&jenis=${t.key}&urutan=${sort}` : `/cari?q=${q}&urutan=${sort}`;
        return (
          <Link
            key={t.label}
            href={href}
            className={`px-3 py-1.5 rounded-full border transition ${isActive ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:bg-slate-50'}`}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; jenis?: string; urutan?: string; tag?: string }>;
}) {
  const { q = '', jenis = null, urutan = 'relevan', tag = null } = await searchParams;
  const supabase = await createClient();

  let results: ResultItem[] = [];
  if (jenis === 'tanya') {
    results = await fetchQuestions(supabase, q, 20);
  } else if (jenis === 'tugas' || jenis === 'masalah') {
    results = await fetchNotes(supabase, q, jenis, tag, urutan);
  } else {
    const [notes, questions] = await Promise.all([
      fetchNotes(supabase, q, null, tag, urutan),
      fetchQuestions(supabase, q, 6),
    ]);
    results = [...questions, ...notes];
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      <h1 className="text-xl font-bold text-slate-900">Pencarian Pengetahuan APBN</h1>
      <SearchBar defaultValue={q} />
      <FilterTabs q={q} jenis={jenis} sort={urutan} />

      <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        {results.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">
            Tidak ada konten yang cocok dengan kata kunci &quot;{q}&quot;.
          </div>
        ) : (
          results.map((item) => (
            <article key={item.id + item.badge} className="p-4 hover:bg-slate-50/70 transition">
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className={`px-2 py-0.5 rounded-md font-semibold text-[10px] ${item.badgeClass}`}>
                  {item.badge}
                </span>
                <span className="text-slate-400 text-[11px]">{item.meta}</span>
              </div>
              <h2 className="text-base font-bold text-slate-900">
                <Link href={item.url} className="hover:text-blue-600 transition">
                  {item.title}
                </Link>
              </h2>
              {item.snippet && <p className="text-xs text-slate-600 line-clamp-2 mt-1">{item.snippet}</p>}
            </article>
          ))
        )}
      </div>
    </main>
  );
}

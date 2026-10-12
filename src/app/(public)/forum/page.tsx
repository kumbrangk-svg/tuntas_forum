import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { MessageSquare, Plus, CheckCircle2 } from 'lucide-react';

export default async function ForumIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = 'semua', q } = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('questions')
    .select(`
      id, title, status, answers_count, accepted_answer_id, created_at,
      author:profiles!questions_author_id_fkey(display_name, unit_text)
    `)
    .neq('status', 'hidden');

  if (q) query = query.ilike('title', `%${q}%`);
  if (tab === 'unanswered') query = query.eq('answers_count', 0);
  if (tab === 'popular') query = query.order('answers_count', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: questions } = await query.limit(20);

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900">Forum Tanya Jawab APBN</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Diskusikan solusi kendala operasional dengan sesama pelaksana satker.</p>
        </div>
        <Link
          href="/tanya-baru"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Ajukan Pertanyaan</span>
        </Link>
      </div>

      {/* Tabs Filter */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        <Link href="/forum?tab=semua" className={`px-3 py-1.5 rounded-lg ${tab === 'semua' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          Semua Diskusi
        </Link>
        <Link href="/forum?tab=unanswered" className={`px-3 py-1.5 rounded-lg ${tab === 'unanswered' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          Belum Terjawab
        </Link>
        <Link href="/forum?tab=popular" className={`px-3 py-1.5 rounded-lg ${tab === 'popular' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
          Terpopuler
        </Link>
      </div>

      {/* List Diskusi */}
      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {questions && questions.length > 0 ? (
          questions.map((q: any) => (
            <article key={q.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex items-start gap-4">
              <div className="text-center min-w-[50px] p-2 bg-slate-50 border rounded-xl shrink-0">
                <span className="block font-bold text-slate-800 text-xs sm:text-sm">{q.answers_count}</span>
                <span className="text-[10px] text-slate-400">jawaban</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/tanya/${q.id}`} className="font-bold text-slate-900 text-sm hover:text-blue-600 transition line-clamp-2">
                  {q.title}
                </Link>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-slate-400">
                  <span>Ditanyakan oleh {q.author?.display_name || 'Pelaksana'}</span>
                  {q.accepted_answer_id && (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold text-[10px]">
                      <CheckCircle2 className="h-3 w-3" /> Solusi Ditemukan
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">Belum ada pertanyaan pada kategori ini.</div>
        )}
      </div>
    </div>
  );
}

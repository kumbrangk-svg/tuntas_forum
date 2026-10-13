import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Plus, CheckCircle2 } from 'lucide-react';

// Mengambil daftar pertanyaan dan profil penulis secara aman tanpa join fkey kaku
async function fetchQuestions(supabase: any, tab: string, q?: string) {
  let query = supabase
    .from('questions')
    .select('id, author_id, title, status, answers_count, accepted_answer_id, created_at')
    .neq('status', 'hidden');

  if (q) query = query.ilike('title', `%${q}%`);
  if (tab === 'unanswered') query = query.eq('answers_count', 0);
  if (tab === 'popular') query = query.order('answers_count', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data: questions } = await query.limit(20);
  if (!questions || questions.length === 0) return [];

  const authorIds = Array.from(new Set(questions.map((item: any) => item.author_id).filter(Boolean)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name')
    .in('id', authorIds);

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
  return questions.map((item: any) => ({
    ...item,
    author: profileMap.get(item.author_id) || { display_name: 'Pelaksana' },
  }));
}

function ForumTabs({ currentTab }: { currentTab: string }) {
  const tabs = [
    { key: 'semua', label: 'Semua Diskusi' },
    { key: 'unanswered', label: 'Belum Terjawab' },
    { key: 'popular', label: 'Terpopuler' },
  ];
  return (
    <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={`/forum?tab=${t.key}`}
          className={`px-3 py-1.5 rounded-lg ${currentTab === t.key ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
        >
          {t.label}
        </Link>
      ))}
    </div>
  );
}

function QuestionCard({ q }: { q: any }) {
  return (
    <article className="p-4 sm:p-5 hover:bg-slate-50/70 transition flex items-start gap-4">
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
  );
}

export default async function ForumIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string }>;
}) {
  const { tab = 'semua', q } = await searchParams;
  const supabase = await createClient();
  const questions = await fetchQuestions(supabase, tab, q);

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

      <ForumTabs currentTab={tab} />

      <div className="bg-white border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden shadow-xs">
        {questions.length > 0 ? (
          questions.map((item: any) => <QuestionCard key={item.id} q={item} />)
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">Belum ada pertanyaan pada kategori ini.</div>
        )}
      </div>
    </div>
  );
}

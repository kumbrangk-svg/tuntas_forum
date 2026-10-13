import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { AnswerList } from '@/components/forum/AnswerList';
import { AnswerForm } from '@/components/forum/AnswerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mengambil data pertanyaan beserta profil penulisnya secara aman
async function getQuestion(supabase: any, id: string) {
  const { data: q } = await supabase
    .from('questions')
    .select('id, author_id, title, body_text, status, accepted_answer_id, answers_count, created_at')
    .eq('id', id)
    .maybeSingle();

  if (!q) return null;

  const { data: author } = await supabase
    .from('profiles')
    .select('display_name, unit_text')
    .eq('id', q.author_id)
    .maybeSingle();

  return { ...q, author: author || { display_name: 'Pelaksana', unit_text: null } };
}

// Mengambil seluruh jawaban beserta profil penjawab tanpa ketergantungan relasi FK PostgREST
async function getAnswers(supabase: any, questionId: string) {
  const { data: answers } = await supabase
    .from('answers')
    .select('id, author_id, content_text, rating_avg, rating_count, created_at')
    .eq('question_id', questionId)
    .order('created_at', { ascending: true });

  if (!answers || answers.length === 0) return [];

  const authorIds = Array.from(new Set(answers.map((a: any) => a.author_id)));
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, display_name, unit_text')
    .in('id', authorIds);

  const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

  return answers.map((a: any) => ({
    ...a,
    author: profileMap.get(a.author_id) || { display_name: 'Pelaksana', unit_text: null },
  }));
}

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const [currentUser, q, rawAnswers] = await Promise.all([
    getUser(),
    getQuestion(supabase, id),
    getAnswers(supabase, id),
  ]);

  if (!q) notFound();

  const isAsker = Boolean(currentUser && currentUser.id === q.author_id);
  const authorName = q.author?.display_name || 'Pelaksana';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <Link href="/forum" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Forum
      </Link>

      <article className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="text-xs text-slate-400 mb-2">
          Ditanyakan oleh <span className="font-semibold text-slate-700">{authorName}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{q.title}</h1>
        <div className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100 pt-4">
          {q.body_text}
        </div>
      </article>

      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Semua Jawaban ({rawAnswers.length})
        </h2>
        <AnswerList
          answers={rawAnswers}
          questionId={q.id}
          acceptedAnswerId={q.accepted_answer_id}
          isAsker={isAsker}
        />
      </div>

      <AnswerForm questionId={q.id} />
    </div>
  );
}

import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { AnswerList } from '@/components/forum/AnswerList';
import { AnswerForm } from '@/components/forum/AnswerForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function QuestionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const currentUser = await getUser();

  const { data: q } = await supabase
    .from('questions')
    .select(`
      id, author_id, title, body_text, status, accepted_answer_id, answers_count, created_at,
      author:profiles!questions_author_id_fkey(display_name, unit_text)
    `)
    .eq('id', id)
    .single();

  if (!q) notFound();

  const { data: rawAnswers } = await supabase
    .from('answers')
    .select(`
      id, author_id, content_text, rating_avg, rating_count, created_at,
      author:profiles!answers_author_id_fkey(display_name, unit_text)
    `)
    .eq('question_id', id)
    .order('created_at', { ascending: true });

  const isAsker = Boolean(currentUser && currentUser.id === q.author_id);
  
  // Tangani tipe author baik array maupun objek tunggal
  const authorData: any = Array.isArray(q.author) ? q.author[0] : q.author;
  const authorName = authorData?.display_name || 'Pelaksana';

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <Link href="/forum" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Forum
      </Link>

      {/* Konten Pertanyaan */}
      <article className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="text-xs text-slate-400 mb-2">
          Ditanyakan oleh <span className="font-semibold text-slate-700">{authorName}</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">{q.title}</h1>
        <div className="mt-4 text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line border-t pt-4">
          {q.body_text}
        </div>
      </article>

      {/* Daftar Jawaban */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-slate-900">
          Semua Jawaban ({rawAnswers?.length || 0})
        </h2>
        <AnswerList
          answers={rawAnswers || []}
          questionId={q.id}
          acceptedAnswerId={q.accepted_answer_id}
          isAsker={isAsker}
        />
      </div>

      {/* Form Tambah Jawaban */}
      <AnswerForm questionId={q.id} />
    </div>
  );
}

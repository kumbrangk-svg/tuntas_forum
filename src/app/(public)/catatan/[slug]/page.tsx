import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { CommentSection } from '@/components/note/CommentSection';
import { ReviewBadge } from '@/components/regulation/ReviewBadge';
import { RelatedQuestionsSidebar } from '@/components/note/RelatedQuestionsSidebar';
import Link from 'next/link';
import { Scale } from 'lucide-react';

export const revalidate = 60;

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const currentUser = await getUser();

  const { data: note } = await supabase
    .from('notes')
    .select(`
      id, author_id, title, summary, kind, content_text, sources, edit_mode, needs_review, created_at,
      author:profiles!notes_author_id_fkey(display_name, unit_text)
    `)
    .eq('slug', slug)
    .single();

  if (!note) notFound();

  // Ambil regulasi resmi terhubung
  const { data: regLinks } = await supabase
    .from('note_regulations')
    .select('regulation:regulations(id, type, number, year, title, status, url)')
    .eq('note_id', note.id);

  const regulations = regLinks?.map((r: any) => r.regulation) || [];
  const canResolve = Boolean(currentUser && currentUser.id === note.author_id);

  const { data: rawComments } = await supabase
    .from('comments')
    .select('id, body, created_at, author:profiles!comments_author_id_fkey(display_name)')
    .eq('target_id', note.id)
    .order('created_at', { ascending: false });

  return (
    <div className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Kolom Kiri Utama: Catatan & Komentar (8 Kolom di Desktop, Full di HP) */}
        <article className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-xs">
          {note.needs_review && <ReviewBadge noteId={note.id} canResolve={canResolve} />}

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-3">
            <span
              className={`px-2 py-0.5 rounded font-semibold uppercase text-[10px] ${
                note.kind === 'tugas' ? 'bg-blue-100 text-blue-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {note.kind}
            </span>
            <span>•</span>
            <span>Dibuat oleh {(note.author as any)?.display_name || 'Pelaksana Satker'}</span>
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-tight">
            {note.title}
          </h1>

          <div className="mt-4 p-3.5 sm:p-4 text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200/70 rounded-xl leading-relaxed">
            {note.summary}
          </div>

          {regulations.length > 0 && (
            <div className="mt-5 p-3.5 sm:p-4 bg-purple-50/60 border border-purple-200 rounded-xl">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2.5">
                <Scale className="h-4 w-4" />
                <span>Dasar Regulasi Terkait:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {regulations.map((r: any) => (
                  <Link
                    key={r.id}
                    href={`/regulasi/${r.id}`}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-xs hover:border-purple-400 transition"
                  >
                    <span className="font-semibold text-purple-700">
                      {r.type} {r.number}/{r.year}
                    </span>
                    <span
                      className={`text-[10px] px-1 rounded font-bold uppercase ${
                        r.status === 'berlaku'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      {r.status}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed whitespace-pre-line border-t border-slate-100 pt-6">
            {note.content_text}
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <CommentSection targetId={note.id} initialComments={(rawComments as any) || []} />
          </div>
        </article>

        {/* Kolom Kanan: Pertanyaan Relevan (Sticky hanya di Layar Desktop lg:) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20 space-y-5">
          <RelatedQuestionsSidebar noteTitle={note.title} noteKind={note.kind} />
        </aside>
      </div>
    </div>
  );
}

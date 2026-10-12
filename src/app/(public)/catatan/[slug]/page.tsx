import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/auth';
import { CommentSection } from '@/components/note/CommentSection';
import { ReviewBadge } from '@/components/regulation/ReviewBadge';
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

  // Ambil regulasi terhubung
  const { data: regLinks } = await supabase
    .from('note_regulations')
    .select('regulation:regulations(id, type, number, year, title, status, url)')
    .eq('note_id', note.id);

  const regulations = regLinks?.map((r: any) => r.regulation) || [];
  const canResolve = Boolean(currentUser && (currentUser.id === note.author_id));

  const { data: rawComments } = await supabase
    .from('comments')
    .select('id, body, created_at, author:profiles!comments_author_id_fkey(display_name)')
    .eq('target_id', note.id)
    .order('created_at', { ascending: false });

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {note.needs_review && <ReviewBadge noteId={note.id} canResolve={canResolve} />}

      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span className={`px-2 py-0.5 rounded font-medium uppercase ${note.kind === 'tugas' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
          {note.kind}
        </span>
        <span>•</span>
        <span>Dibuat oleh {(note.author as any)?.display_name}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{note.title}</h1>
      <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">{note.summary}</p>

      {/* Rujukan Regulasi Terkait */}
      {regulations.length > 0 && (
        <div className="mt-4 p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900 mb-2">
            <Scale className="h-4 w-4" />
            <span>Dasar Regulasi Resmi:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {regulations.map((r: any) => (
              <Link
                key={r.id}
                href={`/regulasi/${r.id}`}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-purple-200 rounded-lg text-xs hover:border-purple-400 transition"
              >
                <span className="font-semibold text-purple-700">{r.type} {r.number}/{r.year}</span>
                <span className={`text-[10px] px-1 rounded font-bold uppercase ${
                  r.status === 'berlaku' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {r.status}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line">
        {note.content_text}
      </div>

      <CommentSection targetId={note.id} initialComments={(rawComments as any) || []} />
    </article>
  );
}

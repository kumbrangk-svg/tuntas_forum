import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CommentSection } from '@/components/note/CommentSection';
import Link from 'next/link';

export const revalidate = 60; // ISR cache 60 detik

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: note } = await supabase
    .from('notes')
    .select(`
      id, title, summary, kind, content_text, sources, edit_mode, rating_avg, rating_count, created_at,
      author:profiles!notes_author_id_fkey(display_name, unit_text)
    `)
    .eq('slug', slug)
    .single();

  if (!note) notFound();

  const { data: rawComments } = await supabase
    .from('comments')
    .select('id, body, created_at, author:profiles!comments_author_id_fkey(display_name)')
    .eq('target_id', note.id)
    .order('created_at', { ascending: false });

  const comments = (rawComments as any) || [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: note.title,
    description: note.summary,
    author: { '@type': 'Person', name: (note.author as any)?.display_name || 'Pelaksana' },
    datePublished: note.created_at,
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
        <span className={`px-2 py-0.5 rounded font-medium uppercase ${note.kind === 'tugas' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
          {note.kind}
        </span>
        <span>•</span>
        <span>Dibuat oleh {(note.author as any)?.display_name}</span>
      </div>

      <h1 className="text-2xl font-bold text-slate-900">{note.title}</h1>
      <p className="mt-3 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border">{note.summary}</p>

      <div className="mt-6 prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-line">
        {note.content_text}
      </div>

      {Array.isArray(note.sources) && note.sources.length > 0 && (
        <div className="mt-8 p-4 bg-slate-50 rounded-lg border">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Dasar Hukum & Sumber</h4>
          <ul className="space-y-1">
            {note.sources.map((src: any, i: number) => (
              <li key={i} className="text-xs">
                <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  ↗ {src.title || src.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <CommentSection targetId={note.id} initialComments={comments} />
    </article>
  );
}

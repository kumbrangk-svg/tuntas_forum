import Link from 'next/link';
import { MessageSquare, ArrowUpRight, HelpCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export async function RelatedQuestionsSidebar({ noteTitle }: { noteTitle: string; noteKind?: string }) {
  const supabase = await createClient();

  // Ambil pertanyaan relevan atau terbaru dari tabel questions
  const { data: questions } = await supabase
    .from('questions')
    .select('id, title, body_text, answers_count')
    .neq('status', 'hidden')
    .order('created_at', { ascending: false })
    .limit(3);

  const list = questions && questions.length > 0 ? questions : [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Diskusi Terkait</h3>
        </div>
        <Link href="/forum" className="text-[11px] text-blue-600 hover:underline font-medium">Buka Forum</Link>
      </div>

      <div className="space-y-3.5">
        {list.map((q: any) => (
          <article key={q.id} className="group">
            <Link href={`/tanya/${q.id}`} className="text-xs font-semibold text-blue-700 group-hover:underline line-clamp-2 leading-snug">
              {q.title}
            </Link>
            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{q.body_text}</p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                <MessageSquare className="h-2.5 w-2.5" /> {q.answers_count} jawaban
              </span>
            </div>
          </article>
        ))}
      </div>

      <div className="pt-3 border-t border-slate-100">
        <Link href="/tanya-baru" className="flex items-center justify-between p-2.5 bg-blue-50/70 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold transition">
          <span>Punya kendala? Tanyakan di Forum</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

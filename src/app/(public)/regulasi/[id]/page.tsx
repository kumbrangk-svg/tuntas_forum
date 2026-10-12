import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { ExternalLink, ArrowLeft, BookOpen } from 'lucide-react';

export default async function RegulasiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: reg } = await supabase
    .from('regulations')
    .select('id, type, number, year, title, status, url, created_at')
    .eq('id', id)
    .single();

  if (!reg) notFound();

  // Ambil semua catatan yang merujuk regulasi ini
  const { data: noteLinks } = await supabase
    .from('note_regulations')
    .select('note:notes(id, title, slug, kind, needs_review, created_at)')
    .eq('regulation_id', id);

  const notes = noteLinks?.map((n: any) => n.note) || [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/regulasi" className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 mb-4">
        <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke Katalog Regulasi
      </Link>

      <div className="bg-white p-6 border rounded-2xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-extrabold text-purple-700 text-lg">
            {reg.type} Nomor {reg.number} Tahun {reg.year}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
            reg.status === 'berlaku' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            {reg.status}
          </span>
        </div>
        <h1 className="text-sm font-semibold text-slate-800 leading-relaxed mb-4">{reg.title}</h1>

        {reg.url && (
          <a
            href={reg.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
          >
            <span>Buka Tautan Sumber Regulasi</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Daftar Catatan Terkait */}
      <div className="mt-8">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <BookOpen className="h-4 w-4 text-blue-600" />
          Catatan & SOP yang Merujuk Regulasi Ini ({notes.length})
        </h2>

        <div className="space-y-2.5">
          {notes.length > 0 ? (
            notes.map((n: any) => (
              <Link
                key={n.id}
                href={`/catatan/${n.slug}`}
                className="p-3.5 bg-white border rounded-xl hover:border-blue-400 block transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    n.kind === 'tugas' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {n.kind}
                  </span>
                  {n.needs_review && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      Perlu Ditinjau
                    </span>
                  )}
                </div>
                <p className="text-xs font-semibold text-slate-800">{n.title}</p>
              </Link>
            ))
          ) : (
            <p className="text-xs text-slate-400 italic">Belum ada catatan yang merujuk regulasi ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}

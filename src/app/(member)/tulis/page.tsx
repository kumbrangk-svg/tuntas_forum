'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SourcesField, type SourceItem } from '@/components/editor/SourcesField';
import { NOTE_TEMPLATES, type NoteKind } from '@/lib/templates';
import { generateNoteSlug, extractTextFromContent } from '@/lib/note-utils';

export default function TulisCatatanPage() {
  const router = useRouter();
  const supabase = createClient();

  const [kind, setKind] = useState<NoteKind>('tugas');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [contentJson, setContentJson] = useState(NOTE_TEMPLATES.tugas.json);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [editMode, setEditMode] = useState<'suggest' | 'open' | 'locked'>('suggest');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKindChange = (newKind: NoteKind) => {
    setKind(newKind);
    setContentJson(NOTE_TEMPLATES[newKind].json);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/masuk');
      return;
    }

    const noteId = crypto.randomUUID();
    const slug = generateNoteSlug(title, noteId);
    const contentText = extractTextFromContent(contentJson as any);

    const { error } = await supabase.from('notes').insert({
      id: noteId,
      author_id: user.id,
      kind,
      title: title.trim(),
      slug,
      summary: summary.trim(),
      content_json: contentJson,
      content_text: contentText,
      sources,
      edit_mode: editMode,
      status: 'published',
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push(`/catatan/${slug}`);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-xl font-bold text-slate-900">Tulis Catatan Baru</h1>
      <p className="text-xs text-slate-500 mt-1">Bagikan alur kerja SOP atau penanganan kendala sistem APBN.</p>

      {errorMsg && <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg max-w-xs">
          <button
            type="button"
            onClick={() => handleKindChange('tugas')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${kind === 'tugas' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
          >
            Tugas / SOP
          </button>
          <button
            type="button"
            onClick={() => handleKindChange('masalah')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md ${kind === 'masalah' ? 'bg-white shadow text-blue-600' : 'text-slate-600'}`}
          >
            Masalah / Solusi
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Judul Catatan</label>
          <input
            type="text"
            required
            placeholder="Contoh: Tata Cara Rekonsiliasi Lapkeu BLU..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Ringkasan Singkat</label>
          <textarea
            required
            rows={2}
            placeholder="Inti dari panduan atau kendala ini..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Izin Kolaborasi Konten</label>
          <select
            value={editMode}
            onChange={(e) => setEditMode(e.target.value as any)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-xs bg-white"
          >
            <option value="suggest">Usul Edit (Perubahan butuh persetujuan Anda)</option>
            <option value="open">Terbuka (Komunitas terverifikasi bisa langsung memperbarui)</option>
            <option value="locked">Terkunci (Hanya Anda & Admin yang dapat mengedit)</option>
          </select>
        </div>

        <SourcesField sources={sources} onChange={setSources} />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-semibold transition"
        >
          {loading ? 'Menerbitkan...' : 'Terbitkan Catatan'}
        </button>
      </form>
    </div>
  );
}

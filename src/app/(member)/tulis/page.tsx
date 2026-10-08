'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { SourcesField, type SourceItem } from '@/components/editor/SourcesField';
import { generateNoteSlug } from '@/lib/note-utils';

type NoteKind = 'tugas' | 'masalah';

const DEFAULT_TEMPLATES: Record<NoteKind, string> = {
  tugas: `1. Tujuan & Ruang Lingkup:
- 

2. Dasar Hukum:
- 

3. Langkah Kerja:
- 

4. Output / Dokumen Hasil:
- `,
  masalah: `1. Gejala & Pesan Eror:
- 

2. Penyebab Masalah:
- 

3. Langkah Solusi / Penanganan:
- 

4. Pencegahan:
- `,
};

export default function TulisCatatanPage() {
  const router = useRouter();
  const supabase = createClient();

  const [kind, setKind] = useState<NoteKind>('tugas');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [bodyText, setBodyText] = useState(DEFAULT_TEMPLATES.tugas);
  const [sources, setSources] = useState<SourceItem[]>([]);
  const [editMode, setEditMode] = useState<'suggest' | 'open' | 'locked'>('suggest');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleKindChange = (newKind: NoteKind) => {
    setKind(newKind);
    setBodyText(DEFAULT_TEMPLATES[newKind]);
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

    const contentJson = {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: bodyText }] }],
    };

    const { error } = await supabase.from('notes').insert({
      id: noteId,
      author_id: user.id,
      kind,
      title: title.trim(),
      slug,
      summary: summary.trim(),
      content_json: contentJson,
      content_text: bodyText.trim(),
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
        <div className="flex gap-2 p-1 bg-slate-200 rounded-lg max-w-xs">
          <button
            type="button"
            onClick={() => handleKindChange('tugas')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              kind === 'tugas' ? 'bg-white shadow text-blue-600' : 'text-slate-600'
            }`}
          >
            Tugas / SOP
          </button>
          <button
            type="button"
            onClick={() => handleKindChange('masalah')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition ${
              kind === 'masalah' ? 'bg-white shadow text-blue-600' : 'text-slate-600'
            }`}
          >
            Masalah / Solusi
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Judul Catatan *</label>
          <input
            type="text"
            required
            placeholder="Contoh: Tata Cara Rekonsiliasi Lapkeu BLU..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Ringkasan Singkat *</label>
          <input
            type="text"
            required
            placeholder="Ringkasan 1-2 kalimat tentang catatan ini..."
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm bg-white"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-xs font-semibold text-slate-700">Isi Catatan / Panduan *</label>
            <button
              type="button"
              onClick={() => setBodyText('')}
              className="text-[11px] text-slate-400 hover:text-slate-600"
            >
              Kosongkan template
            </button>
          </div>
          <textarea
            required
            rows={10}
            placeholder="Ketik langkah, detail panduan, atau solusi lengkap di sini..."
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm font-mono leading-relaxed bg-white"
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
            <option value="open">Terbuka (Komunitas aktif bisa langsung mengedit)</option>
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

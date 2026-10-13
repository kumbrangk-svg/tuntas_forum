'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { HelpCircle, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';

function SimilarAlert({ items }: { items: any[] }) {
  if (items.length === 0) return null;
  return (
    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
      <div className="flex items-center gap-2 font-bold text-amber-900 mb-2">
        <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
        <span>Mungkin pertanyaan Anda sudah pernah diajukan sebelumnya:</span>
      </div>
      <div className="space-y-1.5 divide-y divide-amber-100">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/tanya/${item.id}`}
            target="_blank"
            className="pt-1.5 first:pt-0 flex items-center justify-between text-blue-700 hover:underline"
          >
            <span className="line-clamp-1">{item.title}</span>
            <span className="text-[10px] text-slate-400 shrink-0 ml-2">
              ({item.count_info || item.answers_count || 0} jawaban)
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function TanyaBaruPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [similarItems, setSimilarItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (title.trim().length < 8) { setSimilarItems([]); return; }
    const timer = setTimeout(async () => {
      try {
        const { data } = await supabase.rpc('suggest_similar', { p_title: title.trim() });
        if (Array.isArray(data)) setSimilarItems(data);
      } catch {
        // Abaikan eror pencarian saran serupa
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push('/masuk'); return; }

    const payload = {
      author_id: user.id,
      title: title.trim(),
      body_text: bodyText.trim(),
      body_json: {},
      status: 'open',
    };

    const { data, error } = await supabase
      .from('questions')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      setErrorMsg(error.message || 'Gagal menerbitkan pertanyaan.');
      setLoading(false);
      return;
    }

    router.refresh();
    router.push(`/tanya/${data.id}`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
          <HelpCircle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Ajukan Pertanyaan Baru</h1>
          <p className="text-xs text-slate-500">Diskusikan kendala APBN, aplikasi SAKTI/SPAN, atau regulasi satker.</p>
        </div>
      </div>

      {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 text-xs rounded-xl">{errorMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-slate-200 p-6 rounded-2xl shadow-xs">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Judul Pertanyaan *
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Bagaimana solusi jika status SP2D retur di bank operasional?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 border rounded-xl text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <SimilarAlert items={similarItems} />

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Rincian Kendala & Informasi Terkait *
          </label>
          <textarea
            required
            rows={7}
            placeholder="Jelaskan detail kendala, modul yang digunakan, pesan eror yang muncul, atau langkah yang sudah dicoba..."
            value={bodyText}
            onChange={(e) => setBodyText(e.target.value)}
            className="w-full px-3.5 py-2.5 border rounded-xl text-sm leading-relaxed bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          <span>{loading ? 'Mengirimkan...' : 'Terbitkan Pertanyaan'}</span>
        </button>
      </form>
    </div>
  );
}

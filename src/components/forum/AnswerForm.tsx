'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AnswerForm({ questionId }: { questionId: string }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const { error } = await supabase.rpc('create_answer', {
      p_question_id: questionId,
      p_content_text: content.trim(),
    });

    setLoading(false);
    if (error) {
      alert(error.message);
    } else {
      setContent('');
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleAnswerSubmit} className="bg-white border rounded-2xl p-5 shadow-xs space-y-3">
      <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Tulis Jawaban Anda</h3>
      <textarea
        required
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Berikan langkah penanganan atau saran solusi yang jelas..."
        className="w-full p-3 border rounded-xl text-xs sm:text-sm bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
      >
        {loading ? 'Mengirim...' : 'Kirim Jawaban'}
      </button>
    </form>
  );
}

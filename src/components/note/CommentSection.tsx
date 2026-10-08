'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  author: { display_name: string };
}

export function CommentSection({
  targetId,
  initialComments = [],
}: {
  targetId: string;
  initialComments: CommentItem[];
}) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Silakan masuk terlebih dahulu untuk memberi komentar.');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('comments')
      .insert({
        target_type: 'note',
        target_id: targetId,
        author_id: user.id,
        body: body.trim(),
      })
      .select('id, body, created_at')
      .single();

    if (!error && data) {
      setComments([{ ...data, author: { display_name: 'Anda' } }, ...comments]);
      setBody('');
    }
    setLoading(false);
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-sm font-bold text-slate-800">Komentar & Diskusi ({comments.length})</h3>

      <form onSubmit={handleSend} className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Tulis tanggapan atau masukan..."
          value={body}
          maxLength={2000}
          onChange={(e) => setBody(e.target.value)}
          className="flex-1 px-3 py-2 border rounded-md text-xs"
        />
        <button
          type="submit"
          disabled={loading || !body.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-xs font-semibold hover:bg-blue-700"
        >
          Kirim
        </button>
      </form>

      <div className="mt-4 space-y-3">
        {comments.map((item) => (
          <div key={item.id} className="p-3 bg-slate-50 rounded border text-xs">
            <div className="font-semibold text-slate-700">{item.author?.display_name || 'Pelaksana'}</div>
            <p className="mt-1 text-slate-600">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

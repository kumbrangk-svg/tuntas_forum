'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { EyeOff, CheckCircle } from 'lucide-react';

interface Props {
  reportId: string;
  targetType: string;
  targetId: string;
}

export function ModerationActions({ reportId, targetType, targetId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleModerate = async (action: 'hide' | 'restore') => {
    const reason = prompt('Masukkan alasan tindakan moderasi:');
    if (!reason) return;
    setLoading(true);

    const { error } = await supabase.rpc('moderate_content', {
      p_target_type: targetType,
      p_target_id: targetId,
      p_action: action,
      p_reason: reason,
    });

    if (error) {
      alert(error.message);
    } else {
      await supabase.from('reports').update({ status: 'handled' }).eq('id', reportId);
      router.refresh();
    }
    setLoading(false);
  };

  const handleDismiss = async () => {
    setLoading(true);
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2 shrink-0">
      <button
        onClick={() => handleModerate('hide')}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition"
      >
        <EyeOff className="h-3.5 w-3.5" />
        <span>Sembunyikan</span>
      </button>
      <button
        onClick={handleDismiss}
        disabled={loading}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
      >
        <CheckCircle className="h-3.5 w-3.5" />
        <span>Abaikan</span>
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

interface Props {
  noteId: string;
  canResolve: boolean;
}

export function ReviewBadge({ noteId, canResolve }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleResolve = async () => {
    if (!confirm('Tandai catatan ini sudah ditinjau dan disesuaikan dengan regulasi terbaru?')) return;
    setLoading(true);
    const { error } = await supabase.rpc('mark_note_reviewed', { p_note_id: noteId });
    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      router.refresh();
    }
  };

  return (
    <div className="mb-4 p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
        <div>
          <p className="text-xs font-bold leading-tight">Perlu Ditinjau (Dasar Hukum Telah Berubah / Dicabut)</p>
          <p className="text-[11px] text-amber-700 mt-0.5">
            Salah satu peraturan rujukan catatan ini telah berstatus diubah atau dicabut.
          </p>
        </div>
      </div>
      {canResolve && (
        <button
          onClick={handleResolve}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shrink-0 transition"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>{loading ? 'Menyimpan...' : 'Tandai Sudah Ditinjau'}</span>
        </button>
      )}
    </div>
  );
}

import { createClient } from '@/lib/supabase/server';
import { ModerationActions } from '@/components/admin/ModerationActions';
import { AlertTriangle } from 'lucide-react';

export default async function AdminModerasiPage() {
  const supabase = await createClient();

  const { data: reports } = await supabase
    .from('reports')
    .select(`
      id, target_type, target_id, reason, note, status, created_at,
      reporter:profiles!reports_reporter_id_fkey(display_name)
    `)
    .order('created_at', { ascending: false })
    .limit(30);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-100 text-rose-700 rounded-xl">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Antrean Moderasi Laporan</h1>
          <p className="text-xs text-slate-500">Tinjau laporan konten spam, data sensitif, atau informasi kedaluwarsa.</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 shadow-xs">
        {reports && reports.length > 0 ? (
          reports.map((r: any) => {
            const reporterData: any = Array.isArray(r.reporter) ? r.reporter[0] : r.reporter;
            return (
              <div key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-100 text-rose-700">
                      {r.reason}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Tipe: {r.target_type}</span>
                  </div>
                  <p className="text-xs text-slate-700">{r.note || 'Tidak ada catatan tambahan dari pelapor.'}</p>
                  <p className="text-[11px] text-slate-400">
                    Dilaporkan oleh: {reporterData?.display_name || 'Anonim'}
                  </p>
                </div>
                <ModerationActions reportId={r.id} targetType={r.target_type} targetId={r.target_id} />
              </div>
            );
          })
        ) : (
          <div className="p-12 text-center text-xs text-slate-400">Tidak ada antrean laporan baru saat ini.</div>
        )}
      </div>
    </div>
  );
}

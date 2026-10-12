import { createClient } from '@/lib/supabase/server';
import { Users, FileText, MessageSquare, AlertTriangle, Database } from 'lucide-react';

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: stats } = await supabase.rpc('admin_stats');

  const cards = [
    { label: 'Total Pengguna', value: stats?.total_users ?? 0, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Catatan Kerja', value: stats?.total_notes ?? 0, icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pertanyaan Forum', value: stats?.total_questions ?? 0, icon: MessageSquare, color: 'text-purple-600 bg-purple-50' },
    { label: 'Laporan Tertunda', value: stats?.pending_reports ?? 0, icon: AlertTriangle, color: 'text-rose-600 bg-rose-50' },
    { label: 'Ukuran Basis Data', value: `${stats?.db_size_mb ?? 0} MB`, icon: Database, color: 'text-amber-600 bg-amber-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900">Dasbor Administrator</h1>
        <p className="text-xs text-slate-500 mt-1">Metrik kesehatan sistem dan aktivitas platform APBN.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-500 font-medium">{c.label}</span>
                <div className={`p-2 rounded-xl ${c.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-xl font-extrabold text-slate-900">{c.value}</p>
            </div>
          );
        })}
      </div>

      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs">
        <h2 className="font-bold text-sm text-slate-800 mb-2">Peringatan Kapasitas Server</h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Ambang batas kuota gratis Supabase adalah 500 MB. Batas peringatan sistem diatur pada 400 MB.
          Saat ini penyimpanan database aman di angka <strong className="text-slate-800">{stats?.db_size_mb ?? 0} MB</strong>.
        </p>
      </div>
    </div>
  );
}

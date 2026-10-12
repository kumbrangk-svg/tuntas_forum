import { requireAdmin } from '@/lib/auth';
import Link from 'next/link';
import { Shield, Users, AlertTriangle, Settings, Database, ArrowLeft } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  const NAV = [
    { label: 'Dasbor & Metrik', href: '/admin', icon: Shield },
    { label: 'Antrean Moderasi', href: '/admin/moderasi', icon: AlertTriangle },
    { label: 'Pengguna & Admin', href: '/admin/pengguna', icon: Users },
    { label: 'Saklar Pengaturan', href: '/admin/pengaturan', icon: Settings },
    { label: 'Kapasitas Database', href: '/admin/kapasitas', icon: Database },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Khusus Admin */}
      <aside className="w-full md:w-64 bg-[#09111e] text-slate-300 p-5 shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 pb-5 border-b border-slate-800 mb-5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div>
              <h2 className="font-extrabold text-white text-sm">Panel Admin</h2>
              <p className="text-[10px] text-slate-400">TUNTAS Control Center</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/70 hover:text-white transition"
                >
                  <Icon className="h-4 w-4 text-slate-400" />
                  <span>{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </aside>

      {/* Konten Halaman Admin */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

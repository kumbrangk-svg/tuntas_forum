'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function OnboardingPage() {
  const [displayName, setDisplayName] = useState('');
  const [unitText, setUnitText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim(),
          unit_text: unitText.trim() || null,
          onboarded: true,
        })
        .eq('id', user.id);
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <h1 className="text-2xl font-bold text-center text-slate-900">Selamat Datang di TUNTAS!</h1>
      <p className="text-sm text-center text-slate-600 mt-1">Lengkapi info profil singkat Anda</p>

      <form onSubmit={handleComplete} className="mt-8 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Nama Tampilan / Inisial *</label>
          <input
            type="text"
            required
            placeholder="misal: Andi S atau Pelaksana_BLU"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">K/L atau Satker (Opsional)</label>
          <input
            type="text"
            placeholder="misal: Ditjen Pajak / Satker Kemenag"
            value={unitText}
            onChange={(e) => setUnitText(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !displayName.trim()}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
        >
          {loading ? 'Menyimpan...' : 'Mulai Menjelajah'}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function PengaturanPage() {
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [unitText, setUnitText] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        supabase
          .from('profiles')
          .select('display_name, bio, unit_text')
          .eq('id', user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setDisplayName(data.display_name || '');
              setBio(data.bio || '');
              setUnitText(data.unit_text || '');
            }
          });
      }
    });
  }, [supabase]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('profiles')
        .update({ display_name: displayName, bio, unit_text: unitText })
        .eq('id', user.id);
      setSaved(true);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <h1 className="text-xl font-bold text-slate-900">Pengaturan Profil</h1>
      <p className="text-xs text-slate-500 mt-1">Data Anda aman, tanpa NIP/NIK/HP sesuai standar TUNTAS.</p>

      {saved && <p className="mt-3 p-2 bg-green-50 text-green-700 text-xs rounded border border-green-200">Perubahan berhasil disimpan!</p>}

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Nama Tampilan</label>
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Satker / Instansi</label>
          <input
            type="text"
            value={unitText}
            onChange={(e) => setUnitText(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700">Bio Singkat</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
        >
          {loading ? 'Menyimpan...' : 'Simpan Profil'}
        </button>
      </form>
    </div>
  );
}

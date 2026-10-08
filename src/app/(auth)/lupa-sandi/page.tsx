'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LupaSandiPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/pengaturan`,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold text-center text-slate-900">Atur Ulang Sandi</h1>
      <p className="text-sm text-center text-slate-600 mt-1">Ketik email Anda untuk menerima instruksi</p>

      {sent ? (
        <div className="mt-6 text-center">
          <p className="text-sm text-green-700 bg-green-50 p-4 rounded border border-green-200">
            Tautan telah dikirim jika email terdaftar. Silakan periksa inbox atau spam.
          </p>
          <Link href="/masuk" className="mt-4 inline-block text-sm text-blue-600 hover:underline">
            Kembali ke Masuk
          </Link>
        </div>
      ) : (
        <form onSubmit={handleReset} className="mt-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-700">Email Terdaftar</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
          >
            {loading ? 'Mengirim...' : 'Kirim Tautan Atur Ulang'}
          </button>
          <p className="text-center text-xs text-slate-600">
            Ingat kata sandi?{' '}
            <Link href="/masuk" className="text-blue-600 hover:underline">Masuk</Link>
          </p>
        </form>
      )}
    </div>
  );
}

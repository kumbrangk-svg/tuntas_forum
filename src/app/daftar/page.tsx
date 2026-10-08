'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function DaftarPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-sm px-4 py-12 text-center">
        <h2 className="text-xl font-bold text-slate-800">Cek Email Anda</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tautan konfirmasi telah dikirimkan ke <b>{email}</b>. Buka tautan tersebut untuk mengaktifkan akun.
        </p>
        <Link href="/masuk" className="mt-6 inline-block text-sm font-medium text-blue-600 hover:underline">
          Kembali ke Masuk
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold text-center text-slate-900">Buat Akun TUNTAS</h1>
      <p className="text-sm text-center text-slate-600 mt-1">Komunitas basis pengetahuan APBN</p>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleRegister} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700">Email Instansi / Pribadi</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">Kata Sandi (min. 8 karakter)</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition"
        >
          {loading ? 'Mendaftarkan...' : 'Daftar Akun'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600">
        Sudah memiliki akun?{' '}
        <Link href="/masuk" className="text-blue-600 font-medium hover:underline">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}

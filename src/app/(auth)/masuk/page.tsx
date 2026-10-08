'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function MasukPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-12">
      <h1 className="text-2xl font-bold text-center text-slate-900">Masuk ke TUNTAS</h1>
      <p className="text-sm text-center text-slate-600 mt-1">Gunakan akun Anda untuk melanjutkan</p>

      {errorMsg && (
        <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {errorMsg}
        </div>
      )}

      <button
        onClick={handleGoogleLogin}
        className="w-full mt-6 py-2.5 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Masuk dengan Google
      </button>

      <div className="relative my-6 text-center text-xs text-slate-400">
        <span className="bg-white px-2 z-10 relative">atau via email</span>
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
      </div>

      <form onSubmit={handleEmailLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-700">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700">Kata Sandi</label>
          <input
            type="password"
            required
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
          {loading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-slate-600">
        Belum punya akun?{' '}
        <Link href="/daftar" className="text-blue-600 font-medium hover:underline">
          Daftar sekarang
        </Link>
      </p>
    </div>
  );
}

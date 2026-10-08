"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SearchBar({ defaultValue = "" }: { defaultValue?: string }) {
  const [query, setQuery] = useState(defaultValue);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/cari?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari SOP, SP2D, masalah SAKTI, regulasi..."
        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm"
      />
      <span className="absolute left-3 top-3 text-slate-400 text-sm">🔍</span>
      <button
        type="submit"
        className="absolute right-2 top-2 bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-emerald-800"
      >
        Cari
      </button>
    </form>
  );
}

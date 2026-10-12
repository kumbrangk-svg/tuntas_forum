'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Plus, X, Search, Check } from 'lucide-react';

export interface SelectedReg {
  id: string;
  type: string;
  number: string;
  year: number;
  title: string;
}

interface Props {
  selected: SelectedReg[];
  onChange: (regs: SelectedReg[]) => void;
}

export function RegulationPicker({ selected, onChange }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SelectedReg[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [newReg, setNewReg] = useState({ type: 'PMK', number: '', year: new Date().getFullYear(), title: '', url: '' });
  const supabase = createClient();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const timer = setTimeout(async () => {
      const { data } = await supabase
        .from('regulations')
        .select('id, type, number, year, title')
        .ilike('title', `%${query}%`)
        .limit(5);
      if (data) setResults(data as SelectedReg[]);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const addReg = (item: SelectedReg) => {
    if (!selected.some(r => r.id === item.id)) onChange([...selected, item]);
    setQuery('');
    setResults([]);
  };

  const removeReg = (id: string) => onChange(selected.filter(r => r.id !== id));

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data, error } = await supabase.from('regulations').insert(newReg).select().single();
    if (error) { alert(error.message); return; }
    if (data) { addReg(data as SelectedReg); setShowForm(false); }
  };

  return (
    <div className="space-y-3 pt-2">
      <label className="block text-xs font-semibold text-slate-700">Regulasi & Dasar Hukum Terkait</label>
      
      {/* List regulasi terpilih */}
      <div className="flex flex-wrap gap-2">
        {selected.map(r => (
          <span key={r.id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-xs">
            <span>{r.type} {r.number}/{r.year}</span>
            <button type="button" onClick={() => removeReg(r.id)}><X className="h-3 w-3 hover:text-red-600" /></button>
          </span>
        ))}
      </div>

      {/* Input Cari */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Cari regulasi (PMK, Perdirjen, UU)..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border rounded-md text-xs bg-white"
        />
        {results.length > 0 && (
          <div className="absolute z-20 left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg max-h-48 overflow-y-auto divide-y">
            {results.map(r => (
              <button
                type="button"
                key={r.id}
                onClick={() => addReg(r)}
                className="w-full text-left p-2.5 text-xs hover:bg-slate-50 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-800">{r.type} {r.number}/{r.year}</span>
                  <p className="text-slate-500 line-clamp-1">{r.title}</p>
                </div>
                <Check className="h-4 w-4 text-blue-600" />
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
      >
        <Plus className="h-3 w-3" /> Tambah regulasi baru bila belum ada di daftar
      </button>

      {/* Form ringkas tambah regulasi */}
      {showForm && (
        <div className="p-3 bg-slate-50 rounded-lg border space-y-2 text-xs">
          <div className="grid grid-cols-3 gap-2">
            <select
              value={newReg.type}
              onChange={e => setNewReg({ ...newReg, type: e.target.value })}
              className="border p-1.5 rounded bg-white text-xs"
            >
              <option value="PMK">PMK</option>
              <option value="Perdirjen">Perdirjen</option>
              <option value="UU">UU</option>
              <option value="PP">PP</option>
              <option value="KMK">KMK</option>
            </select>
            <input
              type="text"
              placeholder="Nomor (mis: 28)"
              value={newReg.number}
              onChange={e => setNewReg({ ...newReg, number: e.target.value })}
              className="border p-1.5 rounded bg-white text-xs"
              required
            />
            <input
              type="number"
              placeholder="Tahun"
              value={newReg.year}
              onChange={e => setNewReg({ ...newReg, year: parseInt(e.target.value) || 2026 })}
              className="border p-1.5 rounded bg-white text-xs"
              required
            />
          </div>
          <input
            type="text"
            placeholder="Judul regulasi lengkap..."
            value={newReg.title}
            onChange={e => setNewReg({ ...newReg, title: e.target.value })}
            className="w-full border p-1.5 rounded bg-white text-xs"
            required
          />
          <button
            type="button"
            onClick={handleCreateNew}
            className="px-3 py-1 bg-purple-600 text-white rounded font-semibold text-xs"
          >
            Simpan & Pilih Regulasi
          </button>
        </div>
      )}
    </div>
  );
}

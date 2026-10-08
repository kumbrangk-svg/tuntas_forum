'use client';

export interface SourceItem {
  title: string;
  url: string;
}

interface SourcesFieldProps {
  sources: SourceItem[];
  onChange: (sources: SourceItem[]) => void;
}

export function SourcesField({ sources, onChange }: SourcesFieldProps) {
  const addSource = () => {
    onChange([...sources, { title: '', url: '' }]);
  };

  const updateSource = (index: number, field: keyof SourceItem, value: string) => {
    const updated = [...sources];
    updated[index][field] = value;
    onChange(updated);
  };

  const removeSource = (index: number) => {
    onChange(sources.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">Sumber & Dasar Hukum Terkait</label>
        <button
          type="button"
          onClick={addSource}
          className="text-xs font-medium text-blue-600 hover:underline"
        >
          + Tambah Sumber
        </button>
      </div>

      {sources.map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Judul regulasi/sumber"
            value={item.title}
            onChange={(e) => updateSource(idx, 'title', e.target.value)}
            className="flex-1 px-3 py-1.5 border rounded text-xs"
          />
          <input
            type="url"
            placeholder="https://..."
            value={item.url}
            onChange={(e) => updateSource(idx, 'url', e.target.value)}
            className="flex-1 px-3 py-1.5 border rounded text-xs"
          />
          <button
            type="button"
            onClick={() => removeSource(idx)}
            className="text-red-500 hover:text-red-700 text-xs px-2"
          >
            Hapus
          </button>
        </div>
      ))}
    </div>
  );
}

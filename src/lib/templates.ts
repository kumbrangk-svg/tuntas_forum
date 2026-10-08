export type NoteKind = 'tugas' | 'masalah';

export const NOTE_TEMPLATES: Record<NoteKind, { title: string; json: object }> = {
  tugas: {
    title: 'Tata Cara [Nama Pekerjaan/SOP]',
    json: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '1. Tujuan & Ruang Lingkup' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Jelaskan tujuan pekerjaan dan unit terkait.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. Dasar Hukum & Ketentuan' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Sebutkan PMK, Perdirjen, atau surat edaran acuan.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '3. Aplikasi & Sistem Terkait' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Contoh: SAKTI, SPAN, SAS, MPN, OMSPAN.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '4. Langkah Kerja / Prosedur' }] },
        { type: 'orderedList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Langkah pertama...' }] }] },
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Langkah kedua...' }] }] }
        ]},
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '5. Output / Laporan Akhir' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Hasil akhir atau dokumen pertanggungjawaban.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '6. Kendala Umum & Solusi' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Hal yang sering salah dan cara mengatasinya.' }] },
      ],
    },
  },
  masalah: {
    title: 'Solusi Kendala: [Gejala Masalah/Kode Eror]',
    json: {
      type: 'doc',
      content: [
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '1. Gejala & Notifikasi Eror' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Pesan eror atau kondisi tidak sinkron yang terjadi.' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '2. Penyebab' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Faktor pemicu (validasi, selisih data, tanggal cut-off).' }] },
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '3. Langkah Penyelesaian (Solusi)' }] },
        { type: 'orderedList', content: [
          { type: 'listItem', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Langkah perbaikan...' }] }] }
        ]},
        { type: 'heading', attrs: { level: 2 }, content: [{ type: 'text', text: '4. Langkah Pencegahan' }] },
        { type: 'paragraph', content: [{ type: 'text', text: 'Tindakan agar tidak terulang pada periode berikutnya.' }] },
      ],
    },
  },
};

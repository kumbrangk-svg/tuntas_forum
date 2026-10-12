import Link from 'next/link';
import { MessageSquare, ArrowUpRight, HelpCircle } from 'lucide-react';

interface Props {
  noteTitle: string;
  noteKind: string;
}

export function RelatedQuestionsSidebar({ noteTitle, noteKind }: Props) {
  // Simulasi pertanyaan relevan bergaya snippet pencarian Google
  // (Akan otomatis mengambil data FTS dari tabel questions pada Tahap 5)
  const relatedQuestions = [
    {
      id: '1',
      title: 'Bagaimana perlakuan jurnal penyesuaian jika ada selisih di neraca?',
      snippet: 'Pada saat penyusunan laporan, sering terjadi selisih antara saldo buku besar dengan rincian...',
      tag: 'BLU',
      answers: 4,
    },
    {
      id: '2',
      title: 'Apakah format Berita Acara Rekonsiliasi wajib dilampirkan?',
      snippet: 'Mengacu pada aturan terbaru, apakah berkas verifikasi perlu upload dokumen fisik atau cukup digital...',
      tag: 'LaporanKeuangan',
      answers: 2,
    },
    {
      id: '3',
      title: 'Kendala validasi akun belanja transfer pada aplikasi SAKTI',
      snippet: 'Pesan eror muncul saat proses posting jurnal. Apakah ada langkah mitigasi sebelum tutup periode...',
      tag: 'SAKTI',
      answers: 5,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Kartu Pertanyaan Terkait */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Diskusi & Tanya-Jawab Terkait
            </h3>
          </div>
          <Link href="/forum" className="text-[11px] text-blue-600 hover:underline font-medium">
            Buka Forum
          </Link>
        </div>

        <div className="space-y-4">
          {relatedQuestions.map((q) => (
            <article key={q.id} className="group">
              {/* URL/Breadcrumb mini ala Google */}
              <div className="text-[10px] text-slate-400 flex items-center gap-1 mb-0.5">
                <span>forum</span>
                <span>›</span>
                <span className="text-blue-600">#{q.tag}</span>
              </div>

              {/* Judul Tautan ala Google Search */}
              <Link
                href="/forum"
                className="text-xs font-semibold text-blue-700 group-hover:underline line-clamp-2 leading-snug"
              >
                {q.title}
              </Link>

              {/* Snippet / Ringkasan Deskripsi */}
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {q.snippet}
              </p>

              {/* Meta Jawaban */}
              <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                <span className="inline-flex items-center gap-1 font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                  <MessageSquare className="h-2.5 w-2.5" />
                  {q.answers} jawaban
                </span>
                <span>• Solusi satker</span>
              </div>
            </article>
          ))}
        </div>

        {/* CTA Tanya Forum */}
        <div className="mt-5 pt-3.5 border-t border-slate-100">
          <Link
            href="/forum"
            className="flex items-center justify-between p-2.5 bg-blue-50/70 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-semibold transition"
          >
            <span>Punya kendala serupa? Tanyakan di Forum</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

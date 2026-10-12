import Link from "next/link";
import { MessageCircleQuestion, ArrowRight } from "lucide-react";

const QUESTIONS = [
  { id: "1", title: "Cara mengatasi selisih saldo pada Neraca BLU akhir tahun?", tag: "BLU", answers: 4 },
  { id: "2", title: "Perbedaan implementasi teknis Perdirjen 28 dan 56 di satker?", tag: "Regulasi", answers: 3 },
  { id: "3", title: "Format penyusunan LKBUN-D terbaru dan tata cara validasinya?", tag: "LKBUN", answers: 5 },
  { id: "4", title: "Bagaimana alur penyelesaian SPM retur di KPPN mitra?", tag: "SPM", answers: 2 },
];

export function PopularQuestionsSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base">💬</span>
            <h2 className="font-bold text-slate-900 text-sm">Pertanyaan Terpopuler</h2>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
            Forum Aktif
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="py-2.5 group first:pt-0 last:pb-0">
              <Link
                href="/forum"
                className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-2 transition leading-snug"
              >
                {q.title}
              </Link>
              <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium text-[10px]">
                  #{q.tag}
                </span>
                <span className="text-slate-400 ml-auto font-medium">
                  {q.answers} jawaban
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 mt-3 border-t border-slate-100">
        <Link
          href="/forum"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-xl text-xs font-semibold transition"
        >
          <span>Masuk ke Forum Diskusi</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

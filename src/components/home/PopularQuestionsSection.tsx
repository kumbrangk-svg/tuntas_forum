import Link from "next/link";

const QUESTIONS = [
  {
    id: "1",
    title: "Cara mengatasi selisih saldo pada Neraca BLU?",
    tag: "BLU",
    answers: 4,
  },
  {
    id: "2",
    title: "Perbedaan Perdirjen 28 dan 56?",
    tag: "Regulasi",
    answers: 3,
  },
  {
    id: "3",
    title: "Format terbaru LKBUN-D Tahun 2026?",
    tag: "LKBUN",
    answers: 5,
  },
];

export function PopularQuestionsSection() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <h2 className="font-bold text-slate-900 text-sm">Pertanyaan Terpopuler</h2>
          <Link href="/forum" className="text-xs text-blue-600 hover:underline font-medium">
            Lihat semua &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="group">
              <Link
                href="/forum"
                className="text-xs font-semibold text-slate-800 group-hover:text-blue-600 line-clamp-1"
              >
                {q.title}
              </Link>
              <div className="flex items-center gap-2 mt-1 text-[10px]">
                <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                  {q.tag}
                </span>
                <span className="text-slate-400">💬 {q.answers} jawaban</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

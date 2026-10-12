'use client';

import { useState } from 'react';
import { CheckCircle2, Star } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function AnswerList({ answers, questionId, acceptedAnswerId, isAsker }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleAcceptAndRate = async (answerId: string, stars: number) => {
    setLoadingId(answerId);
    const { error } = await supabase.rpc('accept_and_rate_answer', {
      p_question_id: questionId,
      p_answer_id: answerId,
      p_stars: stars,
    });
    setLoadingId(null);
    if (error) alert(error.message);
    else router.refresh();
  };

  return (
    <div className="space-y-3">
      {answers.map((a: any) => {
        const isAccepted = acceptedAnswerId === a.id;
        return (
          <div
            key={a.id}
            className={`p-5 rounded-2xl border bg-white shadow-xs ${
              isAccepted ? 'border-emerald-300 ring-2 ring-emerald-100 bg-emerald-50/20' : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-800">{a.author?.display_name || 'Pelaksana'}</span>
              {isAccepted && (
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full text-[10px] font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Solusi Diterima
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">{a.content_text}</p>

            {/* Aksi Penanya: Beri Rating & Pilih Jawaban Terbaik */}
            {isAsker && !isAccepted && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">Apakah jawaban ini membantu?</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleAcceptAndRate(a.id, star)}
                      disabled={loadingId === a.id}
                      className="p-1 text-amber-400 hover:scale-110 transition"
                      title={`Beri ${star} bintang & pilih sebagai solusi`}
                    >
                      <Star className="h-4 w-4 fill-amber-300" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

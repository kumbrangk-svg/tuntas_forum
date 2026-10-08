"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface StarRatingProps {
  noteId: string;
  initialAvg: number;
  initialCount: number;
  initialScore: number;
  userStars?: number | null;
  readOnly?: boolean;
}

export function StarRating({
  noteId,
  initialAvg,
  initialCount,
  initialScore,
  userStars = null,
  readOnly = false,
}: StarRatingProps) {
  const [stars, setStars] = useState(userStars || 0);
  const [avg, setAvg] = useState(initialAvg);
  const [count, setCount] = useState(initialCount);
  const [score, setScore] = useState(initialScore);
  const [loading, setLoading] = useState(false);

  const handleRate = async (val: number) => {
    if (readOnly || loading) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.rpc("rate_note", {
      p_note_id: noteId,
      p_stars: val,
    });
    setLoading(false);
    if (!error && data) {
      setStars(val);
      setAvg(data.rating_avg);
      setCount(data.rating_count);
      setScore(data.rating_score);
    }
  };

  return (
    <div className="flex flex-col gap-1 p-3 bg-slate-50 border rounded-lg text-sm">
      <div className="flex items-center gap-2">
        <div className="flex items-center text-amber-400">
          {[1, 2, 3, 4, 5].map((idx) => (
            <button
              key={idx}
              type="button"
              disabled={readOnly || loading}
              onClick={() => handleRate(idx)}
              className={`p-0.5 text-lg ${idx <= (stars || Math.round(avg)) ? "text-amber-500" : "text-slate-300"}`}
            >
              ★
            </button>
          ))}
        </div>
        <span className="font-semibold text-slate-800">{avg.toFixed(1)}</span>
        <span className="text-slate-500 text-xs">({count} ulasan)</span>
      </div>
      <p className="text-[11px] text-slate-400">Skor Kualitas Bayesian: {score.toFixed(2)} / 5.0</p>
    </div>
  );
}

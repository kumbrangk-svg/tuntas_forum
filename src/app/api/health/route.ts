import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  const start = Date.now();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.json(
      { status: "error", message: "Variabel lingkungan database belum diatur" },
      { status: 500 }
    );
  }

  try {
    const supabase = createClient(url, key);
    const { error } = await supabase.from("system_heartbeat").select("beat_at").limit(1);

    if (error) {
      return NextResponse.json(
        { status: "degraded", error: error.message, latencyMs: Date.now() - start },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        latencyMs: Date.now() - start,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    return NextResponse.json({ status: "down", error: message }, { status: 500 });
  }
}

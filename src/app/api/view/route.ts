import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const { noteId } = await req.json();
    if (!noteId) return NextResponse.json({ error: "noteId wajib" }, { status: 400 });

    const cookieStore = await cookies();
    const cookieName = `v_${noteId}`;
    if (cookieStore.get(cookieName)) {
      return NextResponse.json({ ok: true, cached: true });
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
    );

    await supabase.rpc("bump_note_view", { p_note_id: noteId });

    const response = NextResponse.json({ ok: true });
    response.cookies.set(cookieName, "1", {
      maxAge: 60 * 60 * 12, // 12 jam deduplikasi per browser
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

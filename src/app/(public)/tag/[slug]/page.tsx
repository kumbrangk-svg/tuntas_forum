import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function TagDetailPage({ params }: Props) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: tag } = await supabase.from("tags").select("*").eq("slug", slug).single();
  if (!tag) return notFound();

  const { data: notes } = await supabase.rpc("search_all", {
    p_q: "",
    p_tag_slug: slug,
    p_limit: 30,
  });

  return (
    <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="border-b pb-4">
        <span className="text-xs uppercase tracking-wider font-semibold text-emerald-700">Topik & Tag</span>
        <h1 className="text-2xl font-bold text-slate-900 mt-1">#{tag.name}</h1>
      </div>

      <div className="divide-y bg-white rounded-xl border border-slate-200">
        {!notes || notes.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">Belum ada catatan dengan tag ini.</p>
        ) : (
          notes.map((item: any) => (
            <article key={item.id} className="p-4 hover:bg-slate-50">
              <h2 className="font-semibold text-slate-900 text-base">
                <Link href={`/catatan/${item.slug}`} className="hover:text-emerald-700">
                  {item.title}
                </Link>
              </h2>
              <p className="text-sm text-slate-600 line-clamp-2 mt-1">{item.summary}</p>
            </article>
          ))
        )}
      </div>
    </main>
  );
}

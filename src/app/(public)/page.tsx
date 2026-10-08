import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { HomeHero } from "@/components/home/HomeHero";
import { QuickMenu } from "@/components/home/QuickMenu";
import { LatestNotesSection } from "@/components/home/LatestNotesSection";
import { PopularQuestionsSection } from "@/components/home/PopularQuestionsSection";
import { TrendingTagsSection } from "@/components/home/TrendingTagsSection";

export default async function HomePage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { data: latestNotes } = await supabase
    .from("notes")
    .select("id, title, slug, kind, created_at")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(5);

  const notes =
    latestNotes && latestNotes.length > 0
      ? latestNotes
      : [
          {
            id: "1",
            title: "Tata Cara Penyusunan Laporan Keuangan BLU",
            slug: "tata-cara-penyusunan-laporan-keuangan-blu",
            kind: "tugas" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Kendala Input Data SPAN di Satker",
            slug: "kendala-input-data-span-di-satker",
            kind: "masalah" as const,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <HomeHero />
      <QuickMenu />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <LatestNotesSection notes={notes} />
        <PopularQuestionsSection />
        <TrendingTagsSection />
      </div>
    </main>
  );
}

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
            title: "Tata Cara Penyusunan Laporan Keuangan BLU Triwulan",
            slug: "tata-cara-penyusunan-laporan-keuangan-blu",
            kind: "tugas" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "2",
            title: "Penyelesaian Selisih Kas dan Bank pada Rekonsiliasi SPAN",
            slug: "penyelesaian-selisih-kas-bank-rekonsiliasi-span",
            kind: "masalah" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "3",
            title: "Prosedur Pengajuan SPM Ganti Uang Persediaan (GUP)",
            slug: "prosedur-pengajuan-spm-gup",
            kind: "tugas" as const,
            created_at: new Date().toISOString(),
          },
          {
            id: "4",
            title: "Solusi Gagal Validasi Data Pegawai PPNPN di SAKTI",
            slug: "solusi-gagal-validasi-ppnpn-sakti",
            kind: "masalah" as const,
            created_at: new Date().toISOString(),
          },
        ];

  return (
    <main className="w-full max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <HomeHero />
      <QuickMenu />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
        <LatestNotesSection notes={notes} />
        <PopularQuestionsSection />
        <TrendingTagsSection />
      </div>
    </main>
  );
}

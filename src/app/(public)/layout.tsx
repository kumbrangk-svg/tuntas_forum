import { AppSidebar } from "@/components/layout/AppSidebar";
import { TopHeader } from "@/components/layout/TopHeader";
import { BottomNav } from "@/components/layout/BottomNav";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-6">
        <TopHeader />
        <main className="flex-1 w-full">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}

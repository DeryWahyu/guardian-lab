import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunityPageView } from "@/components/community/community-page-view";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Kasus Komunitas | Guardian Lab",
  description: "Pelajari temuan tersimpan yang telah melalui moderasi admin.",
};
async function CommunityContent() {
  const user = await requirePageUser();
  return <CommunityPageView scope={`${user.id}:${user.role}`} />;
}
export default function CommunityPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col text-slate-800">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Community Forensic Replay</h1>
        <Suspense fallback={<ResultSkeleton />}>
          <CommunityContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

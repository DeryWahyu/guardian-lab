import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunityCaseDetail } from "@/components/community/community-case-detail";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Detail Kasus Komunitas | Guardian Lab",
  description: "Snapshot pemeriksaan dan status moderasi kasus komunitas.",
};
async function CaseContent({ params }: { params: Promise<{ replayId: string }> }) {
  const user = await requirePageUser();
  const { replayId } = await params;
  return (
    <CommunityCaseDetail
      key={replayId}
      id={replayId}
      scope={`${user.id}:${user.role}`}
      admin={user.role === "ADMIN"}
    />
  );
}
export default function CommunityReplayPage({ params }: { params: Promise<{ replayId: string }> }) {
  return (
    <div className="bg-background flex min-h-screen flex-col text-slate-800">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <Suspense fallback={<ResultSkeleton />}>
          <CaseContent params={params} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

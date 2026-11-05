import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunityCaseDetail } from "@/components/community/community-case-detail";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
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
    <WorkspaceShell reading>
      <Suspense fallback={<ResultSkeleton />}>
        <CaseContent params={params} />
      </Suspense>
    </WorkspaceShell>
  );
}

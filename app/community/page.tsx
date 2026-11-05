import type { Metadata } from "next";
import { Suspense } from "react";
import { CommunityPageView } from "@/components/community/community-page-view";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
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
    <WorkspaceShell>
      <Suspense fallback={<ResultSkeleton />}>
        <CommunityContent />
      </Suspense>
    </WorkspaceShell>
  );
}

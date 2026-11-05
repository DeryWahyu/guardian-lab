import type { Metadata } from "next";
import { Suspense } from "react";
import { ActPageView } from "@/components/act/act-page-view";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Guardian Share Card | Guardian Lab",
  description: "Buat gambar dan pesan untuk keluarga dari hasil investigasi yang tersimpan.",
};

async function ActContent() {
  const user = await requirePageUser();
  return <ActPageView accessScope={`${user.id}:${user.role}`} />;
}

export default function ActPage() {
  return (
    <WorkspaceShell>
      <Suspense fallback={<ResultSkeleton />}>
        <ActContent />
      </Suspense>
    </WorkspaceShell>
  );
}

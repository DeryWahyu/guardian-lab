import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryDetailView } from "@/components/history/history-detail-view";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";

export const instant = false;
export const metadata: Metadata = {
  title: "Detail Investigasi | Guardian Lab",
  description: "Lihat rekaman, status proses, dan bukti pemeriksaan investigasi.",
};

interface HistoryDetailPageProps {
  params: Promise<{ id: string }>;
}

async function HistoryDetailContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await requirePageUser();
  return <HistoryDetailView recordId={id} accessScope={`${user.id}:${user.role}`} />;
}

export default function HistoryDetailPage({ params }: HistoryDetailPageProps) {
  return (
    <WorkspaceShell reading>
      <Suspense
        fallback={
          <div className="flex h-96 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-slate-400">
            Memuat detail laporan forensik...
          </div>
        }
      >
        <HistoryDetailContent params={params} />
      </Suspense>
    </WorkspaceShell>
  );
}

"use client";
import Link from "next/link";
import { InvestigationView } from "@/components/shared/investigation-view";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import { PROTECTED_ROUTES } from "@/lib/routes";

export function HistoryDetailView({
  recordId,
  accessScope,
}: {
  recordId: string;
  accessScope?: string;
}) {
  return (
    <div className="space-y-6">
      <WorkspaceStage
        compact
        title="Baca bukti, pahami konteksnya."
        description="Status dan temuan di bawah berasal dari rekaman pemeriksaanmu. Pilih mode yang paling nyaman untuk membacanya."
        pose="evidence"
      />
      <Link
        href={PROTECTED_ROUTES.history}
        className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
      >
        &larr; Kembali ke riwayat
      </Link>
      <InvestigationView id={recordId} scope={accessScope} presentation="workspace" />
    </div>
  );
}

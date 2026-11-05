import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryDashboardView } from "@/components/history/history-dashboard-view";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Riwayat Investigasi | Guardian Lab",
  description: "Status dan hasil investigasi URL, QR, serta APK yang tersimpan.",
};

async function HistoryContent() {
  const user = await requirePageUser();
  return <HistoryDashboardView accessScope={`${user.id}:${user.role}`} />;
}

export default function HistoryPage() {
  return (
    <WorkspaceShell>
      <Suspense
        fallback={
          <div className="flex h-80 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-400">
            Memuat riwayat forensik...
          </div>
        }
      >
        <HistoryContent />
      </Suspense>
    </WorkspaceShell>
  );
}

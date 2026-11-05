"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useMemo, useRef } from "react";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { InvestigationProblem } from "@/components/shared/investigation-problem";
import { InvestigationStatusPanel } from "@/components/shared/investigation-status-panel";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import workspace from "@/components/workspace/workspace.module.css";
import { useInvestigation } from "@/lib/hooks/use-investigation";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { buildShareCard, type ShareCardData } from "@/lib/share-card/content";
import { ShareCardActions } from "./share-card-actions";
import { ShareCardCanvas } from "./share-card-canvas";

const PreparedCard = memo(
  function PreparedCard({ card }: { card: ShareCardData }) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    return (
      <div className={workspace.shareLayout}>
        <div className="min-w-0">
          <ShareCardCanvas card={card} />
        </div>
        <div className={workspace.panel}>
          <h2 className={workspace.panelTitle}>Siap mengingatkan orang terdekat?</h2>
          <p className={`${workspace.muted} mt-2 mb-5`}>
            Periksa isi kartu, lalu pilih cara membagikannya.
          </p>
          <ShareCardActions cardRef={cardRef} card={card} />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-0 -left-[10000px] w-[600px]"
        >
          <ShareCardCanvas card={card} cardRef={cardRef} />
        </div>
      </div>
    );
  },
  (previous, next) => previous.card.text === next.card.text,
);

export function ActPageView({ accessScope }: { accessScope: string }) {
  const params = useSearchParams();
  const id = params.get("id");
  const { record, loading, refreshing, problem, retry } = useInvestigation(id, accessScope);
  const card = useMemo(() => (record ? buildShareCard(record) : null), [record]);
  if (loading) return <ResultSkeleton />;
  if (problem)
    return (
      <InvestigationProblem
        presentation="workspace"
        problem={problem}
        onRetry={retry}
        id={id ?? undefined}
      />
    );
  return (
    <div className="space-y-6">
      <WorkspaceStage
        title="Bukti yang jelas, pesan yang berarti."
        description="Ubah hasil investigasi lengkap menjadi kartu yang mudah dibaca keluarga dan teman. Kamu menentukan kapan dan ke mana kartu dibagikan."
        pose="share"
        compact={Boolean(card)}
      >
        {!card && (
          <div className="space-y-4">
            {!record && (
              <p className={workspace.muted}>
                Pilih hasil investigasi lengkap dari riwayat, lalu buka Buat Guardian Share Card.
              </p>
            )}
            <Link href={PROTECTED_ROUTES.history} className={workspace.primary}>
              Pilih hasil dari riwayat
            </Link>
          </div>
        )}
      </WorkspaceStage>
      {record && !card && (
        <>
          <InvestigationStatusPanel record={record} presentation="workspace" />
          <p className="text-center text-sm text-slate-600">
            Kartu baru dapat dibuat setelah hasil analisis lengkap tersedia.
          </p>
          <button
            type="button"
            onClick={retry}
            disabled={refreshing}
            className="mx-auto block rounded-full border border-slate-300 bg-white px-4 py-2 text-sm disabled:opacity-50"
          >
            {refreshing ? "Memperbarui status…" : "Perbarui status"}
          </button>
        </>
      )}
      {card && (
        <PreparedCard key={`${accessScope}:${record?.id}:${record?.updatedAt}`} card={card} />
      )}
      {record && (
        <div className="text-center">
          {card && (
            <Link
              href={PROTECTED_ROUTES.communitySubmit(card.id)}
              className="mr-3 inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
            >
              Ajukan ke komunitas
            </Link>
          )}
          <Link
            href={card ? PROTECTED_ROUTES.historyDetail(card.id) : PROTECTED_ROUTES.history}
            className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700"
          >
            {card ? "Kembali ke hasil investigasi" : "Buka riwayat investigasi"}
          </Link>
        </div>
      )}
    </div>
  );
}

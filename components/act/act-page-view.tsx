"use client";

import { FileImage } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { memo, useMemo, useRef } from "react";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { InvestigationProblem } from "@/components/shared/investigation-problem";
import { InvestigationStatusPanel } from "@/components/shared/investigation-status-panel";
import { useInvestigation } from "@/lib/hooks/use-investigation";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { buildShareCard, type ShareCardData } from "@/lib/share-card/content";
import { ShareCardActions } from "./share-card-actions";
import { ShareCardCanvas } from "./share-card-canvas";

const PreparedCard = memo(
  function PreparedCard({ card }: { card: ShareCardData }) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    return (
      <div className="mx-auto max-w-[600px] space-y-6">
        <ShareCardCanvas card={card} />
        <ShareCardActions cardRef={cardRef} card={card} />
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
    return <InvestigationProblem problem={problem} onRetry={retry} id={id ?? undefined} />;
  return (
    <div className="space-y-6">
      {record && !card && (
        <>
          <InvestigationStatusPanel record={record} />
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
      {!record && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-8 text-center">
          <FileImage className="mx-auto size-9 text-slate-400" aria-hidden="true" />
          <h2 className="text-lg font-bold text-slate-900">
            Pilih hasil investigasi terlebih dahulu
          </h2>
          <p className="text-sm text-slate-600">
            Buka hasil yang sudah selesai di riwayat, lalu pilih Buat Guardian Share Card.
          </p>
        </div>
      )}
      {card && (
        <PreparedCard key={`${accessScope}:${record?.id}:${record?.updatedAt}`} card={card} />
      )}
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
    </div>
  );
}

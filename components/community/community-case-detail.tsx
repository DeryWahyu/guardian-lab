"use client";
import Link from "next/link";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { InvestigationProblem } from "@/components/shared/investigation-problem";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import { useApiResource } from "@/lib/hooks/use-api-resource";
import { ADMIN_ROUTES, API_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";
import { communityCaseSchema } from "@/lib/validations/community";
import { investigationIdSchema } from "@/lib/validations/investigation";
import { CommunityChallengeView } from "./community-challenge-view";
import { CommunityReportView } from "./community-report-view";
import { CommunityReviewForm } from "./community-review-form";
import { COMMUNITY_STATUS_LABELS } from "./community-status";

export function CommunityCaseDetail({
  id,
  scope,
  admin,
}: {
  id: string;
  scope: string;
  admin: boolean;
}) {
  const resource = useApiResource(
    investigationIdSchema.safeParse(id).success ? API_ROUTES.communityReplay(id) : null,
    communityCaseSchema,
    { scope },
  );
  if (resource.loading) return <ResultSkeleton />;
  if (resource.problem)
    return (
      <InvestigationProblem
        presentation="workspace"
        problem={resource.problem}
        onRetry={resource.retry}
      />
    );
  const record = resource.data;
  if (!record)
    return (
      <div className="space-y-3 rounded-xl border bg-white p-6">
        <p>Studi kasus tidak ditemukan.</p>
        <Link href={PROTECTED_ROUTES.community} className="underline">
          Kembali ke komunitas
        </Link>
      </div>
    );
  return (
    <div className="space-y-5">
      <Link
        href={admin ? ADMIN_ROUTES.communityReviews : PROTECTED_ROUTES.community}
        className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm"
      >
        Kembali ke {admin ? "antrean moderasi" : "komunitas"}
      </Link>
      <WorkspaceStage
        title={record.title}
        description="Baca snapshot bukti yang telah disaring, lalu uji pemahamanmu berdasarkan temuan yang tersedia."
        pose="evidence"
        compact
      >
        <p className="text-xs font-semibold text-slate-500">
          {COMMUNITY_STATUS_LABELS[record.status]}
        </p>
        <p className="text-xs text-slate-500">ID kasus: {record.id} · Pengaju anonim</p>
        {record.adminNotes && (
          <p className="rounded-xl bg-slate-50 p-3 text-sm">Catatan admin: {record.adminNotes}</p>
        )}
        {record.sourceRecordId && (
          <Link
            href={PROTECTED_ROUTES.historyDetail(record.sourceRecordId)}
            className="inline-flex text-sm underline"
          >
            Buka investigasi sumber
          </Link>
        )}
      </WorkspaceStage>
      {record.report ? (
        <CommunityReportView report={record.report} />
      ) : (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm">
          Snapshot kasus lama belum memenuhi kontrak hasil tersimpan. Kasus ini tidak dapat
          diterbitkan.
        </p>
      )}
      {record.canReview && (
        <CommunityReviewForm
          key={`${record.id}:${record.status}`}
          record={record}
          onDone={resource.retry}
        />
      )}
      {record.canPractice && (
        <CommunityChallengeView key={`${scope}:${record.id}`} id={record.id} scope={scope} />
      )}
      <button
        type="button"
        onClick={resource.retry}
        disabled={resource.refreshing}
        className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm"
      >
        {resource.refreshing ? "Memperbarui…" : "Perbarui status kasus"}
      </button>
    </div>
  );
}

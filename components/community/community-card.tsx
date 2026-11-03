import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import type { CommunityCase } from "@/lib/validations/community";
import { COMMUNITY_STATUS_LABELS } from "./community-status";

export function CommunityCard({ item }: { item: CommunityCase }) {
  return (
    <article className="flex min-w-0 flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 [overflow-wrap:anywhere]">
      <p className="text-xs font-semibold text-slate-500">
        {item.report?.type ?? "Kasus lama"} · {COMMUNITY_STATUS_LABELS[item.status]}
      </p>
      <h2 className="text-lg font-bold text-slate-900">{item.title}</h2>
      <p className="line-clamp-3 text-sm text-slate-600">{item.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs text-slate-500">Pengaju anonim</span>
        <Link
          href={PROTECTED_ROUTES.communityReplay(item.id)}
          className="inline-flex min-h-11 items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold"
        >
          Lihat kasus
        </Link>
      </div>
    </article>
  );
}

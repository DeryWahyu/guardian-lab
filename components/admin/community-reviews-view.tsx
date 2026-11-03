"use client";
import { CommunityCasesView } from "@/components/community/community-cases-view";

export function CommunityReviewsView({ scope }: { scope: string }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-slate-900">Moderasi kasus komunitas</h1>
        <p className="text-sm text-slate-600">
          Buka snapshot untuk memeriksa bukti dan privasi, lalu simpan keputusan. Pengajuan sendiri
          memerlukan admin lain.
        </p>
      </div>
      <CommunityCasesView scope={scope} admin />
    </div>
  );
}

"use client";
import Link from "next/link";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import workspace from "@/components/workspace/workspace.module.css";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { CommunityCasesView } from "./community-cases-view";

export function CommunityPageView({ scope }: { scope: string }) {
  return (
    <div className="space-y-5">
      <WorkspaceStage
        title="Belajar dari kasus, saling menjaga."
        description="Telusuri bukti dari kasus yang sudah ditinjau. Latih pemahamanmu atau ajukan hasil lengkap untuk membantu Guardian lain."
        pose="community"
        tone="lavender"
      >
        <div className={workspace.actions}>
          <Link href={PROTECTED_ROUTES.history} className={workspace.primary}>
            Ajukan dari riwayat
          </Link>
          <Link href={PROTECTED_ROUTES.leaderboard} className={workspace.secondary}>
            Lihat peringkat belajar Guardian
          </Link>
        </div>
      </WorkspaceStage>
      <CommunityCasesView scope={scope} />
    </div>
  );
}

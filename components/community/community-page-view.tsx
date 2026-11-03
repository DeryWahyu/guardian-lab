"use client";
import Link from "next/link";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { CommunityCasesView } from "./community-cases-view";

export function CommunityPageView({ scope }: { scope: string }) {
  return (
    <div className="space-y-5">
      <Link
        href={PROTECTED_ROUTES.leaderboard}
        className="inline-flex min-h-11 items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm"
      >
        Lihat peringkat belajar Guardian
      </Link>
      <CommunityCasesView scope={scope} />
    </div>
  );
}

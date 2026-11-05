import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { LeaderboardView } from "@/components/community/leaderboard-view";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Peringkat Guardian",
  description: "Peringkat belajar berdasarkan EXP akun Guardian.",
};
async function Content() {
  const user = await requirePageUser();
  return <LeaderboardView scope={`${user.id}:${user.role}`} />;
}
export default function Page() {
  return (
    <WorkspaceShell>
      <Suspense fallback={<LearningSkeleton presentation="workspace" />}>
        <Content />
      </Suspense>
    </WorkspaceShell>
  );
}

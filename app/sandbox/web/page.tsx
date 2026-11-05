import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { WebSandboxView } from "@/components/sandbox/web-sandbox-view";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Sandbox Web - Guardian Lab",
  description: "Buka tautan publik di browser server terisolasi dengan batas sesi 180 detik.",
};
async function Content() {
  const user = await requirePageUser();
  return <WebSandboxView scope={`${user.id}:${user.role}`} />;
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

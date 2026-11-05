import { Suspense } from "react";
import { AcademyPageView } from "@/components/academy/academy-page-view";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Guardian Academy",
  description: "Latihan mengenali ancaman digital dan progres belajar akunmu.",
};
async function Content() {
  const user = await requirePageUser();
  return <AcademyPageView scope={`${user.id}:${user.role}`} />;
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

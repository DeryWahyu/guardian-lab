import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { QuizLessonView } from "@/components/academy/quiz-lesson-view";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";
export const metadata = {
  title: "Latihan Academy",
  description: "Kerjakan kuis Guardian Academy dan pelajari pembahasannya.",
};
async function Content({ params }: { params: Promise<{ id: string }> }) {
  const [user, { id }] = await Promise.all([requirePageUser(), params]);
  return <QuizLessonView key={user.id + id} id={id} scope={`${user.id}:${user.role}`} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <WorkspaceShell reading>
      <Suspense fallback={<LearningSkeleton presentation="workspace" />}>
        <Content params={params} />
      </Suspense>
    </WorkspaceShell>
  );
}

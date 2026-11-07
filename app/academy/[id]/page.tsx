import { Suspense } from "react";
import { AcademySkeleton } from "@/components/academy/academy-page-state";
import styles from "@/components/academy/academy.module.css";
import { QuizLessonView } from "@/components/academy/quiz-lesson-view";
import { landingTypography } from "@/components/landing/landing-font";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { requirePageUser } from "@/lib/auth/page-access";
import { cn } from "@/lib/utils";
export const metadata = {
  title: "Latihan | Guardian Academy",
  description: "Kerjakan kuis Guardian Academy dan pelajari pembahasannya.",
};
async function Content({ params }: { params: Promise<{ id: string }> }) {
  const [user, { id }] = await Promise.all([requirePageUser(), params]);
  return <QuizLessonView key={user.id + id} id={id} scope={`${user.id}:${user.role}`} />;
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <WorkspaceShell
      reading
      className={cn(landingTypography, styles.page)}
      dialogClassName={landingTypography}
    >
      <Suspense fallback={<AcademySkeleton lesson />}>
        <Content params={params} />
      </Suspense>
    </WorkspaceShell>
  );
}

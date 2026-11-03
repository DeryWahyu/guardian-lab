import { Suspense } from "react";
import { CommunitySubmissionView } from "@/components/community/community-submission-view";
import { ResultSkeleton } from "@/components/landing/results/result-skeleton";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata = {
  title: "Ajukan Kasus | Guardian Lab",
  description: "Tinjau dan ajukan snapshot investigasi untuk moderasi komunitas.",
};
async function SubmissionContent() {
  const user = await requirePageUser();
  return <CommunitySubmissionView scope={`${user.id}:${user.role}`} />;
}
export default function SubmissionPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col text-slate-800">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">Ajukan kasus ke komunitas</h1>
        <Suspense fallback={<ResultSkeleton />}>
          <SubmissionContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

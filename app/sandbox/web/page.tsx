import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { WebSandboxView } from "@/components/sandbox/web-sandbox-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
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
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold">Sandbox web</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Periksa isi tautan melalui browser Chromium pada server. Setiap sesi memiliki batas
            waktu dan container tersendiri.
          </p>
        </div>
        <Suspense fallback={<LearningSkeleton />}>
          <Content />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

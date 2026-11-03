import { Suspense } from "react";
import { LearningSkeleton } from "@/components/academy/learning-ui";
import { AndroidEmulatorView } from "@/components/sandbox/android-emulator-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
export const metadata = {
  title: "Sandbox Android - Guardian Lab",
  description: "Ketersediaan eksekusi Android dan akses bedah APK statis.",
};
export default function Page() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-semibold">Sandbox Android</h1>
        <Suspense fallback={<LearningSkeleton />}>
          <AndroidEmulatorView />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

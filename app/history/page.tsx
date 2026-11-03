import type { Metadata } from "next";
import { Suspense } from "react";
import { HistoryDashboardView } from "@/components/history/history-dashboard-view";
import { Footer } from "@/components/shared/footer";
import { Header } from "@/components/shared/header";
import { requirePageUser } from "@/lib/auth/page-access";

export const metadata: Metadata = {
  title: "Riwayat Investigasi | Guardian Lab",
  description: "Status dan hasil investigasi URL, QR, serta APK yang tersimpan.",
};

async function HistoryContent() {
  const user = await requirePageUser();
  return <HistoryDashboardView accessScope={`${user.id}:${user.role}`} />;
}

export default function HistoryPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col text-slate-800">
      <Header />

      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-8 sm:px-6">
        <div>
          <span className="text-brand-600 text-xs font-bold tracking-widest uppercase">
            Pilar Recognize & Protect — Modul 7
          </span>
          <h1 className="mt-1 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Riwayat Detail Forensik
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Rekam jejak investigasi ancaman siber, bukti telemetri, dan snapshot analisis yang
            tersimpan aman di database.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="flex h-80 w-full animate-pulse items-center justify-center rounded-3xl border border-slate-200 bg-white text-sm text-slate-400">
              Memuat riwayat forensik...
            </div>
          }
        >
          <HistoryContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

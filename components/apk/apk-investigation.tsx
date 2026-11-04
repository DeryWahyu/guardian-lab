"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AuthGateModal } from "@/components/landing/auth-gate-modal";
import { ResultPresenter } from "@/components/landing/results/result-presenter";
import { InvestigationRequestFeedback } from "@/components/shared/investigation-request-feedback";
import { InvestigationUploadField } from "@/components/shared/investigation-upload-field";
import { InvestigationView } from "@/components/shared/investigation-view";
import type { UserSession } from "@/lib/auth/session";
import { useInvestigationFiles } from "@/lib/hooks/use-investigation-files";
import { useInvestigationSubmit } from "@/lib/hooks/use-investigation-submit";
import { API_ROUTES, PROTECTED_ROUTES } from "@/lib/routes";

export function ApkInvestigation({ user }: { user: UserSession }) {
  const params = useSearchParams();
  const recordId = params.get("investigation");
  const [authOpen, setAuthOpen] = useState(false);
  const resultRef = useRef<HTMLElement>(null);
  const files = useInvestigationFiles();
  const mutation = useInvestigationSubmit(
    {
      currentUser: user,
      onAnalysisStart: clearResult,
      onAnalysisSuccess: (record) => {
        window.history.pushState(
          null,
          "",
          PROTECTED_ROUTES.apkWithInvestigation(
            record.id,
            new URLSearchParams(window.location.search).get("mode") === "geek" ? "geek" : undefined,
          ),
        );
      },
    },
    () => setAuthOpen(true),
  );

  function clearResult() {
    const next = new URLSearchParams(window.location.search);
    next.delete("investigation");
    window.history.replaceState(null, "", `${PROTECTED_ROUTES.apk}${next.size ? `?${next}` : ""}`);
  }
  function inputChanged() {
    mutation.resetFeedback();
    clearResult();
  }
  function submit() {
    if (mutation.isLoading) return;
    if (!files.apkFile) {
      files.selectFiles("apk", []);
      return;
    }
    const body = new FormData();
    body.set("file", files.apkFile);
    mutation.submit(API_ROUTES.analyzeApk, body, files.apkFile.name);
  }
  useEffect(() => {
    if (!recordId && !mutation.isLoading && !mutation.requestError) return;
    const timer = setTimeout(
      () =>
        resultRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        }),
      100,
    );
    return () => clearTimeout(timer);
  }, [recordId, mutation.isLoading, mutation.requestError]);

  const returnTo = recordId
    ? PROTECTED_ROUTES.apkWithInvestigation(
        recordId,
        params.get("mode") === "geek" ? "geek" : undefined,
      )
    : PROTECTED_ROUTES.apkWithMode(params.get("mode") === "geek" ? "geek" : "human");
  return (
    <>
      <form
        noValidate
        aria-label="Pemeriksaan file APK"
        aria-busy={mutation.isLoading}
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="max-w-2xl rounded-3xl border border-slate-200 bg-white p-5 shadow-xs sm:p-7"
      >
        <InvestigationUploadField
          type="apk"
          file={files.apkFile}
          error={files.errors.apk}
          disabled={mutation.isLoading}
          onSelect={(selected) => {
            files.selectFiles("apk", selected);
            inputChanged();
          }}
          onClear={() => {
            files.clearFile("apk");
            inputChanged();
          }}
        />
        <InvestigationRequestFeedback
          error={mutation.requestError}
          uncertain={mutation.uncertain}
        />
        <button
          type="submit"
          disabled={mutation.isLoading || !files.apkFile}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-cyan-800 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {mutation.isLoading ? (
            <Loader2
              className="size-4 animate-spin motion-reduce:animate-none"
              aria-hidden="true"
            />
          ) : (
            <ArrowRight className="size-4" aria-hidden="true" />
          )}
          {mutation.isLoading ? "Memeriksa APK…" : "Periksa APK"}
        </button>
        <p className="mt-4 text-xs leading-relaxed text-slate-600">
          AI sedang disiapkan. Skor risiko belum tersedia; temuan statis yang berhasil diekstrak
          tetap ditampilkan.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          Jangan unggah berkas yang memuat data pribadi asli.
        </p>
        {mutation.isLoading && (
          <p role="status" className="mt-3 text-xs leading-relaxed text-slate-600">
            Proses dapat memerlukan waktu hingga sekitar satu menit. Tunggu hingga selesai dan
            jangan kirim ulang.
          </p>
        )}
      </form>
      {(recordId || mutation.isLoading || mutation.requestError) && (
        <section ref={resultRef} aria-label="Hasil pemeriksaan APK" className="scroll-mt-28">
          {mutation.isLoading || mutation.requestError ? (
            <ResultPresenter
              result={null}
              isLoading={mutation.isLoading}
              error={mutation.requestError}
            />
          ) : recordId ? (
            <InvestigationView
              id={recordId}
              scope={`${user.id}:${user.role}`}
              expectedType="APK"
              returnTo={returnTo}
            />
          ) : null}
        </section>
      )}
      <AuthGateModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        pendingType="apk"
        returnTo={returnTo}
      />
    </>
  );
}

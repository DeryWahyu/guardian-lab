"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { InvestigationView } from "@/components/shared/investigation-view";
import type { UserSession } from "@/lib/auth/session";
import { PUBLIC_ROUTES } from "@/lib/routes";
import type { Investigation } from "@/lib/validations/investigation";
import { AnalysisGateway } from "./analysis-gateway";
import { GatewaySkeleton } from "./gateway-skeleton";
import { HeroSection } from "./hero";
import { ResultPresenter } from "./results/result-presenter";

type Props = { initialUser?: UserSession | null };
function LandingInvestigationInner({ initialUser }: Props) {
  const params = useSearchParams();
  const recordId = params.get("investigation");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!recordId && !isAnalyzing && !analysisError) return;
    const timer = setTimeout(
      () =>
        resultsRef.current?.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
          block: "start",
        }),
      100,
    );
    return () => clearTimeout(timer);
  }, [recordId, isAnalyzing, analysisError]);
  function clearResult() {
    setAnalysisError(null);
    if (!params.has("investigation")) return;
    const next = new URLSearchParams(params.toString());
    next.delete("investigation");
    window.history.replaceState(
      null,
      "",
      next.size ? `${PUBLIC_ROUTES.home}?${next}` : PUBLIC_ROUTES.home,
    );
  }
  function start() {
    clearResult();
    setIsAnalyzing(true);
  }
  function success(record: Investigation) {
    setIsAnalyzing(false);
    setAnalysisError(null);
    const next = new URLSearchParams(params.toString());
    next.delete("target");
    next.delete("file");
    next.delete("evidence");
    next.set("investigation", record.id);
    next.set("tab", record.type.toLowerCase());
    window.history.pushState(null, "", `${PUBLIC_ROUTES.home}?${next}`);
  }
  function failure(message: string) {
    setIsAnalyzing(false);
    setAnalysisError(message);
  }
  return (
    <>
      <HeroSection>
        <AnalysisGateway
          currentUser={initialUser}
          onAnalysisStart={start}
          onAnalysisSuccess={success}
          onAnalysisError={failure}
          onInputChange={clearResult}
        />
      </HeroSection>
      {(isAnalyzing || recordId || analysisError) && (
        <div
          ref={resultsRef}
          className="mx-auto my-10 max-w-7xl scroll-mt-24 px-4 sm:my-14 sm:px-6 lg:px-8"
        >
          {isAnalyzing || analysisError ? (
            <ResultPresenter result={null} isLoading={isAnalyzing} error={analysisError} />
          ) : recordId ? (
            <InvestigationView
              id={recordId}
              scope={initialUser ? `${initialUser.id}:${initialUser.role}` : "guest"}
            />
          ) : null}
        </div>
      )}
    </>
  );
}
export function LandingInvestigation(props: Props) {
  return (
    <Suspense
      fallback={
        <HeroSection>
          <GatewaySkeleton />
        </HeroSection>
      }
    >
      <LandingInvestigationInner {...props} />
    </Suspense>
  );
}

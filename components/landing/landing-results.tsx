"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { InvestigationView } from "@/components/shared/investigation-view";
import type { UserSession } from "@/lib/auth/session";
import { cn } from "@/lib/utils";
import shared from "./landing.module.css";
import { ResultPresenter } from "./results/result-presenter";

type Props = {
  initialUser?: UserSession | null;
  isAnalyzing: boolean;
  error: string | null;
};

function scrollTo(element: HTMLElement | null) {
  element?.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "start",
  });
}

export function LandingResults({ initialUser, isAnalyzing, error }: Props) {
  const params = useSearchParams();
  const recordId = params.get("investigation");
  const resultsRef = useRef<HTMLElement>(null);
  const initialNavigation = useRef({ recordId, tab: params.get("tab") });

  useEffect(() => {
    const { recordId: initialRecord, tab } = initialNavigation.current;
    if (initialRecord || (tab !== "url" && tab !== "qr" && window.location.hash !== "#periksa"))
      return;
    const timer = setTimeout(() => scrollTo(document.getElementById("periksa")), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!recordId && !isAnalyzing && !error) return;
    const timer = setTimeout(() => scrollTo(resultsRef.current), 100);
    return () => clearTimeout(timer);
  }, [recordId, isAnalyzing, error]);

  if (!isAnalyzing && !recordId && !error) return null;
  return (
    <section
      ref={resultsRef}
      aria-label="Hasil pemeriksaan"
      className={cn(shared.container, shared.results)}
    >
      {isAnalyzing || error ? (
        <ResultPresenter result={null} isLoading={isAnalyzing} error={error} />
      ) : recordId ? (
        <InvestigationView
          id={recordId}
          scope={initialUser ? `${initialUser.id}:${initialUser.role}` : "guest"}
        />
      ) : null}
    </section>
  );
}

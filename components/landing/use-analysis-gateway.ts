"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { sanitizeInvestigationText } from "@/lib/investigations/privacy";
import { API_ROUTES } from "@/lib/routes";
import { scanUrlSchema } from "@/lib/validations/analysis-input";
import type { AnalysisGatewayProps } from "./analysis-gateway-types";
import { useGatewayClipboard } from "./use-gateway-clipboard";
import { useGatewayFiles } from "./use-gateway-files";
import { useInvestigationSubmit } from "./use-investigation-submit";

export function useAnalysisGateway(props: AnalysisGatewayProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const tab = params.get("tab");
  const activeTab =
    tab === "qr" || tab === "apk" || tab === "url" ? tab : (props.defaultTab ?? "url");
  const target = params.get("target");
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);
  const [authGateOpen, setAuthGateOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState("");
  const files = useGatewayFiles();
  const mutation = useInvestigationSubmit(props, (value) => {
    setPendingTarget(activeTab === "url" ? sanitizeInvestigationText(value) : "");
    setAuthGateOpen(true);
  });
  const clipboard = useGatewayClipboard((value) => {
    setUrlInput(value);
    setUrlError(null);
    inputChanged();
  }, setUrlError);
  useEffect(() => {
    if (target) setUrlInput(target);
  }, [target]);

  function validateUrl() {
    const parsed = scanUrlSchema.safeParse(urlInput);
    setUrlError(parsed.success ? null : (parsed.error.issues[0]?.message ?? "Tautan tidak valid."));
    return parsed;
  }
  function handleSubmit() {
    if (mutation.isLoading || clipboard.pasting) return;
    if (activeTab === "url") {
      const parsed = validateUrl();
      if (!parsed.success) return false;
      setUrlInput(parsed.data);
      mutation.submit(
        API_ROUTES.analyzeUrl,
        JSON.stringify({ url: parsed.data }),
        parsed.data,
        true,
      );
    } else {
      const file = activeTab === "qr" ? files.qrFile : files.apkFile;
      if (!file) {
        files.selectFiles(activeTab, []);
        return;
      }
      const form = new FormData();
      form.set("file", file);
      mutation.submit(
        activeTab === "qr" ? API_ROUTES.analyzeQr : API_ROUTES.analyzeApk,
        form,
        file.name,
      );
    }
    return true;
  }
  function handleTabChange(value: unknown) {
    if (
      mutation.isLoading ||
      clipboard.pasting ||
      (value !== "url" && value !== "qr" && value !== "apk")
    )
      return;
    if (value === activeTab) return;
    inputChanged();
    const next = new URLSearchParams(params.toString());
    next.set("tab", value);
    window.history.pushState(null, "", `${pathname}?${next}`);
  }
  function inputChanged() {
    mutation.resetFeedback();
    props.onInputChange?.();
  }
  return {
    activeTab,
    urlInput,
    urlError,
    validateUrl,
    changeUrl: (value: string) => {
      setUrlInput(value);
      setUrlError(null);
      inputChanged();
    },
    ...files,
    selectFiles: (type: "qr" | "apk", selected: File[]) => {
      files.selectFiles(type, selected);
      inputChanged();
    },
    clearFile: (type: "qr" | "apk") => {
      files.clearFile(type);
      inputChanged();
    },
    ...mutation,
    isPasting: clipboard.pasting,
    pasteUrl: clipboard.paste,
    handleSubmit,
    handleTabChange,
    authGateOpen,
    setAuthGateOpen,
    pendingTarget,
  };
}

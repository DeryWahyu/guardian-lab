"use client";
import { Tabs } from "@base-ui/react/tabs";
import { ArrowRight, File as FileIcon, Link2, Loader2, QrCode } from "lucide-react";
import Link from "next/link";
import { Suspense, useRef } from "react";
import { PROTECTED_ROUTES } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type { AnalysisGatewayProps } from "./analysis-gateway-types";
import { AuthGateModal } from "./auth-gate-modal";
import styles from "./gateway.module.css";
import { GatewayPrivacyControl } from "./gateway-privacy-control";
import { GatewaySkeleton } from "./gateway-skeleton";
import { GatewayUploadField } from "./gateway-upload-field";
import { GatewayUrlField } from "./gateway-url-field";
import { useAnalysisGateway } from "./use-analysis-gateway";

export type { AnalysisGatewayProps } from "./analysis-gateway-types";

const tabs = [
  { value: "url", label: "Tautan", icon: Link2 },
  { value: "qr", label: "Kode QR", icon: QrCode },
  { value: "apk", label: "File APK", icon: FileIcon },
] as const;

function AnalysisGatewayInner(props: AnalysisGatewayProps) {
  const gateway = useAnalysisGateway(props);
  const input = useRef<HTMLInputElement>(null);
  const { activeTab, isLoading, requestError } = gateway;
  const busy = isLoading || gateway.isPasting;
  const file = activeTab === "qr" ? gateway.qrFile : gateway.apkFile;
  const label =
    activeTab === "url" ? "Periksa tautan" : activeTab === "qr" ? "Baca kode QR" : "Periksa APK";
  return (
    <>
      <form
        noValidate
        aria-label="Input investigasi"
        aria-busy={isLoading}
        onSubmit={(event) => {
          event.preventDefault();
          if (gateway.handleSubmit() === false && activeTab === "url") input.current?.focus();
        }}
        className={cn(styles.card, props.className)}
      >
        <p className="sr-only">
          {props.currentUser
            ? "Sesi aktif. Input dan status pemeriksaan tersimpan di akun Anda."
            : "Masuk untuk memeriksa input dan menyimpan investigasi."}{" "}
        </p>
        <Tabs.Root value={activeTab} onValueChange={gateway.handleTabChange}>
          <Tabs.List aria-label="Jenis input investigasi" className={styles.tabs}>
            {tabs.map(({ value, label, icon: Icon }) => (
              <Tabs.Tab key={value} value={value} disabled={busy} className={styles.tab}>
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </Tabs.Tab>
            ))}
          </Tabs.List>
          <Tabs.Panel value="url">
            <GatewayUrlField
              inputRef={input}
              value={gateway.urlInput}
              error={gateway.urlError}
              disabled={isLoading}
              pasting={gateway.isPasting}
              onChange={gateway.changeUrl}
              onPaste={() => void gateway.pasteUrl()}
            />
          </Tabs.Panel>
          {(["qr", "apk"] as const).map((type) => (
            <Tabs.Panel key={type} value={type}>
              <GatewayUploadField
                type={type}
                file={type === "qr" ? gateway.qrFile : gateway.apkFile}
                preview={type === "qr" ? gateway.qrPreview : null}
                error={gateway.errors[type]}
                disabled={isLoading}
                onSelect={(files) => gateway.selectFiles(type, files)}
                onClear={() => gateway.clearFile(type)}
              />
            </Tabs.Panel>
          ))}
        </Tabs.Root>
        {requestError && (
          <div
            role="alert"
            className="mt-4 space-y-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
          >
            <p>{requestError}</p>
            {gateway.uncertain && (
              <Link href={PROTECTED_ROUTES.history} className="inline-flex font-semibold underline">
                Periksa riwayat investigasi
              </Link>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={busy || (activeTab !== "url" && !file)}
          aria-busy={isLoading}
          className={styles.submit}
        >
          {isLoading && (
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          )}
          {isLoading
            ? "Memproses input…"
            : requestError && !gateway.uncertain
              ? "Coba Kirim Lagi"
              : label}
          {!isLoading && <ArrowRight aria-hidden="true" />}
        </button>
        <p className={styles.modelNotice}>AI sedang disiapkan. Skor risiko belum tersedia.</p>
        <GatewayPrivacyControl />
        {isLoading && (
          <p aria-live="polite" className="mt-3 text-xs text-slate-600">
            {activeTab === "apk"
              ? "APK sedang diperiksa secara statis. Proses dapat memerlukan waktu hingga sekitar satu menit; jangan kirim ulang selama berlangsung."
              : "Input sedang dibaca dan dicatat. Tunggu sampai status investigasi tampil."}
          </p>
        )}
      </form>
      <AuthGateModal
        isOpen={gateway.authGateOpen}
        onClose={() => gateway.setAuthGateOpen(false)}
        pendingType={activeTab}
        pendingTarget={gateway.pendingTarget}
      />
    </>
  );
}

export function AnalysisGateway(props: AnalysisGatewayProps) {
  return (
    <Suspense fallback={<GatewaySkeleton />}>
      <AnalysisGatewayInner {...props} />
    </Suspense>
  );
}

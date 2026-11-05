"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { LearningProblem, LearningSkeleton } from "@/components/academy/learning-ui";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { WorkspaceStage } from "@/components/workspace/workspace-stage";
import workspace from "@/components/workspace/workspace.module.css";
import { sandboxTargetPlan } from "@/lib/sandbox/target-plan";
import { QuarantinedDownloads } from "./quarantined-downloads";
import { SandboxSessionPanel } from "./sandbox-session-panel";
import { useSandboxSession } from "./use-sandbox-session";
export function WebSandboxView({ scope }: { scope: string }) {
  const params = useSearchParams();
  const target = params.get("target") ?? "";
  const source = params.get("investigation") ?? undefined;
  return (
    <WebSandboxForm
      key={JSON.stringify([scope, target, source])}
      scope={scope}
      initialTarget={target}
      initialSource={source}
    />
  );
}
function WebSandboxForm({
  scope,
  initialTarget,
  initialSource,
}: {
  scope: string;
  initialTarget: string;
  initialSource?: string;
}) {
  const [target, setTarget] = useState(initialTarget);
  const [source, setSource] = useState(initialSource);
  const [consent, setConsent] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const state = useSandboxSession(scope);
  const data = state.resource.data;
  const session = data?.session;
  const live = Boolean(session && ["STARTING", "ACTIVE", "UNKNOWN"].includes(session.status));
  const plan = sandboxTargetPlan(target);
  const different = Boolean(live && session && target && plan?.cleanUrl !== session.targetUrl);
  if (state.resource.loading) return <LearningSkeleton presentation="workspace" />;
  if (!data || state.resource.problem)
    return <LearningProblem presentation="workspace" retry={state.resource.retry} />;
  return (
    <div className="space-y-5">
      <WorkspaceStage
        title={live ? "Ruang jelajahmu sedang aktif." : "Jelajahi tautan, jaga perangkatmu."}
        description="Buka tautan publik di browser server terisolasi. Satu sesi berlangsung maksimal 180 detik, lalu data sementara dihapus."
        pose="sandbox"
        compact={live}
        reaction={state.error ? "error" : state.pending ? "busy" : "idle"}
      >
        <section className={`${workspace.panel} space-y-4`}>
          <p aria-live="polite" className={workspace.notice}>
            {data.message}
          </p>
          {different && (
            <output className="block rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
              Sesi sebelumnya masih berjalan. Tautan baru belum dibuka:{" "}
              <span className="font-medium break-all">{plan?.cleanUrl}</span>. Hentikan sesi aktif
              terlebih dahulu.
            </output>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void state.mutate({
                target,
                stripParameters: consent,
                sourceInvestigationId: source,
              });
            }}
            className="space-y-4"
          >
            <div className="flex flex-wrap items-end gap-3">
              <label className="w-full min-w-0 space-y-1 text-sm sm:w-auto sm:flex-1">
                {live ? "Tautan awal sesi aktif" : "Tautan publik"}{" "}
                <span className="text-rose-600">*</span>
                <input
                  required
                  type="text"
                  maxLength={16384}
                  disabled={live || Boolean(state.pending)}
                  value={live && session ? session.targetUrl : target}
                  placeholder="https://example.com/halaman"
                  onChange={(e) => {
                    state.resetRequest();
                    setTarget(e.target.value);
                    setSource(undefined);
                    setConsent(false);
                  }}
                  className={workspace.field}
                />
              </label>
              <button
                disabled={
                  !data.available ||
                  live ||
                  Boolean(state.pending) ||
                  Boolean(plan?.requiresRemoval && !consent)
                }
                type="submit"
                className={workspace.primary}
              >
                {state.pending === "start" ? "Menyiapkan browser..." : "Mulai sesi 180 detik"}
              </button>
              <button
                type="button"
                className={workspace.secondary}
                disabled={Boolean(state.pending)}
                onClick={state.resource.retry}
              >
                Periksa status
              </button>
            </div>
            {!live && plan?.requiresRemoval && (
              <div className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <p>
                  Parameter dan fragmen URL dihapus untuk menjaga privasi. Tautan yang bergantung
                  pada parameter bisa membuka halaman berbeda.
                </p>
                <p className="break-all">
                  Versi yang akan dibuka: <strong>{plan.cleanUrl}</strong>
                </p>
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="accent-brand-600 mt-1"
                  />
                  <span>
                    Saya setuju membuka versi tanpa parameter dan memahami halaman dapat berbeda.
                  </span>
                </label>
              </div>
            )}
          </form>
          <p className="max-w-2xl text-xs leading-relaxed text-slate-500">
            Tautan dibuka di browser server. Jangan masukkan akun atau data pribadi. Clipboard dan
            pemindahan unduhan langsung ke perangkat lokal dinonaktifkan.
          </p>
          {state.error && (
            <p role="alert" className="text-sm text-rose-700">
              {state.error}
            </p>
          )}
        </section>
      </WorkspaceStage>
      {session && (
        <>
          <SandboxSessionPanel
            session={session}
            remaining={state.remaining}
            pending={Boolean(state.pending)}
            onStop={() => setConfirm(true)}
          />
          <QuarantinedDownloads key={session.sessionId} session={session} />
        </>
      )}
      <ConfirmDialog
        open={confirm}
        onOpenChange={setConfirm}
        title="Hentikan sesi sandbox?"
        description="Browser dan data sementara pada container sesi ini akan dihapus."
        pending={state.pending === "stop"}
        error={state.error}
        confirmLabel="Hentikan dan hapus"
        onConfirm={() => {
          void state.mutate().then((success) => {
            if (success) setConfirm(false);
          });
        }}
      />
    </div>
  );
}

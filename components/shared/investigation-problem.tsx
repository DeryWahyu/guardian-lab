import Link from "next/link";
import { ResultError } from "@/components/landing/results/result-error";
import type { LoadProblem } from "@/lib/investigations/client";
import { AUTH_ROUTES, PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";

export function InvestigationProblem({
  problem,
  onRetry,
  id,
  returnTo,
}: {
  problem: LoadProblem;
  onRetry: () => void;
  id?: string;
  returnTo?: string;
}) {
  return (
    <div className="space-y-4">
      <ResultError
        message={problem.message}
        title={
          problem.kind === "not_found"
            ? "Rekaman Tidak Ditemukan"
            : problem.kind === "forbidden"
              ? "Akses Tidak Diizinkan"
              : problem.kind === "unauthenticated"
                ? "Masuk untuk Melihat Investigasi"
                : undefined
        }
        onRetry={problem.retryable ? onRetry : undefined}
      />
      <div className="flex flex-wrap justify-center gap-3 text-sm">
        {problem.kind === "unauthenticated" && (
          <Link
            className="bg-brand-600 rounded-full px-5 py-2 font-semibold text-white"
            href={AUTH_ROUTES.loginWithRedirect(
              returnTo ?? (id ? PUBLIC_ROUTES.investigation(id) : PUBLIC_ROUTES.home),
            )}
          >
            Masuk kembali
          </Link>
        )}
        <Link
          href={PROTECTED_ROUTES.history}
          className="rounded-full border border-slate-300 bg-white px-5 py-2 text-slate-700"
        >
          Buka riwayat
        </Link>
      </div>
    </div>
  );
}

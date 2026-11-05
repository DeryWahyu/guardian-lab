import { Suspense } from "react";
import { ApkInvestigation } from "@/components/apk/apk-investigation";
import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { WorkspaceSkeleton } from "@/components/workspace/workspace-state";
import { requirePageUser } from "@/lib/auth/page-access";
import { PROTECTED_ROUTES } from "@/lib/routes";

type Props = {
  searchParams: Promise<{ investigation?: string | string[]; mode?: string | string[] }>;
};

export const metadata = {
  title: "Bedah APK | Guardian Lab",
  description: "Periksa manifest, izin, dan kode APK secara statis tanpa memasangnya di perangkat.",
};

async function ApkContent({ searchParams }: Props) {
  const query = await searchParams;
  const id = typeof query.investigation === "string" ? query.investigation : undefined;
  const returnTo = id
    ? PROTECTED_ROUTES.apkWithInvestigation(id, query.mode === "geek" ? "geek" : undefined)
    : PROTECTED_ROUTES.apkWithMode(query.mode === "geek" ? "geek" : "human");
  const user = await requirePageUser(undefined, returnTo);
  return (
    <WorkspaceShell user={user}>
      <ApkInvestigation user={user} />
    </WorkspaceShell>
  );
}

function ApkPageSkeleton() {
  return <WorkspaceSkeleton label="Memeriksa sesi APK" />;
}

export default function ApkPage(props: Props) {
  return (
    <Suspense fallback={<ApkPageSkeleton />}>
      <ApkContent {...props} />
    </Suspense>
  );
}

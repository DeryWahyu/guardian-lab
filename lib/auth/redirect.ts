import { ADMIN_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { getSafeRedirectUrl } from "@/lib/validations/auth";

/** Users return to the landing; admins always enter their dashboard. */
export function getPostLoginRedirect(role: "USER" | "ADMIN", requested?: string | null): string {
  if (role === "ADMIN") return ADMIN_ROUTES.dashboard;
  const safeTarget = getSafeRedirectUrl(requested, PUBLIC_ROUTES.home);
  const destination = new URL(safeTarget, "https://guardian.invalid");
  return destination.pathname === PUBLIC_ROUTES.home ? safeTarget : PUBLIC_ROUTES.home;
}

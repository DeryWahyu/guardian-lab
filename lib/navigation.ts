import { PUBLIC_ROUTES } from "./routes";
export function isNavigationActive(href: string, pathname: string, search: URLSearchParams) {
  const destination = new URL(href, "https://guardian.invalid");
  if (destination.pathname === PUBLIC_ROUTES.home) {
    if (pathname !== PUBLIC_ROUTES.home) return false;
    const tab = search.get("tab") ?? "url";
    return destination.searchParams.get("tab") === "apk" ? tab === "apk" : tab !== "apk";
  }
  return pathname === destination.pathname || pathname.startsWith(`${destination.pathname}/`);
}

"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { PROFILE_UPDATED_EVENT } from "@/lib/auth/events";
import type { UserSession } from "@/lib/auth/session";
import { API_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import { sessionResponseSchema } from "@/lib/validations/auth";

export function useSessionUser(initialUser?: UserSession | null) {
  const [user, setUser] = useState<UserSession | null>(initialUser ?? null);
  const [isLoggingOut, startLogout] = useTransition();

  useEffect(() => {
    const controller = new AbortController();
    let version = 0;
    const refresh = () => {
      const current = ++version;
      void fetch(API_ROUTES.authMe, { signal: controller.signal, cache: "no-store" })
        .then((response) => (response.ok ? response.json() : null))
        .then((data: unknown) => {
          const parsed = sessionResponseSchema.safeParse(data);
          if (!controller.signal.aborted && current === version)
            setUser(parsed.success ? parsed.data.user : null);
        })
        .catch(() => {
          if (!controller.signal.aborted && current === version) setUser(null);
        });
    };
    if (initialUser !== undefined) setUser(initialUser);
    else refresh();
    window.addEventListener(PROFILE_UPDATED_EVENT, refresh);
    return () => {
      controller.abort();
      window.removeEventListener(PROFILE_UPDATED_EVENT, refresh);
    };
  }, [initialUser]);

  const handleLogout = () =>
    startLogout(async () => {
      try {
        const response = await fetch(API_ROUTES.authLogout, { method: "POST" });
        if (!response.ok) {
          toast.error("Gagal keluar. Silakan coba kembali.");
          return;
        }
        setUser(null);
        toast.success("Berhasil keluar dari akun.");
        window.location.href = PUBLIC_ROUTES.home;
      } catch {
        toast.error("Terjadi gangguan koneksi saat keluar.");
      }
    });

  return { user, isLoggingOut, handleLogout };
}

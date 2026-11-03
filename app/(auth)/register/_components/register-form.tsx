"use client";

import { Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { API_ROUTES, AUTH_ROUTES, PUBLIC_ROUTES } from "@/lib/routes";
import {
  authSuccessSchema,
  getAuthError,
  getSafeRedirectUrl,
  registerFormSchema,
} from "@/lib/validations/auth";
import { AuthHeader } from "../../_components/auth-header";
import { GuardianSecurityBadge } from "../../_components/guardian-security-badge";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectUrl(searchParams.get("redirect"), PUBLIC_ROUTES.home);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = registerFormSchema.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const fieldName = String(issue.path[0]);
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(API_ROUTES.authRegister, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data: unknown = await response.json();

        if (!response.ok) {
          toast.error(getAuthError(data, "Pendaftaran gagal. Periksa data Anda."));
          if (response.status === 409) {
            setErrors({
              email: "Email sudah terdaftar. Silakan gunakan email lain atau masuk.",
            });
          }
          return;
        }

        const parsed = authSuccessSchema.safeParse(data);
        if (!parsed.success) {
          toast.error("Respons pendaftaran tidak valid. Silakan coba kembali.");
          return;
        }

        toast.success("Akun berhasil dibuat! Selamat datang di Guardian Lab.");
        window.location.href = getSafeRedirectUrl(parsed.data.redirectTo, PUBLIC_ROUTES.home);
      } catch (_error) {
        toast.error("Terjadi gangguan jaringan saat mendaftar. Silakan coba kembali.");
      }
    });
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-md sm:p-10">
      <AuthHeader
        badgeText="Langkah Kecil Dimulai"
        title="Daftar Akun,"
        highlightText="jadilah Guardian Tangguh."
        subtitle="Mulai pelacakan ancaman siber, pelajari modus APK, dan dapatkan EXP."
      />

      <GuardianSecurityBadge />

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="name" className="mb-1 block text-xs font-semibold text-slate-700">
            Nama Lengkap <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Budi Pratama"
            disabled={isPending}
            className={`focus:border-brand-600 focus:ring-brand-600/20 h-11 w-full rounded-xl border bg-slate-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:ring-2 focus:outline-none aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/20 ${
              errors.name ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200"
            }`}
          />
          {errors.name && (
            <p id="name-error" className="mt-1 text-xs font-medium text-rose-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-xs font-semibold text-slate-700">
            Email Akun <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            disabled={isPending}
            className={`focus:border-brand-600 focus:ring-brand-600/20 h-11 w-full rounded-xl border bg-slate-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:ring-2 focus:outline-none aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/20 ${
              errors.email ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200"
            }`}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-xs font-medium text-rose-600">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="mb-1 block text-xs font-semibold text-slate-700">
            Password <span className="font-semibold text-rose-600">*</span>
          </label>
          <div className="relative">
            <input
              id="password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "password-error" : undefined}
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter huruf & angka"
              disabled={isPending}
              className={`focus:border-brand-600 focus:ring-brand-600/20 h-11 w-full rounded-xl border bg-slate-50/60 px-3.5 pr-10 text-sm text-slate-900 transition-colors focus:ring-2 focus:outline-none aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/20 ${
                errors.password ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer p-1 text-slate-400 hover:text-slate-600"
              aria-pressed={showPassword}
              aria-label={showPassword ? "Sembunyikan password" : "Lihat password"}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className="mt-1 text-xs font-medium text-rose-600">
              {errors.password}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1 block text-xs font-semibold text-slate-700"
          >
            Konfirmasi Password <span className="font-semibold text-rose-600">*</span>
          </label>
          <input
            id="confirmPassword"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Ulangi password di atas"
            disabled={isPending}
            className={`focus:border-brand-600 focus:ring-brand-600/20 h-11 w-full rounded-xl border bg-slate-50/60 px-3.5 text-sm text-slate-900 transition-colors focus:ring-2 focus:outline-none aria-invalid:border-rose-500 aria-invalid:focus:border-rose-500 aria-invalid:focus:ring-rose-500/20 ${
              errors.confirmPassword ? "border-rose-500 ring-2 ring-rose-200" : "border-slate-200"
            }`}
          />
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="mt-1 text-xs font-medium text-rose-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          aria-busy={isPending}
          disabled={isPending}
          className="bg-brand-600 shadow-brand-200 hover:bg-brand-700 mt-3 flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-full text-sm font-semibold text-white shadow-md transition-all active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin motion-reduce:animate-none" />
              <span>Mendaftarkan Akun...</span>
            </>
          ) : (
            <>
              <UserPlus className="size-4" />
              <span>Daftar Akun Sekarang</span>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-slate-100 pt-5 text-center text-xs text-slate-600">
        Sudah terdaftar sebagai Guardian?{" "}
        <Link
          href={`${AUTH_ROUTES.login}?redirect=${encodeURIComponent(redirectTarget)}`}
          className="text-brand-600 hover:text-brand-700 cursor-pointer font-bold hover:underline"
        >
          Masuk di Sini
        </Link>
      </div>
    </div>
  );
}

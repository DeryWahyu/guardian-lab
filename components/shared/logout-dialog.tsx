"use client";

import { ConfirmDialog } from "./confirm-dialog";

export function LogoutDialog({
  open,
  onOpenChange,
  pending,
  error,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pending: boolean;
  error: string | null;
  onConfirm: () => void;
}) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Keluar dari akun?"
      description="Pastikan pekerjaanmu sudah tersimpan. Kamu perlu masuk kembali untuk menggunakan fitur akun."
      confirmLabel="Ya, keluar"
      pendingLabel="Sedang keluar…"
      pending={pending}
      error={error}
      tone="brand"
      onConfirm={onConfirm}
    />
  );
}

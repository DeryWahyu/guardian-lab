# Guardian Lab

Platform anti-phishing dan analisis APK untuk MIT-Week 2026, menggunakan Next.js App Router, TypeScript, Bun, Prisma, dan MySQL.

## Kemampuan saat ini

URL/QR/APK menggunakan rekaman investigasi yang sama dari input hingga riwayat. Decoder QR, ekstraksi APK statis melalui JADX, sandbox web Chromium/KasmVNC, Academy, dan CMS sudah tersedia. Binary APK tidak disimpan permanen.

Model AI belum terhubung: input baru berstatus **Model belum tersedia** dengan skor risiko kosong. Share Card dan kontribusi komunitas memerlukan hasil lengkap tersimpan sehingga belum dapat dibuat dari input baru. Android dinamis belum tersedia.

Kontrak fitur aktif berada pada [features.md](ai-agent-docs/features.md). Gunakan [peta dokumentasi](ai-agent-docs/index.md) hanya untuk menemukan panduan sesuai tugas.

## Setup lokal

Siapkan Bun, MySQL 8, runtime Node yang didukung Next.js, serta Java 11+ untuk JADX. Docker Engine Linux diperlukan bila menggunakan sandbox web.

1. Salin `.env.example` menjadi `.env` hanya jika belum ada. Isi `DATABASE_URL`, `SESSION_SECRET` acak minimal 32 karakter, `NEXT_PUBLIC_APP_URL`, dan `FONNTE_TOKEN` perangkat WhatsApp terhubung untuk verifikasi akun. Pengaturan broker serta nomor akun demo mengikuti [deployment](ai-agent-docs/deployment.md). Kunci DeepSeek belum diperlukan selama integrasi model ditunda.
2. Buat database MySQL sesuai `DATABASE_URL`. Untuk database baru bernama `guardian_lab`:

   ```sql
   CREATE DATABASE IF NOT EXISTS guardian_lab
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. Pasang dependensi, terapkan migrasi, dan siapkan alat:

   ```bash
   bun install --frozen-lockfile
   bunx prisma generate
   bunx prisma migrate deploy
   bun run apk:setup
   bun run academy:seed
   bun run dev
   ```

Buka aplikasi pada `http://localhost:3000`. Jika database lama sudah memiliki tabel tanpa riwayat migrasi, periksa kesesuaian schema dan buat baseline sebelum menerapkan migrasi; jangan reset data yang ada.

`bun run db:seed` bersifat opsional untuk akun demo lokal dan materi awal. Akun serta aturan seed dijelaskan pada [autentikasi](ai-agent-docs/features.md#autentikasi-dan-akses); seed menolak production serta tidak membuat investigasi/EXP contoh.

## Pengujian

Pengujian didelegasikan melalui [TEST_PLAN.md](TEST_PLAN.md). AI mengikuti [aturan persetujuan](AGENTS.md#eksekusi-pengujian); implementasi selesai tidak otomatis mengizinkan build, test, atau pemeriksaan proyek. Prasyarat database uji dan perintah yang dapat dipilih tercantum pada rencana tersebut.

Setup dan pemeriksaan sandbox nyata, port, HTTPS, serta build standalone berada pada [panduan deployment](ai-agent-docs/deployment.md). Kontribusi pengembangan mengikuti [AGENTS.md](AGENTS.md) dan [alur kerja](ai-agent-docs/agent-workflow.md).

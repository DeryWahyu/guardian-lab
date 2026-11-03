Guardian Lab adalah platform anti-phishing dan analisis APK berbasis fullstack Next.js, TypeScript, dan Prisma dengan database MySQL.

## Status Investigasi Saat Ini

URL, QR, dan unggahan APK menggunakan rekaman investigasi yang sama dari input hingga riwayat. Saat model masih dilatih, status yang ditampilkan adalah **Model belum tersedia** dengan skor risiko kosong. Tidak ada hasil AI simulasi pada endpoint tersebut. APK sudah mengekstrak manifest/resource, izin, serta bukti statis tersanitasi melalui JADX; binary aslinya tidak disimpan.

Alur, status proses, kontrak API aktif, dan batas implementasi dijelaskan di [dokumentasi investigasi](ai-agent-docs/investigations.md).

Tahap 3 menambahkan validasi URL yang sama untuk input langsung dan QR, normalisasi HTTPS, unggahan drag-and-drop, pesan kesalahan di dekat input, serta pembatasan ukuran request. Rujuk [alur input](ai-agent-docs/input-flow.md).

Tahap 4 menghubungkan hasil landing dan riwayat berdasarkan ID yang sama, termasuk reload, pembaruan status, filter tanggal, dan pagination. Rujuk [hasil dan riwayat](ai-agent-docs/results-and-history.md).

Tahap 5 menghubungkan Guardian Share Card ke hasil tersimpan: pratinjau, unduh PNG, salin pesan, dan berbagi gambar pada browser yang mendukung. Rujuk [panduan Share Card](ai-agent-docs/share-card.md). Ekspor menunggu hasil lengkap tersedia; input baru tetap menampilkan status model belum tersedia.

Tahap 6 menghubungkan pengajuan investigasi dengan moderasi admin dan kasus komunitas yang disetujui. Rujuk [alur komunitas](ai-agent-docs/community.md). Terapkan migrasi terbaru dan perbarui Prisma Client sebelum menjalankan versi ini.

Tahap 8 menghubungkan sandbox web Chromium/KasmVNC nyata dan Academy berbasis progres akun. Jalankan bun run academy:seed, bun run sandbox:build, dan bun run sandbox:up setelah menyiapkan kunci broker pada .env. APK yang diunduh di browser server masuk karantina dan dapat dibedah statis ke riwayat. Android dinamis ditunda sampai server Linux/binder tersedia. Rujuk [sandbox dan Academy](ai-agent-docs/sandbox-and-academy.md).

## Setup Database Lokal

Untuk tahap 7, siapkan Java 11+ dan jalankan `bun run apk:setup` sebelum memeriksa APK atau menjalankan tes. Kontrak, batas ekstraksi, dan setup tersedia di [ekstraksi statis APK](ai-agent-docs/apk-static.md).

Pastikan MySQL sudah aktif dan dependensi sudah diinstal dengan `bun install --frozen-lockfile`.

1. Salin `.env.example` menjadi `.env` jika belum tersedia:

   ```powershell
   Copy-Item .env.example .env
   ```

2. Sesuaikan konfigurasi `.env`:
   - `DATABASE_URL`: koneksi MySQL lokal dengan nama database `guardian_lab`.
   - `SESSION_SECRET`: secret acak minimal 32 karakter. Gunakan nilai berbeda untuk setiap lingkungan.
   - `NEXT_PUBLIC_APP_URL`: `http://localhost:3000` untuk pengembangan lokal.
   - `DEEPSEEK_API_KEY`: dapat dikonfigurasi saat integrasi AI; tidak diperlukan untuk setup database.

   File `.env` diabaikan Git. Simpan kredensial dan secret hanya pada konfigurasi lingkungan.

3. Siapkan database pengembangan baru menggunakan akun MySQL lokal:

   ```sql
   CREATE DATABASE IF NOT EXISTS guardian_lab
     CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Generate Prisma Client dan terapkan migrasi yang tersedia:

   ```bash
   bun run db:generate
   bun run db:migrate --skip-seed
   ```

   Jika database sudah berisi tabel tanpa riwayat Prisma Migrate, periksa kesesuaian schema dan siapkan baseline sebelum menjalankan migrasi.

5. Periksa schema dan status migrasi:

   ```bash
   bunx prisma validate
   bunx prisma migrate status
   ```

Seed tidak dijalankan otomatis pada langkah di atas. `bun run db:seed` membuat admin@gmail.com (ADMIN), dery@gmail.com, gading@gmail.com, rafli@gmail.com (USER), semuanya dengan password `password`, serta materi awal. Seed idempoten, mempertahankan riwayat/EXP/nama, tanpa investigasi atau progres buatan. Perintah menolak NODE_ENV=production.

## Getting Started

Alur autentikasi: USER tetap di landing setelah login, sedangkan ADMIN masuk ke dashboard `/admin`. Fitur analisis, sandbox, riwayat, Academy, komunitas, dan Share Card memerlukan sesi login. Rincian tersedia di [panduan autentikasi](ai-agent-docs/authentication.md).

Pengujian otomatis menggunakan database MySQL sementara dan akun fixture yang dibuat lalu dibersihkan otomatis, tanpa menjalankan seed demo pada database aplikasi:

```bash
bun test
```

Hasil verifikasi terakhir dicatat di [TEST_READY.md](TEST_READY.md).

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

Aplikasi memakai Next.js standalone, MySQL, Java/JADX, serta broker Docker terpisah untuk sandbox. Persiapan port, jaringan, HTTPS, dan batas runtime dijelaskan pada [panduan deployment](ai-agent-docs/deployment.md). Menjalankan konfigurasi lokal tidak melakukan deployment publik.

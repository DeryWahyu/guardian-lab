# Guardian Lab

Platform anti-phishing dan analisis APK untuk MIT-Week 2026, menggunakan Next.js App Router, TypeScript, Bun, Prisma, dan MySQL.

## Kemampuan saat ini

URL/QR/APK menggunakan rekaman investigasi yang sama dari input hingga riwayat. Decoder QR, ekstraksi APK statis melalui JADX, sandbox web Chromium/KasmVNC, Academy, dan CMS sudah tersedia. Binary APK tidak disimpan permanen.

URL dan tautan hasil QR terhubung ke model Logistic Regression v6 melalui layanan Python privat. Hasil indikator tersimpan dapat dibaca pada dua mode, riwayat, Share Card, dan pengajuan komunitas. Model tetap riset nonkomersial dan perlu verifikasi; skor rendah tidak menjamin aman. Jika layanan tidak tersedia, skor tetap kosong. APK memakai pemeriksaan statis; Android dinamis belum tersedia.

Kontrak fitur aktif berada pada [features.md](ai-agent-docs/features.md). Gunakan [peta dokumentasi](ai-agent-docs/index.md) hanya untuk menemukan panduan sesuai tugas.

## Development dengan Docker

Siapkan Docker Engine Linux atau Docker Desktop dengan Linux containers dan Compose 2.32.2+, serta GNU Make untuk shortcut. Letakkan checkout `guardian-lab-ai` di sebelah `guardian-lab`. Bun, Python, MySQL, dan Java dijalankan dalam container.

1. Dari folder `guardian-lab`, buat key internal:

   ```bash
   make key-generate
   ```

   Perintah ini membuat `.env` dari `.env.example` bila belum ada, lalu mengisi `SESSION_SECRET` dan `SANDBOX_BROKER_KEY` yang kosong/placeholder. Key yang sudah terisi dipertahankan. Nilai key tidak dicetak. Generator memakai container Node terpisah, sehingga belum memerlukan stack Compose aktif atau Node/Bun di host.
2. Isi `FONNTE_TOKEN` pada `.env` untuk OTP dan gunakan `NEXT_PUBLIC_APP_URL=http://localhost:3000` serta `SANDBOX_PUBLIC_URL=http://localhost:4010` untuk akses lokal. Token provider tidak dibuat oleh generator.
3. Jalankan stack:

   ```bash
   make dev
   ```

Buka `http://localhost:3000`. Compose menjalankan Next.js dev server, database MySQL development, model Python, dan broker sandbox; image browser/proxy disiapkan otomatis. Startup menerapkan migrasi yang tersedia serta seed materi Academy. Database disimpan pada volume persisten terpisah dari database host. Akun demo tetap opsional melalui [panduan development](ai-agent-docs/deployment.md#development-dengan-compose).

Perubahan source website disinkronkan untuk Fast Refresh. Perubahan dependency, Prisma, toolchain, dan source layanan memicu rebuild otomatis selama Watch aktif. Tidak perlu menjalankan `bun run dev` atau Python secara terpisah. Gunakan `make help` untuk daftar perintah, `make logs SERVICE=app` untuk log aplikasi, dan `make down` untuk menghentikan stack tanpa menghapus volume database.

`make dev`, `make run`, `make up`, `bun run docker:dev`, dan `bun run docker:up` membungkus perintah Compose yang sama. Dev server Next.js memakai Node.js 22 di container; Bun tetap dipakai untuk dependency dan script proyek. Tanpa GNU Make/Bun di host, gunakan perintah Compose langsung pada [panduan development](ai-agent-docs/deployment.md#development-dengan-compose).

Untuk memilih satu key atau mengganti key lama secara sengaja, lihat [generator key](ai-agent-docs/deployment.md#generator-key-internal).

Rincian pembaruan kode, konfigurasi `.env`, penghentian stack, dan alternatif menjalankan proses di host berada pada [panduan deployment](ai-agent-docs/deployment.md).

## Pengujian

Pengujian didelegasikan melalui [TEST_PLAN.md](TEST_PLAN.md). AI mengikuti [aturan persetujuan](AGENTS.md#eksekusi-pengujian); implementasi selesai tidak otomatis mengizinkan build, test, atau pemeriksaan proyek. Prasyarat database uji dan perintah yang dapat dipilih tercantum pada rencana tersebut.

Setup dan pemeriksaan sandbox nyata, port, HTTPS, serta build standalone berada pada [panduan deployment](ai-agent-docs/deployment.md). Kontribusi pengembangan mengikuti [AGENTS.md](AGENTS.md) dan [alur kerja](ai-agent-docs/agent-workflow.md).

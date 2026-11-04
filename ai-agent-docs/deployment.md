# Deployment Guardian Lab

Runbook referensi untuk pekerjaan infrastruktur yang diminta pengguna. Eksekusi pemeriksaan tetap mengikuti [AGENTS.md](../AGENTS.md#eksekusi-pengujian).

## Komponen aktif

| Komponen           | Peran                                                    | Akses                                            |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------ |
| Next.js standalone | UI, autentikasi, API, Prisma/MySQL, ekstraksi APK statis | Port aplikasi 3000                               |
| Sandbox broker     | Orkestrasi Docker, tiket stream, reaper                  | API 4011 khusus aplikasi; stream 4010            |
| Chromium/KasmVNC   | Satu browser sementara per sesi                          | Port VNC tidak dipublikasikan                    |
| Squid              | Egress publik berbatas tujuan untuk satu sesi            | Hanya jaringan internal sesi dan jaringan egress |

Model AI belum tersedia. Redroid belum menjadi layanan aktif; karantina unduhan APK dan bedah statis sudah berjalan lokal. Kontrak sesi dan karantina ada di [sandbox](./features.md#sandbox-web-dan-karantina); kuis dan CMS ada di [Academy](./features.md#academy-dan-cms).

## Persiapan lokal

Gunakan MySQL 8, Bun, Docker Engine Linux, dan salinan `.env.example` menjadi `.env`. Jangan menimpa `.env` yang telah berisi konfigurasi lokal. Buat kunci broker acak minimal 32 karakter dan simpan sebagai `SANDBOX_BROKER_KEY`; jangan masukkan kunci ke git atau URL.

Verifikasi WhatsApp memerlukan `FONNTE_TOKEN` perangkat yang terhubung dan kuota Fonnte; token hanya di server. Set `AUTH_TRUST_PROXY=true` hanya jika proxy tepercaya menghapus dan mengganti `X-Forwarded-For`; default `false` menggunakan batas bersama. Seeder lokal mengisi akun demo beserta status nomor terverifikasi; daftar dan nomor berada di [demo-accounts.ts](../prisma/seeders/demo-accounts.ts), dan seeder menolak production. Aplikasikan migrasi dan generate Prisma Client sesuai alur deployment sebelum mengaktifkan perubahan auth; tanpa token/perangkat Fonnte, OTP tidak dapat terkirim.

```powershell
bun install --frozen-lockfile
bunx prisma migrate deploy
bunx prisma generate
bun run academy:seed
bun run sandbox:build
bun run sandbox:up
bun run dev
```

`academy:seed` menambahkan tiga materi awal tanpa membuat akun demo atau menimpa kuis yang sudah ada. `bun run db:seed` opsional membuat empat akun lokal yang diminta beserta materi tanpa progress buatan; perintah menolak production. Kedua perintah memakai fungsi Academy bersama di `prisma/seeders`.

Untuk fitur APK, Java 11+ dan `bun run apk:setup` tetap diperlukan; baca [APK statis](./features.md#apk-statis). Docker builder memasang JADX terverifikasi, generate Prisma, lalu build. Runner menggunakan JRE 17 dan menyalin JAR/catatan verifikasi yang ikut tracing standalone. APK asli memakai direktori temp per job dan dibersihkan.

Konfigurasi broker:

```dotenv
SANDBOX_BROKER_KEY=<kunci-acak-minimal-32-karakter>
SANDBOX_BROKER_URL=http://127.0.0.1:4011
SANDBOX_PUBLIC_URL=http://localhost:4010
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Port 4010/4011 diikat ke loopback host pada compose sandbox. Next yang berjalan langsung di host memakai `127.0.0.1:4011`. Aplikasi dalam Docker bergabung dengan network `guardian-sandbox-control` dan memakai `http://guardian_sandbox_broker:4011`. Mulai broker sebelum compose aplikasi agar external network sudah tersedia.

```powershell
bun run docker:build
bun run docker:up
docker compose -f docker/docker-compose.yml down
bun run sandbox:down
```

Container pengguna selalu memiliki watchdog sendiri maksimal 180 detik. Menghentikan broker tidak memperpanjang sesi; restart broker merekonsiliasi sumber daya berlabel Guardian. Jangan menjalankan dua broker pada Docker daemon yang sama karena label cleanup dan nama layanannya memakai namespace yang sama.

## Batas kapasitas dan jaringan

- Maksimal tiga sesi global dan satu sesi berjalan per akun.
- Chromium: 1 CPU, memori/swap limit 1536 MiB, shared memory 256 MiB, 512 PID.
- Proxy sesi: memori/swap limit 256 MiB dan file descriptor Squid 1024; batas FD mencegah alokasi berlebih pada Docker host dengan ulimit tinggi.
- Browser tidak privileged, tanpa capability tambahan, tanpa mount host atau akses socket Docker. Container tepercaya broker memegang socket Docker; Next tidak memegangnya.
- Jaringan internal unik per sesi menghubungkan broker, browser, dan proxy. Proxy juga memiliki jaringan egress; browser tidak memiliki jalur internet langsung.
- Chrome memakai proxy wajib dan mengarahkan unduhan ke tmpfs server, memblokir clipboard/perangkat/akun. Squid menolak tujuan lokal, metadata, dan alamat khusus untuk permintaan awal serta permintaan setelah redirect/resolusi DNS.
- Setiap sesi mempunyai kata sandi VNC acak yang hanya ada pada broker/container. Tiket stream HMAC berlaku sampai deadline sesi; hapus log atau telemetry yang merekam URL tiket. Logging stdout container pengguna dinonaktifkan.

KasmVNC menggunakan WebSocket melalui broker; IP UDP dikonfigurasi loopback agar startup tidak memerlukan STUN dari jaringan terisolasi. Unduhan hanya berada pada tmpfs 64 MiB di container, tanpa auto-open. python3-watchdog/inotify mengarantina maksimal empat APK/50 MiB per berkas. API privat broker membaca berkas via Docker exec, memverifikasi SHA-256, dan membatasi satu transfer. Jalur file stream diblokir; tidak ada volume unduhan diekspor ke host/aplikasi.

## Deployment publik

Gunakan host sandbox khusus, image terverifikasi yang diperbarui, HTTPS untuk aplikasi dan host stream, serta reverse proxy yang meneruskan WebSocket Upgrade. Container berbagi kernel host; pembatasan ini bukan pengganti VM terpisah untuk lingkungan malware berisiko tinggi.

Host stream harus satu site dengan aplikasi agar cookie HttpOnly SameSite dapat dipakai iframe, misalnya `app.example.com` dan `sandbox.example.com`. `SANDBOX_PUBLIC_URL` adalah origin stream HTTPS; `NEXT_PUBLIC_APP_URL` menjadi origin aplikasi yang diizinkan oleh CSP `frame-ancestors` dan validasi Origin. API 4011 hanya boleh dijangkau aplikasi melalui jaringan kontrol, bukan reverse proxy publik. Jangan publikasikan socket Docker, port VNC, proxy egress, atau ADB.

Redroid membutuhkan host Linux dengan dukungan binder dan streaming Android terisolasi. Runtime Android belum disediakan pada konfigurasi aktif. Jangan mengaktifkan container privileged/ADB publik sebagai pengganti dukungan yang belum tersedia; gunakan pemeriksaan statis sampai runtime Android benar-benar disediakan.

## Verifikasi

Perintah dan prasyarat pemeriksaan runtime berada pada [TEST_PLAN.md](../TEST_PLAN.md#pemeriksaan-runtime-sandbox). Jangan menjalankannya tanpa persetujuan.

## Output standalone

Untuk hasil build Next lokal, salin `public` dan `.next/static` ke direktori pendamping pada `.next/standalone`, buat direktori tujuan terlebih dahulu, lalu jalankan `node --env-file=.env .next/standalone/server.js`. Set `PORT`/`HOSTNAME` bila diperlukan. Native library Sharp dan JAR JADX ikut melalui `outputFileTracingIncludes`; jangan hanya menyalin satu executable server.

# Deployment Guardian Lab

Runbook referensi untuk pekerjaan infrastruktur yang diminta pengguna. Eksekusi pemeriksaan tetap mengikuti [AGENTS.md](../AGENTS.md#eksekusi-pengujian).

## Komponen aktif

| Komponen           | Peran                                                    | Akses                                            |
| ------------------ | -------------------------------------------------------- | ------------------------------------------------ |
| Next.js dev/standalone | UI, autentikasi, API, Prisma/MySQL, ekstraksi APK statis | Port aplikasi 3000                            |
| MySQL development | Database lokal persisten untuk stack Compose              | Hanya jaringan aplikasi, tanpa port host        |
| Python ML v6       | Indikator offline untuk URL dan hasil dekode QR          | API 8001 privat, hanya backend Next              |
| Sandbox broker     | Orkestrasi Docker, tiket stream, reaper                  | API 4011 khusus aplikasi; stream 4010            |
| Chromium/KasmVNC   | Satu browser sementara per sesi                          | Port VNC tidak dipublikasikan                    |
| Squid              | Egress publik berbatas tujuan untuk satu sesi            | Hanya jaringan internal sesi dan jaringan egress |

Model URL/QR dihubungkan melalui layanan Python terpisah. Redroid belum menjadi layanan aktif; karantina unduhan APK dan bedah statis sudah berjalan lokal. Kontrak sesi dan karantina ada di [sandbox](./features.md#sandbox-web-dan-karantina); kuis dan CMS ada di [Academy](./features.md#academy-dan-cms).

## Development dengan Compose

Gunakan Docker Engine Linux atau Docker Desktop dengan Linux containers serta Docker Compose 2.32.2+. File utama development adalah `docker/docker-compose.dev.yml`; file Compose aplikasi dengan nama lama sudah diganti. Letakkan checkout `guardian-lab-ai` di sebelah `guardian-lab`.

Jalankan `make key-generate` untuk menyiapkan `.env` serta key internal, sesuai [generator key](#generator-key-internal). Jika GNU Make tidak tersedia, salin `.env.example` hanya bila `.env` belum ada dan isi kedua key secara manual dengan nilai acak minimal 32 karakter. `FONNTE_TOKEN` tetap diperlukan untuk OTP akun biasa. Untuk akses lokal gunakan `NEXT_PUBLIC_APP_URL=http://localhost:3000` dan `SANDBOX_PUBLIC_URL=http://localhost:4010`. Compose menetapkan alamat database, model dan broker di dalam jaringan container; nilai `DATABASE_URL`/`GUARDIAN_ML_URL` untuk proses host tidak perlu diganti.

Dari root `guardian-lab`, jalankan satu perintah dan biarkan terminal tetap berjalan:

```bash
docker compose --env-file .env -f docker/docker-compose.dev.yml up --build --watch
```

Dengan GNU Make di host, cukup jalankan `make dev`, `make run` atau `make up`. Makefile memakai konfigurasi Compose di atas dan menentukan path dari lokasi Makefile, sehingga juga dapat dipanggil melalui `make -f guardian-lab/Makefile dev` dari folder induk. Target default `make` hanya menampilkan bantuan dan tidak menjalankan layanan.

| Perintah Make | Kegunaan |
| --- | --- |
| `make help` | Daftar shortcut tanpa memerlukan `.env` atau Docker aktif. |
| `make key-generate` | Buat `.env` bila perlu dan isi key internal kosong/placeholder, sebelum Compose dijalankan. |
| `make dev` / `make run` / `make up` | Build dan jalankan stack dengan Watch di foreground. |
| `make down` | Hapus container/network sambil mempertahankan volume database. |
| `make build` | Build image development; `SERVICE=ml` membatasi ke model. |
| `make logs` | Ikuti 100 baris log terakhir; `SERVICE=app` membatasi ke aplikasi. |
| `make ps` / `make shell` | Status semua container / shell aplikasi yang berjalan. |
| `make config` | Validasi konfigurasi Compose tanpa mencetak nilai environment. |
| `make db-migrate` | Terapkan migrasi yang tersedia pada database development. |
| `make db-seed` / `make academy-seed` | Seed akun demo dan materi / hanya materi Academy. |

Perintah database/shell memerlukan container aplikasi yang berjalan. Startup tetap menjalankan migrasi serta seed Academy; target Make tersedia untuk pemakaian manual. `bun run docker:dev` dan `bun run docker:up` juga tersedia bila Bun terpasang di host. `docker:build` membangun image development, dan `docker:down` menghentikan serta menghapus container/network tanpa menghapus volume database.

Stack mencakup Next.js development pada `http://localhost:3000`, MySQL 8.4, Python v6, broker, serta persiapan image browser/proxy sandbox. Konfigurasi sandbox digunakan kembali melalui Compose `include`; broker menunggu image browser/proxy selesai disiapkan. Tidak perlu menjalankan Compose sandbox terpisah. Jangan menjalankan broker standalone bersamaan dengan stack ini karena keduanya memakai namespace sesi dan nama broker yang sama.

Image development menggunakan stage `development` berbasis Node.js 22 pada Dockerfile aplikasi. Dependency Linux dipasang dengan Bun, sedangkan dev server Next/Turbopack serta worker-nya dijalankan secara eksplisit dengan binary Node.js native. JRE 17 dan JADX terverifikasi tetap tersedia, dan proses aplikasi memakai user non-root. Startup menunggu database sehat, menjalankan Prisma generate, `prisma migrate deploy` dan seed materi Academy sebelum membuka server. Migrasi gagal menghentikan startup; tidak ada `db push`, reset, atau pembuatan migrasi otomatis. Perubahan schema perlu disertai file migrasi yang sesuai.

Jika form lokal ditolak dengan pesan “Permintaan berasal dari situs yang tidak diizinkan”, lihat [kontrak pemeriksaan Origin](./features.md#autentikasi-dan-akses). Next dijalankan dengan bind `0.0.0.0` agar dapat diakses melalui port Docker; URL internalnya dapat berbeda dari `localhost:3000` pada browser. Pemeriksaan bersama di `lib/auth/access.ts` menangani perbedaan ini. Source diperbarui melalui Watch; muat ulang halaman setelah sinkronisasi. Gunakan alamat lokal yang konsisten dengan `NEXT_PUBLIC_APP_URL` agar alur form dan sandbox memakai origin yang sama.

Jika muncul `Cannot find module '@prisma/client-…'` dari chunk Turbopack, periksa runtime Node dan symlink external package di `.next/dev/node_modules`. Image Bun tanpa Node native dapat menjalankan Next melalui `bun-node-fallback-bin/node`, walaupun Prisma sudah digenerate dan symlink ada. [Laporan upstream](https://github.com/vercel/next.js/issues/86866) mencatat pola yang sama. Stage development memakai Node native untuk menghindari jalur resolver tersebut. Setelah perubahan Dockerfile, hentikan Watch lama lalu jalankan ulang `make run` agar image aplikasi dibangun ulang. Cache `.next` berada di container dan tidak dipasang dari host; tidak perlu menghapus database, mengganti import Prisma, atau membuat alias package hash secara manual.

MySQL memakai database `guardian_lab`, akun lokal `guardian`/`guardian_dev`, dan volume `mysql-dev` milik proyek `guardian-lab-dev`. Port database tidak dipublikasikan. Stack tidak mengimpor atau memigrasikan database host. Volume bertahan ketika stack dihentikan atau dibuat ulang. Akun demo tidak dibuat otomatis; bila dibutuhkan pada database development ini, jalankan sekali:

```bash
make db-seed
```

Seeder serta daftar akun mengikuti [autentikasi](./features.md#autentikasi-dan-akses). Seed materi Academy bersifat idempoten dan tidak menimpa kuis yang sudah diedit.

### Pembaruan kode otomatis

Compose Watch mengikuti source selama perintah `up --build --watch` aktif. [Panduan Watch](https://docs.docker.com/compose/how-tos/file-watch/) menjelaskan mekanisme sinkronisasi dan rebuild; source host tidak dipasang di atas dependency Linux dalam image.

| Perubahan | Tindakan development |
| --- | --- |
| Source Next.js, komponen, CSS dan aset publik | Sinkronisasi ke `/app`; Next dev melakukan Fast Refresh atau memuat ulang konfigurasi terkait. |
| `package.json`, `bun.lock`, Prisma, toolchain JADX, Dockerfile/entrypoint aplikasi, `.dockerignore` | Rebuild aplikasi; startup meregenerasi Prisma dan menerapkan migrasi yang tersedia. Dependency harus tetap cocok dengan lockfile. |
| Source runtime/policy/provenance/dependency, Dockerfile dan healthcheck model yang diizinkan `.dockerignore` repo AI | Rebuild model melalui installer dan guard asli; tidak ada perubahan preprocessing beku atau bypass checksum. |
| Source/dependency broker | Rebuild dan restart broker; sesi sandbox dapat ditutup saat rekonsiliasi. |
| Konfigurasi/image browser dan egress | Rebuild image sandbox; sesi baru memakai image terbaru. |

`node_modules`, `.next`, `.tools`, Git, environment dan data/model lokal tidak disinkronkan. Saat source model yang diikat manifest berubah, manifest harus diperbarui secara sah dan parity diverifikasi pada cakupan yang disetujui. Build ditolak jika guard tidak cocok; lihat error Watch karena kegagalan rebuild dapat mempertahankan container lama. Dataset/notebook bukan sumber runtime yang dipantau.

Perubahan file Compose atau `.env` memerlukan menghentikan perintah lalu menjalankan ulang perintah yang sama agar konfigurasi container dimuat ulang. Perubahan kode saat Watch mati juga terbawa pada build berikutnya. Tahap `runner` Dockerfile aplikasi tetap untuk output production standalone; Compose development tidak memakai tahap itu.

Tekan Ctrl+C untuk menghentikan proses foreground. Untuk menghapus container/network sambil mempertahankan database:

```bash
make down
```

### Generator key internal

Generator berjalan lewat `make key-generate` menggunakan image `node:22-alpine` yang juga dipakai broker. GNU Make dan Docker diperlukan di host; Node/Bun, dependency aplikasi, serta stack Compose belum perlu berjalan. Container generator menggunakan user pemanggil dan jaringan nonaktif; pull image pertama tetap memerlukan akses registry Docker.

```bash
make key-generate
make key-generate KEY=SESSION_SECRET
make key-generate KEY=SANDBOX_BROKER_KEY
```

Default `KEY=all` mengelola dua key yang memang diperlukan aplikasi. Masing-masing key baru memakai 32 byte acak kriptografis yang ditulis sebagai 64 karakter hex, tanpa prefix Laravel `base64:`. Generator membuat `.env` dari template bila belum ada; nilai non-key, komentar, dan format baris dipertahankan. Nilai key yang sudah terisi tidak diganti; nilai custom yang kurang dari 32 karakter ditolak agar penggantian tetap eksplisit. Fallback `AUTH_SECRET` yang valid dipakai kembali sebagai `SESSION_SECRET` bila canonical key masih kosong/placeholder, sehingga tidak mengganti secret autentikasi yang sudah ada. Referensi variabel pada fallback tersebut ditolak agar tidak membuat referensi melingkar; isi nilai konkret atau pilih rotasi secara eksplisit.

Untuk penggantian key secara sengaja, gunakan `FORCE=1`, misalnya:

```bash
make key-generate KEY=SESSION_SECRET FORCE=1
```

Tanpa `KEY`, `FORCE=1` mengganti kedua key. Rotasi `SESSION_SECRET` memengaruhi token JWT/OTP yang memakai key lama; rotasi key broker memengaruhi autentikasi internal dan tiket stream. Setelah perubahan `.env`, hentikan dan jalankan ulang `make dev` agar aplikasi dan broker memakai konfigurasi baru. Generator tidak memulai atau me-restart layanan.

Nilai secret tidak dicetak atau dikirim ke layanan eksternal. File ditulis atomik dengan permission `0600`; key duplikat, format yang tidak dapat diperbarui dengan aman, symlink `.env`, atau perubahan file bersamaan ditolak sebelum penggantian. `.env.keygen.tmp` mencegah dua generator menulis bersamaan dan dibersihkan saat selesai. Bila proses terputus dan file itu tertinggal, pastikan tidak ada generator aktif sebelum menghapus file sementara lalu mencoba lagi. File environment/temp tetap diabaikan Git dan konteks build.

`FONNTE_TOKEN` serta credential provider lain harus diperoleh dari penyedianya dan tidak disentuh generator. Password/tiket sesi sandbox yang sudah dibuat otomatis oleh runtime juga tidak ditambahkan sebagai key statis baru. Sumber implementasi: [Makefile](../Makefile) dan [generator](../scripts/generate-keys.mjs).

## Alternatif menjalankan proses di host

Gunakan MySQL 8, Bun, Docker Engine Linux, dan salinan `.env.example` menjadi `.env`. Jangan menimpa `.env` yang telah berisi konfigurasi lokal. Buat kunci broker acak minimal 32 karakter dan simpan sebagai `SANDBOX_BROKER_KEY`; jangan masukkan kunci ke git atau URL.

Verifikasi WhatsApp memerlukan `FONNTE_TOKEN` perangkat yang terhubung dan kuota Fonnte; token hanya di server. Set `AUTH_TRUST_PROXY=true` hanya jika proxy tepercaya menghapus dan mengganti `X-Forwarded-For`; default `false` menggunakan batas bersama. Seeder lokal mengisi akun demo beserta status nomor terverifikasi; daftar dan nomor berada di [demo-accounts.ts](../prisma/seeders/demo-accounts.ts), dan seeder menolak production. Aplikasikan migrasi dan generate Prisma Client sesuai alur deployment sebelum mengaktifkan perubahan auth; tanpa token/perangkat Fonnte, OTP tidak dapat terkirim.

```powershell
bun install --frozen-lockfile
bunx prisma migrate deploy
bunx prisma generate
bun run apk:setup
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

Port 4010/4011 diikat ke loopback host pada Compose sandbox. Next yang berjalan langsung di host memakai `127.0.0.1:4011`. Pada Compose development lengkap, aplikasi dan broker berbagi network kontrol, Next memakai `http://broker:4011`, dan broker/network disiapkan otomatis. Script sandbox terpisah hanya diperlukan pada alternatif proses host.

```powershell
bun run sandbox:down
```

Container pengguna selalu memiliki watchdog sendiri maksimal 180 detik. Menghentikan broker tidak memperpanjang sesi; restart broker merekonsiliasi sumber daya berlabel Guardian. Jangan menjalankan dua broker pada Docker daemon yang sama karena label cleanup dan nama layanannya memakai namespace yang sama.

## Layanan model URL/QR

Letakkan checkout `guardian-lab-ai` di sebelah `guardian-lab`. Python 3.12 dan pemasangan artifact hanya diperlukan pada layanan model; Next tetap memakai Bun. Kontrak hasil aplikasi berada pada [fitur model](./features.md#model-urlqr).

Untuk menjalankan Python langsung, buka terminal pada root `guardian-lab-ai`:

```bash
python3.12 -m venv .venv
.venv/bin/python -m pip install -e "./ml[serve]"
.venv/bin/python scripts/install_v6_model.py
.venv/bin/python -m uvicorn guardian_ml.shadow_service:create_app --factory --host 127.0.0.1 --port 8001 --workers 1 --no-access-log
```

Pada Windows gunakan `.venv/Scripts/python.exe`. Installer mengunduh artifact dan metadata asli dari release yang terikat checksum. Tidak perlu dataset, notebook, atau training. Binary tetap diabaikan Git. Simpan `GUARDIAN_ML_URL=http://127.0.0.1:8001` pada konfigurasi server Next yang sudah ada, kemudian jalankan aplikasi seperti biasa; jangan menimpa `.env` atau menambahkan prefix `NEXT_PUBLIC_` pada alamat model.

Compose development membangun image model dari repo di sebelahnya, memasang artifact terverifikasi saat build, dan mengatur alamat Next menjadi `http://ml:8001`. Layanan `ml` dimulai bersama stack dan Watch memicu rebuild saat runtime model berubah. Runtime model non-root, read-only, satu worker, dan hanya berada di jaringan `ml-internal` tanpa akses internet langsung atau port host. Tidak perlu CORS karena browser tidak mengakses Python. Jangan menjalankan Python host secara terpisah ketika memakai stack development lengkap.

Healthcheck container membaca `/health`: siap bila `model_available=true` dalam mode shadow. `production_ready=false` tetap benar dan bukan kegagalan healthcheck. Aplikasi bergantung pada proses model mulai, bukan healthcheck lulus, sehingga website tetap tersedia saat model rusak; tunggu model sehat sebelum pemeriksaan awal.

Untuk diagnosis pada lingkungan yang diizinkan, baca status container `ml` dan healthcheck. Model unavailable biasanya berarti artifact/metadata hilang, checksum source berubah, atau dependency berbeda. Pertahankan sumber serta struktur direktori dari manifest; jangan menonaktifkan guard atau mengganti threshold. Build membutuhkan jaringan untuk dependency dan release resmi; jika download gagal, build berhenti tanpa model pengganti. Model, dependency, dan asal artifact mengikuti dokumen repo AI; pembaruan model berikutnya perlu verifikasi kontrak dan parity sebelum dipakai.

Website memakai model bagi akun terverifikasi tanpa gerbang admin tambahan. Status model tetap riset nonkomersial dan belum memenuhi validasi produksi; pengembangan dan validasi sebelum rilis tidak diselesaikan oleh integrasi ini. Jangan mempublikasikan API Python atau memasukkan URL, body request, credential, dan alamat layanan ke log aplikasi.

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

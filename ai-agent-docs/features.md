# Kontrak Fitur Guardian Lab

Baca hanya bagian fitur yang dikerjakan. Batas produk/keamanan dan izin pengujian mengikuti [AGENTS.md](../AGENTS.md). Rute ada di [lib/routes.ts](../lib/routes.ts); skema dan batas rinci dibaca dari file kode yang ditautkan, bukan disalin ke dokumen ini.

## Status aktif

- URL/QR, ekstraksi APK statis, sandbox web, Academy, Share Card, dan komunitas terhubung dengan MySQL.
- Model AI/DeepSeek belum dipanggil endpoint investigasi. Input baru menghasilkan `UNAVAILABLE` dengan risiko `null`; fakta statis APK tetap tersedia. Tidak ada skor heuristik pengganti, worker, atau proses ulang otomatis.
- Share Card dan kontribusi komunitas hanya menerima hasil lengkap, sehingga input baru belum dapat membuka keduanya. Fixture hasil lengkap hanya untuk pengujian terisolasi.
- Android dinamis, viewport ponsel remote, dan thumbnail sesi belum tersedia. Halaman Android menawarkan APK statis; API menolak dengan 503 tanpa sesi palsu.

## Autentikasi dan akses

- Registrasi memerlukan nomor WhatsApp unik; normalisasi memakai format internasional dengan Indonesia sebagai default. Registrasi dan login akun belum terverifikasi membuat sesi sementara khusus OTP, bukan sesi aplikasi. Selama sesi itu pengguna dapat memperbaiki nomor yang keliru; perubahan membatalkan kode dan challenge lain. OTP enam digit dikirim melalui Fonnte; verifikasi nomor satu kali diperlukan sebelum sesi USER/ADMIN diterbitkan. Login berikutnya untuk nomor terverifikasi memakai email/password.
- Lupa password menerima nomor WhatsApp, lalu OTP dan password baru. Respons permintaan bersifat umum untuk mencegah pengungkapan akun; reset berhasil mencabut sesi lama dan membuktikan kepemilikan nomor. OTP memiliki masa berlaku, batas percobaan/pengiriman ulang, dan penyimpanan hash; isi kode serta token gateway tidak masuk log. Respons Fonnte diterima sebagai antrean, bukan bukti pesan sampai.
- Landing, statistik publik, dan halaman informasi tetap terbuka; halaman fitur serta API memerlukan sesi USER/ADMIN. Default setelah login/registrasi: USER ke landing, ADMIN ke `/admin`. Tujuan eksplisit `/apk` beserta query aman dipertahankan untuk kedua peran; tujuan USER lain tetap dibatasi ke landing.
- Navbar landing untuk tamu menaut ke section Beranda, Fitur, Cara Kerja, Komunitas, dan Mulai; setelah login menu berganti menjadi halaman fitur. Pada halaman informasi, tamu maupun pengguna masuk melihat Beranda serta tautan Tentang Guardian Lab, Kebijakan Privasi, dan Ketentuan Penggunaan. Navbar halaman fitur memakai menu fitur dengan gaya visual yang sama. Perilaku berlaku pada desktop dan menu ponsel; tautan section mempertahankan query halaman.
- `proxy.ts` hanya pemeriksaan JWT awal. Server tetap memverifikasi sesi database, kedaluwarsa/pencabutan, pemilik, dan peran terbaru. API mengembalikan 401 untuk tamu dan 403 untuk hak yang tidak cukup; mutasi memeriksa Origin.
- USER hanya membaca investigasi/sandbox miliknya; admin dapat meninjau sesuai perannya. Tautan hasil bukan akses publik. Data akun memakai `private, no-store`, scope akun/peran, dan tidak masuk cache bersama.
- Registrasi selalu USER. Password bcrypt maksimal 72 byte UTF-8; email maksimal 191 karakter. Body login/registrasi dibatasi 16 KiB melalui stream. Cookie HTTP-only, SameSite Lax, Secure saat production, masa berlaku tujuh hari. Logout mencabut sesi database dan cookie.
- `SESSION_SECRET` minimal 32 karakter tanpa nilai pengganti. Dengan Cache Components, baca sesi di batas Suspense yang sesuai.
- `bun run db:seed` hanya untuk lokal: empat akun demo, nomor, dan perannya ditetapkan di [demo-accounts.ts](../prisma/seeders/demo-accounts.ts); nomor akun seed ditandai terverifikasi sesuai permintaan pemilik. Seed menolak production, mempertahankan riwayat/EXP, dan mencabut sesi serta challenge bila password/peran/nomor berubah. Registrasi pengguna biasa tetap mengikuti verifikasi WhatsApp. Login memperbarui aktivitas masuk, bukan streak belajar.

Sumber: [lib/auth/](../lib/auth/), [validasi auth](../lib/validations/auth.ts), dan [proxy.ts](../proxy.ts).

## Rekaman investigasi

`ForensicRecord` menjadi sumber tunggal ID, pemilik, jenis input, status, metadata, bukti, sumber/versi model, serta waktu proses untuk landing, riwayat, dan tindak lanjut. Tidak ada ID hasil sementara atau tabel riwayat tandingan.

| Status                               | Transisi yang diperbolehkan           |
| ------------------------------------ | ------------------------------------- |
| `RECEIVED`                           | `PROCESSING`, `FAILED`, `UNAVAILABLE` |
| `PROCESSING`                         | `COMPLETED`, `FAILED`, `UNAVAILABLE`  |
| `COMPLETED`, `FAILED`, `UNAVAILABLE` | Terminal                              |

- Transisi atomik memeriksa pemilik dan status sebelumnya; perubahan hasil hanya lewat layanan internal server. `COMPLETED` memerlukan hasil tervalidasi, sumber, serta versi model.
- Sebelum hasil tersedia, `riskLevel`, `riskScore`, `scamCategory`, dan `summary` bernilai `null`. Skor `0` hanya untuk hasil nyata; `startedAt` terisi saat proses dimulai dan `finishedAt` saat terminal.
- URL/QR menyimpan penerimaan dan ketidaktersediaan model dalam satu transaksi. APK melalui `PROCESSING` dan menyimpan laporan statis beserta status akhir secara atomik.
- Respons 201 berarti rekaman tersimpan, bukan penilaian risiko selesai. Persistensi gagal tidak mengembalikan ID sukses.
- Sanitasi PII, kredensial URL, nilai query/fragment, serta bukti dilakukan sebelum persistensi. Target sensitif tersimpan sebagai representasi tersanitasi; pemeriksaan lanjutan dapat memerlukan input ulang. Sanitasi juga wajib sebelum panggilan AI berikutnya.
- Rekaman lama `LEGACY_UNVERIFIED` tidak dianggap hasil model terverifikasi. Helper DeepSeek/leksikal lama tetap tidak aktif.

Sumber: [layanan investigasi](../lib/investigations/service.ts), [skema/DTO](../lib/validations/investigation.ts), [sanitasi](../lib/investigations/privacy.ts), dan [PII Scrubber](../lib/security/pii-scrubber.ts).

## Input URL, QR, dan APK

- Landing menyediakan bar URL dan dialog unggah QR. `?tab=qr` membuka dialog setelah hydration bila tidak sedang menampilkan hasil; tombol QR memakai push history, penutupan memakai replace ke `tab=url`. Back/Forward menyelaraskan tampilan. Pengiriman tetap manual dan membutuhkan login.
- QR dan autentikasi tidak tampil sebagai dua modal sekaligus. Pembatalan login mengembalikan dialog QR beserta pilihan lokalnya; setelah login berkas dipilih ulang. Berkas tidak disimpan pada URL/storage browser.
- APK berada di `/apk`, dengan sesi database wajib sebelum uploader tampil. Proxy menjadi pemeriksaan awal; API tetap mengotorisasi sebelum membaca berkas. Login/registrasi dari APK kembali ke tujuan APK yang aman untuk USER/ADMIN, termasuk saat sesi sudah aktif.
- Hasil APK memakai `?investigation=<id>` dan mode yang sama dengan presenter bersama; ID jenis lain mengarah ke detail riwayat. Tautan lama `/?tab=apk` dialihkan ke halaman APK, hanya mempertahankan ID/mode yang valid.
- Validasi tampil di dekat input. Berkas pengganti tidak valid menghapus pilihan lama; perubahan input membersihkan hasil tampilan tanpa menghapus rekaman. Pending dan kunci sinkron mencegah submit ganda; tidak ada retry pengiriman otomatis.
- URL diketik atau ditempel menggunakan cara bawaan perangkat; tombol unggah QR berada di kolom yang sama. Validasi URL saat submit memfokuskan input tanpa menggeser tombol saat klik.
- URL langsung dan hasil QR memakai satu jalur validasi tanpa membuat rekaman URL kedua. HTTP/HTTPS saja; domain lengkap tanpa protokol memakai HTTPS. Tolak kredensial URL, spasi internal, karakter kontrol, dan backslash. Penerimaan input tidak mengunjungi target.
- Batas URL 16.384 karakter setelah normalisasi. QR menerima PNG/JPG/WebP statis, maksimal 5 MiB dan 16 juta piksel; decoder Sharp/jsQR membaca piksel nyata, orientasi, ruang warna, dan alpha. APK satu berkas `.apk`, maksimal 50 MiB.
- Request dibatasi dari ukuran stream aktual, termasuk tanpa Content-Length. Kontrak JSON/multipart dan overhead berada pada kode pembaca request.
- QR tidak terbaca, non-URL, atau URL tidak valid menghasilkan rekaman `FAILED`, respons 422, dan ID. Isi non-URL tidak disimpan. Input kosong/ganda/metadata salah ditolak sebelum rekaman dibuat.
- Kegagalan server mempertahankan input. Bila respons penyimpanan tidak dapat dipastikan, jelaskan status belum diketahui dan arahkan ke riwayat sebelum kirim ulang. Object URL pratinjau dicabut ketika berganti/unmount.

Sumber: [skema input](../lib/validations/analysis-input.ts), [request reader](../lib/investigations/request-input.ts), [penerimaan URL](../lib/investigations/receive-url.ts), [QR decoder](../lib/analysis/qr.ts), [gateway URL/QR](../components/landing/use-analysis-gateway.ts), [uploader APK](../components/apk/apk-investigation.tsx), dan [hook pengiriman](../lib/hooks/use-investigation-submit.ts).

## Hasil dan riwayat

- Landing/detail/list menggunakan DTO yang sama. `?investigation=<id>&tab=<jenis>` memuat ulang hasil tersimpan; `?mode=geek` mempertahankan mode. Pergantian akun/ID membersihkan data lama dan respons terlambat diabaikan.
- `RECEIVED`/`PROCESSING` dipoll tiga detik ketika halaman terlihat; terminal menghentikan polling. Refresh/fokus hanya GET, tanpa membuat investigasi baru. Timeout 15 detik memakai AbortController baru pada setiap request agar retry tetap bekerja.
- Hasil lengkap memerlukan status `COMPLETED`, sumber/versi, skor 0–100, kategori, ringkasan, dan bukti valid. Label/warna mengikuti verdict tersimpan; hasil parsial/legacy tidak membuka ekspor atau kontribusi.
- Mode manusia/teknis membaca bukti tersimpan yang sama. Jangan menambahkan C2, permissions, entropy, atau narasi penipuan ketika bukti tidak ada. DTO tidak mengirim relasi identitas akun dan menyaring ulang data legacy tanpa mengubah baris asal.
- Riwayat menggunakan envelope `records`, `pagination`, `summary`; default 12/maksimal 50 per halaman. Filter jenis/risiko/status/pencarian/tanggal diterapkan sebelum pagination, urutan `createdAt` dan `id` menurun.
- Total/agregasi berasal dari seluruh hasil terfilter pada snapshot database yang sama. Risiko hanya menghitung hasil lengkap terverifikasi. Tanggal API UTC; kontrol UI mengubah hari lokal menjadi rentang UTC. Filter tersinkron query dan kembali ke halaman satu saat berubah.
- Bedakan 401, 403, 404, filter salah, kosong, dan gangguan jaringan. Snapshot lama diberi label; respons rusak tidak menjadi hasil pengganti.

Sumber: [history](../lib/investigations/history.ts), [serialisasi](../lib/investigations/serialize.ts), [hook pembaca](../lib/hooks/use-api-resource.ts), dan [tampilan bersama](../components/shared/investigation-view.tsx).

## APK statis

- Server memeriksa ZIP/CRC/manifest lalu menjalankan JADX untuk manifest biner/resource dan DEX; APK tidak dipasang, dieksekusi, atau dikirim ke model. Java 11+ dan toolchain terverifikasi diperlukan; setup ada di [deployment.md](./deployment.md).
- Batas arsip, dekompresi, JVM, durasi, output, dan pembacaan sumber mengikuti [limits.ts](../lib/apk/limits.ts). Tolak traversal, symlink, duplikasi ambigu, enkripsi, arsip palsu, serta XML berbahaya.
- Satu ekstraksi aktif per proses aplikasi; sibuk mengembalikan 429 sebelum rekaman dibuat. Child process tanpa shell menggunakan environment terbatas, tanpa secret, serta cleanup direktori job miliknya setelah selesai/gagal/batal.
- `inputMetadata.apkStatic` menyimpan status `EXTRACTED`/`PARTIAL`, metadata manifest/izin, cakupan, origin dinonaktifkan, fingerprint indikator token, dan potongan Java tersanitasi. Binary/hasil mentah tidak disimpan permanen; pemeriksaan ulang memerlukan unggahan ulang.
- Izin adalah kemampuan yang diminta, bukan bukti pencurian. Data parsial menyatakan keterbatasan; indikator kosong tidak diisi dengan bukti buatan. Pemeriksaan tidak membuktikan installability atau seluruh perilaku runtime.
- Sukses statis: 201 dengan laporan dan status investigasi sesuai ketidaktersediaan model. Gagal setelah penerimaan: 422 dengan ID `FAILED`; input salah tanpa ID. Alasan ramah pengguna tidak membocorkan stdout/stderr atau path mesin.

Sumber: [lib/apk/](../lib/apk/), [kontrak laporan](../lib/validations/apk-static.ts), dan [toolchain](../lib/apk/toolchain.json).

## Sandbox web dan karantina

- Mulai hanya melalui aksi pengguna, bukan GET/pemuatan halaman. Target publik divalidasi; hapus query/fragment hanya setelah persetujuan, tolak PII pada path, IP literal, host lokal/khusus, dan port selain 80/443.
- UUID permintaan mencegah alokasi ganda. Target/sumber berasal dari database; sumber harus URL/QR yang dapat diakses dan cocok. Navigasi target baru tidak mengganti sesi yang masih aktif, serta mereset persetujuan parameter pada form.
- `STARTING` menjadi `ACTIVE` setelah stream siap. Tiket HMAC, cookie HttpOnly, dan kata sandi VNC acak melindungi stream. Polling membaca ulang status agar respons terlambat tidak mengaktifkan sesi terminal.
- Timer mengikuti deadline server. Stop menunggu konfirmasi penghapusan; kegagalan konfirmasi menghasilkan `UNKNOWN`. Tutup tab/logout tidak memperpanjang sesi. Watchdog/reaper membersihkan container dan jaringan.
- Browser melewati proxy egress yang memblokir alamat lokal/metadata setelah DNS dan redirect. Clipboard, perangkat, transfer file lokal, serta auto-open diblokir. Next tidak memegang socket Docker; detail kapasitas/jaringan ada di [deployment.md](./deployment.md).
- APK unduhan dikarantina pada server dengan nama UUID, hash, dan ukuran. Analisis memerlukan pemilik sesi aktif, memakai pipeline statis, dan menghasilkan ID investigasi dengan provenance. Mapping unik sesi/unduhan mencegah duplikasi; retry membaca hasil sama, termasuk setelah expiry. Container menghapus binary, laporan tersimpan tetap tersedia.

Sumber: [lib/sandbox/](../lib/sandbox/), [broker](../docker/sandbox/broker/), dan [validasi](../lib/validations/sandbox.ts).

## Academy dan CMS

- Kuis terbit, EXP, streak, lencana, dan latihan terbaru berasal dari MySQL. API sebelum penilaian tidak mengirim kunci/pembahasan.
- Server menilai seluruh set pilihan yang benar; kelulusan minimal 70% dari pecahan asli. Tolak soal/opsi hilang, asing, duplikat, revisi usang, dan kuis diarsipkan.
- Transaksi mengunci akun/revisi. EXP hanya pada kelulusan pertama per kuis; gagal/ulang nol EXP dan tetap tersimpan. UUID dengan jawaban sama mengembalikan attempt yang sama; payload berbeda pada UUID sama menghasilkan 409.
- Streak memakai hari kalender WIB dan `lastLearningAt`, terpisah dari login. Lencana Langkah Pertama setelah satu kelulusan tanpa bonus; jangan membuka lencana rekaan.
- CMS ADMIN mengelola soal tunggal/jamak/benar-salah, materi, draf/publikasi, dan arsip. Sanitasi diikuti validasi agar konten wajib tetap terbaca. Edit memakai revisi; arsip tidak menghapus attempt/EXP.
- Seed materi bersifat idempoten tanpa menimpa edit admin. Batas soal/opsi/EXP mengikuti skema; setup seed ada pada deployment.

Sumber: [lib/academy/](../lib/academy/) dan [validasi Academy](../lib/validations/academy.ts).

## Guardian Share Card

- `/act?id=...` membaca investigasi lengkap melalui ID, bukan target/skor/temuan dari query. Hasil stale yang gagal diperbarui tidak boleh diekspor.
- Satu representasi konten dipakai pratinjau, PNG, dan pesan. Skor nol valid; SAFE/LOW memakai kartu netral. Maksimal tiga temuan unik yang nyata, tanpa mengisi kekurangan dengan rekaan.
- Target/indikator dinonaktifkan dan PII disaring ulang. Jangan sertakan bukti mentah, token, identitas pemilik, atau tautan riwayat privat. Hostname dipertahankan lengkap; konten panjang dipersingkat dengan penanda.
- `html-to-image` mengekspor PNG 1200 px dari kanvas 600 px. Persiapan/error/retry terlihat; blob hanya di memori, dibuang saat scope/hasil berubah, dan object URL dicabut setelah penggunaan.
- Salin pesan menyediakan fallback manual. Berbagi file hanya jika didukung browser, dengan file siap sebelum klik; pengguna memilih aplikasi tujuan. Pembatalan dibedakan dari kegagalan. Tidak ada publikasi atau pengiriman pesan otomatis.

Sumber: [lib/share-card/](../lib/share-card/) dan [komponen Act](../components/act/).

## Komunitas, latihan, dan peringkat

- Pengajuan hanya menerima ID investigasi milik pengguna dan consent. Preview/snapshot disanitasi serta immutable setelah diajukan; perubahan sumber tidak mengubah bukti yang dimoderasi. `sourceRecordId` unik mencegah duplikasi.
- Status `PENDING_REVIEW` diputuskan atomik satu kali menjadi `APPROVED`/`REJECTED`. Persetujuan memerlukan konfirmasi privasi; penolakan memerlukan alasan. Admin tidak menyetujui pengajuan sendiri.
- Pending/ditolak privat bagi pemilik/admin; anggota hanya membaca snapshot disetujui yang valid, tanpa identitas pengaju atau bukti mentah. Sumber dihapus menyembunyikan kasus, sementara snapshot tetap dapat ditinjau pemilik/admin; akun dihapus mengikuti cascade.
- Snapshot publik hanya menyertakan bukti yang diizinkan: izin Android, entropy tersimpan, dan origin dinonaktifkan. Token, path/query C2, potongan kode mentah, serta ID investigasi privat tidak ikut.
- Latihan kasus memakai tiga soal dari snapshot; semua benar untuk lulus. Kelulusan pertama memberi 30 EXP dan lencana Pembaca Bukti tanpa bonus. Membaca/gagal/ulang tidak memberi EXP; revisi, transaksi, dan UUID menjaga idempotensi serta streak Academy.
- Leaderboard anggota memakai EXP USER aktual dan alias Guardian anonim, dengan pagination. Statistik landing berasal dari database; landing menampilkan pengantar Academy/komunitas dan FAQ tanpa peringkat contoh.
- Mutasi, filter, pagination, dan batas body mengikuti skema/API; tidak menerima skor atau bukti buatan klien.

Sumber: [lib/community/](../lib/community/), [validasi komunitas](../lib/validations/community.ts), dan [challenge](../lib/validations/community-challenge.ts).

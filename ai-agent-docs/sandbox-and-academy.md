# Tahap 8: Sandbox web dan Guardian Academy

## Status aktif

- Sandbox web memakai Chromium/KasmVNC pada container nyata. Tidak ada fallback simulasi.
- Academy dan CMS memakai data MySQL; EXP dan lencana mengikuti rekaman akun. Peringkat contoh pada landing publik merupakan pengecualian presentasi atas permintaan pengguna, tidak menambah EXP atau progres akun. Lihat [community.md](./community.md).
- Model AI masih belum terhubung. Membuka sandbox atau mengerjakan kuis tidak membuat kesimpulan risiko investigasi.
- Android dinamis belum diimplementasikan sebagai layanan aktif. Runtime lokal tidak menyediakan binder Redroid. Halaman Android menawarkan pemeriksaan APK statis; API Android mengembalikan 503 tanpa membuat sesi.
- Unduhan tetap berada di server. Watchdog/inotify mengarantina APK nyata untuk bedah statis manual; clipboard dan transfer langsung ke perangkat lokal diblokir. Viewport ponsel dan thumbnail sesi belum tersedia.

## Alur sandbox

1. USER/ADMIN masuk, lalu memilih **Buka di sandbox web** dari hasil/riwayat URL atau QR, atau memasukkan domain publik pada halaman sandbox.
2. Pengguna menekan **Mulai sesi 180 detik**. Halaman tidak membuat container saat dibuka.
3. Next memvalidasi URL dan meminta persetujuan eksplisit sebelum menghapus query/fragmen, menolak PII pada path, IP literal, host khusus/lokal, dan port selain 80/443.
4. Transaksi akun membatasi satu sesi berjalan per pengguna. ID permintaan UUID membuat retry tidak mengalokasikan sesi ganda.
5. Broker tepercaya membuat jaringan internal sesi, proxy egress, dan browser terpisah. Status database `STARTING` menjadi `ACTIVE` setelah stream benar-benar siap.
6. Stream HTTP/WebSocket memakai tiket HMAC khusus sesi, cookie HttpOnly, dan autentikasi VNC acak di server. Port VNC tidak dipublikasikan. Tiket berlaku sampai deadline sesi dan harus diperlakukan sebagai rahasia.
7. Polling mengonfirmasi status. Timer memakai selisih waktu server. Penghentian hanya mengubah status setelah provider mengonfirmasi penghapusan. Kegagalan konfirmasi menghasilkan `UNKNOWN`, bukan klaim bersih.
8. Browser dan proxy memiliki watchdog absolut maksimal 180 detik serta Docker `AutoRemove`. Reaper broker membersihkan jaringan; restart broker menghapus sumber daya dengan label milik Guardian. Tutup tab/logout tidak memperpanjang deadline.

Browser hanya terhubung ke jaringan internal sesinya. Broker tepercaya ikut jaringan tersebut untuk stream; proxy juga terhubung ke jaringan egress. Kebijakan Chrome memaksa proxy, menonaktifkan QUIC/non-proxied WebRTC/DoH, mengarahkan unduhan ke tmpfs server tanpa auto-open, memblokir sinkronisasi akun, dan akses perangkat. Squid menolak tujuan IP privat, loopback, link-local, metadata, multicast, dan alamat khusus setelah resolusi DNS. Pengalihan halaman tetap melalui proxy yang sama.

Container dibatasi CPU, memori, PID, shared memory, tanpa mount host atau mode privileged. Broker merupakan komponen tepercaya yang memegang socket Docker; aplikasi Next tidak memegang socket. Container berbagi kernel host, sehingga penyediaan layanan analisis situs berbahaya memerlukan host sandbox tersendiri dan pembaruan image terverifikasi. Pengujian lokal memakai halaman publik jinak, bukan malware hidup.

API terautentikasi: `GET /api/sandbox/session`, `POST /api/sandbox/session/start`, `POST /api/sandbox/session/stop`. USER hanya dapat membaca/menghentikan sesinya; admin dapat menghentikan sesi berdasarkan ID. Origin mutation diperiksa. `GET` tidak membuat container.

## Alur Academy

1. Daftar `/academy` memuat kuis terbit serta EXP, streak, kelulusan, lencana, dan 10 latihan terakhir dari akun aktif.
2. `/academy/[id]` merupakan tautan latihan yang dapat dimuat ulang. Respons publik hanya berisi teks, pilihan, dan penanda pilihan jamak; kunci dan pembahasan tidak dikirim sebelum penilaian.
3. Klien mengirim ID kuis, revisi ISO, UUID pengiriman, serta set pilihan untuk setiap ID soal. Server menolak soal hilang/tambahan, opsi asing/duplikat, revisi usang, dan kuis yang sudah diarsipkan.
4. Semua pilihan harus cocok dengan set kunci. Ambang kelulusan 70% memakai pecahan asli, bukan nilai yang telah dibulatkan.
5. Transaksi mengunci akun dan membaca revisi kuis secara konsisten. EXP diberikan hanya pada kelulusan pertama setiap kuis. Gagal/latihan ulang memperoleh nol EXP dan tetap tersimpan.
6. UUID yang sama dengan jawaban sama mengembalikan hasil tersimpan tanpa membuat attempt/hadiah baru. UUID sama dengan jawaban lain menghasilkan 409.
7. Streak dihitung berdasarkan tanggal kalender WIB melalui `lastLearningAt`, terpisah dari login. Satu hari dihitung sekali; hari terlewat memutus streak. Pengguna tanpa riwayat belajar menampilkan nol.
8. Lencana **Langkah Pertama** diberikan setelah satu kelulusan, tanpa bonus EXP tambahan. Lencana lain hanya tampil jika benar-benar tercatat pada akun.

CMS `/admin/quizzes` menyediakan pembuatan/edit soal tunggal, jamak, benar/salah, pembahasan, kategori, kesulitan, bobot EXP 0–500, dan publikasi. Daftar dibagi 10 kuis per halaman. Maksimal 30 soal dan 6 opsi per soal. Semua disanitasi sebelum disimpan. Edit memakai revisi untuk mencegah penimpaan perubahan admin lain. Pengarsipan menyembunyikan kuis tanpa menghapus attempt atau EXP pengguna.

API: daftar/detail kuis, `GET /api/academy/progress`, dan `POST /api/academy/submit-quiz`; CRUD admin tetap khusus ADMIN. Respons akun memakai `private, no-store` dan komponen diberi scope ID/role akun. Aksi jaringan panjang memakai pending/AbortController sendiri agar navigasi tidak tertahan oleh React Transition.

## Menjalankan dan memeriksa

```powershell
bunx prisma migrate deploy
bunx prisma generate
bun run academy:seed
bun run sandbox:build
bun run sandbox:up
bun run dev
```

Isi `SANDBOX_BROKER_KEY` dengan kunci acak minimal 32 karakter. Seed lokal `bun run db:seed` membuat empat akun yang diminta dan materi awal tanpa data investigasi/EXP contoh. Untuk materi saja: `academy:seed` hanya menambahkan tiga materi awal secara idempoten, tidak membuat akun atau menimpa kuis yang telah diedit. Konfigurasi jaringan/HTTPS ada di [deployment.md](./deployment.md).

```powershell
bun test
bunx tsc --noEmit
bun run lint
bun run build
node --env-file=.env scripts/verify-sandbox.mjs
node --env-file=.env scripts/verify-quarantine.mjs
node --env-file=.env scripts/verify-sandbox.mjs --watchdog
```

Tes Bun memakai database sementara dan provider HTTP fixture, tidak mengeksekusi Docker. Script runtime menguji container sungguhan, internet publik, penolakan IP lokal/metadata/domain DNS lokal, stream WebSocket, dan penghapusan manual. Opsi `--watchdog` membekukan broker lokal selama satu deadline untuk membuktikan pembersihan container tetap berjalan; jangan jalankan bersamaan dengan sesi pengguna. Script tidak melakukan deployment publik.

Rujukan: [Kasm Workspaces Images](https://github.com/kasmtech/workspaces-images), [konfigurasi KasmVNC](https://docs.kasmvnc.com/docs/developer/configuration/), [Docker bridge networking](https://docs.docker.com/engine/network/drivers/bridge/), dan [prasyarat Redroid](https://github.com/remote-android/redroid-doc).

## Konsistensi target dan karantina

Respons sesi memuat targetUrl dan sourceInvestigationId dari database. Membuka target baru ketika sesi lama masih aktif menampilkan target sesi sebenarnya dan pemberitahuan; pengguna harus menghentikan sesi sebelum memulai target baru. Sumber harus URL/QR yang dapat diakses dan cocok dengan target.

Navigasi query target/investigasi pada halaman sandbox memperbarui form dan mereset persetujuan parameter. Respons polling yang terlambat membaca kembali status database agar sesi yang sudah dihentikan tidak ditampilkan aktif. CMS Academy memvalidasi ulang teks setelah sanitasi supaya pertanyaan/pilihan wajib tetap terbaca.

APK selesai diunduh dipindahkan oleh python3-watchdog/inotify ke karantina pada tmpfs 64 MiB, maksimal empat APK dan 50 MiB per berkas. Nama asli dibuang. Metadata hanya UUID, ukuran, dan SHA-256. Tidak ada mount unduhan ke host atau aplikasi. Broker membaca melalui Docker exec dengan output berbatas dan memverifikasi hash; transfer binernya memerlukan secret broker. Jalur file KasmVNC diblokir.

POST /api/sandbox/session/:id/downloads/:downloadId/analyze memerlukan pemilik sesi aktif. Berkas melewati pipeline APK statis yang sama dan menghasilkan ID investigasi kanonis. Mapping unik sesi/unduhan mencegah duplikasi; retry mengembalikan hasil yang sama, termasuk setelah sesi kedaluwarsa. Hasil menyimpan provenance dan tetap UNAVAILABLE tanpa skor AI. Biner karantina dihapus bersama kontainer; hasil statis di riwayat tetap tersedia.

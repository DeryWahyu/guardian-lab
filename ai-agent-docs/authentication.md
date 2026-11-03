# Autentikasi, Sesi, dan Akses Berdasarkan Peran

## Perilaku Setelah Masuk

| Kondisi | Tujuan dan akses                                                                                                                        |
| :------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| Tamu    | Landing tetap terbuka. Analisis dan halaman fitur meminta login.                                                                        |
| `USER`  | Setelah login atau registrasi kembali ke landing `/`, dengan fitur yang memerlukan sesi terbuka. Tidak ada dashboard pengguna terpisah. |
| `ADMIN` | Setelah login menuju `/admin`, dengan navigasi dashboard, bank soal, dan moderasi kasus.                                                |

`getPostLoginRedirect()` pada [lib/auth/redirect.ts](../lib/auth/redirect.ts) menentukan tujuan login. Parameter redirect pengguna hanya dipertahankan jika masih mengarah ke landing, misalnya `/?tab=qr`; redirect ke fitur lain kembali ke landing. Admin selalu masuk melalui dashboard.

Pengguna yang sudah memiliki sesi valid dan membuka `/login` atau `/register` diarahkan sesuai perannya. Cookie yang kedaluwarsa atau dicabut tetap dapat membuka form login kembali.

## Pemeriksaan Akses

- [proxy.ts](../proxy.ts) memeriksa JWT untuk pengalihan awal. Pemeriksaan ini bersifat optimistis dan tidak menggantikan validasi sesi database.
- [lib/auth/session.ts](../lib/auth/session.ts) memvalidasi tanda tangan JWT, keberadaan sesi, waktu kedaluwarsa, kecocokan pengguna, dan peran terbaru dari database.
- Route Handler menggunakan `authorizeRequest(request)` atau `authorizeRequest(request, "ADMIN")`. Tamu menerima HTTP 401; pengguna biasa yang mengakses API admin menerima HTTP 403.
- Halaman fitur memakai layout terlindungi. Halaman login dan registrasi memeriksa sesi di server. Pembacaan data dashboard admin juga memverifikasi peran sebelum query.
- Pembacaan sesi berada di dalam batas Suspense sesuai konfigurasi Cache Components proyek. Sesi tidak dimasukkan ke cache bersama.
- Mutasi dengan header Origin dari situs lain ditolak. Pengujian langsung atau klien tanpa header Origin tetap memerlukan sesi untuk API terlindungi.

Halaman yang memerlukan sesi: `/history/*`, `/academy/*`, `/community/*`, `/sandbox/*`, dan `/act`. Halaman `/admin/*` hanya untuk admin. Semua API analisis, sandbox, history, Academy, komunitas, dan admin memeriksa sesi secara langsung.

Kepemilikan rekaman forensik dan sesi sandbox diperiksa pada server. Pengguna biasa tidak dapat membaca riwayat atau menghentikan sandbox pengguna lain. Kasus komunitas yang belum disetujui hanya dapat dilihat pemiliknya dan admin; replay hanya dapat dimainkan setelah disetujui. Kuis yang belum diterbitkan tidak tersedia bagi pengguna biasa.

## Pengelolaan Sesi dan Akun

- Registrasi publik selalu membuat role `USER`; payload role dari klien tidak memberikan hak admin.
- Password disimpan sebagai hash bcrypt. Pembuatan akun dan sesi registrasi dilakukan dalam transaksi.
- Password dibatasi 72 byte UTF-8 pada form/API dan fungsi hash/verifikasi untuk mencegah pemotongan bcrypt. Email maksimal 191 karakter mengikuti kolom database. Login/registrasi membaca JSON melalui stream maksimal 16 KiB; body berlebih ditolak dengan 413.
- Cookie `guardian_session` memakai HTTP-only, SameSite Lax, path `/`, dan Secure pada production. Masa berlaku JWT dan sesi database adalah tujuh hari.
- Logout menghapus sesi database dan cookie. Sesi yang dicabut atau kedaluwarsa ditolak pada permintaan berikutnya.
- `SESSION_SECRET` harus berupa secret acak minimal 32 karakter; tidak ada secret bawaan sebagai pengganti konfigurasi yang hilang.
- Seed lokal `bun run db:seed` membuat admin@gmail.com (ADMIN) dan dery@gmail.com, gading@gmail.com, rafli@gmail.com (USER), password `password`. Seed memperbarui hash/role yang diperlukan tanpa menghapus riwayat/EXP; sesi dicabut hanya saat password atau role berubah. Production ditolak. UI manajemen pengguna masih backlog.

Dashboard menampilkan hitungan pengguna, investigasi, sandbox aktif yang belum kedaluwarsa, antrean moderasi, dan data terbaru dari MySQL. Bedah APK statis dan sandbox web nyata sudah aktif; model AI serta Android dinamis belum tersedia. Login hanya memperbarui lastActiveAt, sedangkan streak mengikuti lastLearningAt dari aktivitas belajar.

## Pengujian

Jalankan `bun test` setelah dependensi dan `.env` siap serta MySQL aktif. [bunfig.toml](../bunfig.toml) memuat [tests/setup.ts](../tests/setup.ts) sebelum file test:

1. Buat database sementara dengan prefix `guardian_lab_test_` pada koneksi MySQL yang dikonfigurasi.
2. Terapkan migrasi dan buat akun fixture `USER` serta `ADMIN` khusus database tersebut.
3. Jalankan test dengan koneksi proses diarahkan ke database sementara.
4. Putuskan koneksi dan hapus database sementara setelah test.

Proses ini memerlukan izin MySQL untuk membuat dan menghapus database pengujian. File `.env` dan data aplikasi pada `guardian_lab` tidak diubah. Konfigurasi preload dan hooks mengikuti [Bun lifecycle hooks](https://bun.sh/docs/test/lifecycle).

`executeRoute()` pada harness hanya menjalankan handler yang tersedia. Handler hilang, method tidak tersedia, atau exception yang lolos dari handler menyebabkan test gagal; tidak ada pengganti respons oracle otomatis. Permintaan fitur memakai sesi fixture yang nyata. Untuk menguji tamu, berikan object cookie kosong secara eksplisit.

Test berbasis fungsi referensi tetap merupakan uji kontrak, bukan pengujian browser. Hasil browser dan batas verifikasi aktual dicatat di [TEST_READY.md](../TEST_READY.md). Artefak pemeriksaan lokal disimpan di `test-results/`, yang diabaikan Git dan terpisah dari cache build Next.js.

Validasi Origin memperhitungkan normalisasi loopback pada Next.js: saat URL internal menjadi `localhost`, Host asli loopback dengan port yang sama dipakai untuk menentukan origin yang diharapkan. Alamat `127.0.0.1` tetap dapat digunakan untuk unggahan yang sah. Perpindahan host, port berbeda, dan origin asing ditolak; header forwarded tidak menentukan pengecualian ini. Regresi diuji pada `tests/auth/origin.test.ts`.

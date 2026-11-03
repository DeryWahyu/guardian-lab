# Ekstraksi Statis APK — Tahap 7

## Perilaku aktif

Unggah satu `.apk` melalui landing. Server memeriksa arsip, membaca manifest biner/resource dan mendekompilasi DEX dengan JADX, lalu menyimpan fakta statis pada investigasi yang sama. Halaman hasil dan riwayat membaca `inputMetadata.apkStatic` dari ID tersebut. APK tidak dipasang, dieksekusi, atau dikirim ke model/layanan luar.

Model AI belum terhubung. Hasil ekstraksi menggunakan `EXTRACTED` atau `PARTIAL` di dalam laporan statis, sedangkan investigasi berakhir `UNAVAILABLE` dengan `MODEL_NOT_CONFIGURED` dan risiko/skor tetap `null`. Ekstraksi gagal menghasilkan `FAILED` beserta alasan yang tersimpan. Fakta statis tidak membuka Share Card atau kontribusi komunitas yang masih memerlukan hasil model lengkap.

## Setup

Gunakan runtime Node yang didukung Next.js atau Bun, MySQL, dan Java 11+ 64 bit. Implementasi lokal diverifikasi dengan Bun 1.3.4, Node 22, dan Java 25. Dockerfile memakai JRE 17 headless.

```bash
bun install --frozen-lockfile
bun run apk:setup
java -version
bun run dev
```

`apk:setup` mengunduh rilis resmi JADX **1.5.6**, memeriksa SHA-256 dari `lib/apk/toolchain.json`, dan memasang pustaka ke `.tools/jadx/` yang diabaikan Git. Bisa juga menggunakan arsip yang sudah diunduh: `bun run apk:setup path/to/jadx-1.5.6.zip`; checksum yang sama tetap wajib cocok. Pada mesin CI baru, jalankan setup ini sebelum `bun test`/build. Tidak ada variabel environment baru atau migrasi database pada tahap ini.

Runtime memverifikasi hash pustaka sebelum pemakaian pertama. Next.js menyalin JAR dan catatan verifikasi ke build standalone melalui file tracing. Docker builder menjalankan setup alat, generate Prisma, dan build; runner memiliki Java. Deployment memerlukan host dengan Java dan penyimpanan sementara yang dapat ditulis. Pengujian Docker belum dijalankan pada tahap ini karena daemon Docker lokal tidak aktif; pengujian CLI dan standalone dilakukan langsung.

Sumber alat: [JADX 1.5.6](https://github.com/skylot/jadx/releases/tag/v1.5.6), [dokumentasi JADX](https://github.com/skylot/jadx/tree/v1.5.6). ZIP ditangani `yauzl` dengan CRC `crc-32`, XML menggunakan `fast-xml-parser`. Versi dependensi dikunci di package manifest/lockfile.

## Batas proses dan pengamanan

- Unggahan maksimal 50 MiB, request multipart maksimal 50 MiB + 64 KiB. Nama/ekstensi/MIME tidak dianggap bukti bahwa isi valid atau berbahaya.
- Satu proses ekstraksi aktif per proses aplikasi. Permintaan lain mendapat 429 sebelum investigasi dibuat. Ini bukan antrean lintas instance; deployment beberapa instance perlu pengatur antrean bersama sebelum menambah kapasitas.
- Preflight membaca entry secara bertahap tanpa menulis jalur ZIP. Batas: 20.000 entri, total dekompresi 150 MiB, setiap entri 50 MiB, manifest 2 MiB, rasio kompresi maksimum 200 untuk entri di atas 1 MiB. CRC dan ukuran hasil dekompresi diperiksa.
- Jalur absolut/traversal/Windows, symlink, duplikasi nama ambigu, enkripsi, dan kompresi selain stored/deflate ditolak. `AndroidManifest.xml` harus ada. APKS/XAPK/ZIP biasa tidak menjadi pengganti APK tunggal.
- Input ditulis sebagai `input.apk` dalam direktori sementara acak. JADX dijalankan melalui argumen proses tanpa shell, konfigurasi/plugin skrip dinonaktifkan, dengan environment terbatas tanpa kredensial database/session/API.
- JVM memakai heap maksimal 384 MiB, metaspace 160 MiB, satu thread dekompilasi, dan batas waktu 45 detik. Hasil disk dibatasi 80 MiB dan pesan proses 1 MiB; proses dihentikan bila batas tercapai atau request dibatalkan.
- Pembacaan sumber maksimal 1.000 file/12 MiB, masing-masing file 1 MiB. Package aplikasi diprioritaskan. Cakupan yang dipersingkat dan exit code dekompiler tercatat; keterbatasan diberi status parsial.
- Input, hasil dekompilasi mentah, dan cache kerja dibersihkan sesudah proses selesai/gagal/dibatalkan. Jalur penghapusan diverifikasi sebagai direktori milik job di dalam direktori temp OS. Binary APK tidak disimpan secara permanen.

Proses Java terpisah adalah parser statis dan pembatas sumber daya, bukan emulator atau pengganti isolasi OS. Sandbox dinamis Chromium/Android mengikuti tahap berikutnya. Direktori temp aplikasi tidak perlu dipetakan menjadi volume APK persisten.

## Data yang disimpan

`lib/validations/apk-static.ts` menjadi kontrak laporan versi 1:

- Engine/versi, status ekstraksi, dan waktu ekstraksi UTC.
- Jumlah entri, ukuran total arsip, jumlah DEX, serta pustaka native.
- Package, label yang dapat diselesaikan dari resource, versi/kode versi, minimum/target SDK, flag manifest eksplisit, dan deklarasi `uses-permission`/`uses-permission-sdk-23`.
- Contoh origin HTTP/S dinonaktifkan beserta lokasi sumber. Path, query, fragment, dan kredensial dihapus/disamarkan; alamat ini tidak langsung dilabeli C2 berbahaya.
- Jumlah indikator token bot Telegram unik dan fingerprint SHA-256, tanpa token asli. Kontak/identitas yang dikenali hanya dihitung sebagai kemunculan yang disamarkan.
- Maksimal delapan potongan Java hasil JADX dengan sumber/baris. Konstanta string/karakter, komentar, angka sensitif, dan PII disamarkan. Jika tidak ada kecocokan indikator, potongan representatif pertama yang terbaca dapat ditampilkan sebagai contoh kode, tanpa menyatakan ancaman. Teks asset mentah tidak disalin ke potongan kode.
- Cakupan pembacaan, penanda pemotongan, exit code dekompiler, serta peringatan keterbatasan.

Mode manusia menjelaskan deklarasi izin sebagai kemampuan yang diminta, bukan izin yang sudah diberikan atau bukti pencurian. Mode teknis menampilkan metadata, hash, alamat nonaktif, dan potongan tersanitasi. Izin yang tidak tercantum/berkas yang tidak terbaca tidak diganti dengan bukti rekaan. Analisis tidak memverifikasi tanda tangan/installability dan tidak mendeteksi seluruh obfuscation, string terenkripsi, atau perilaku runtime.

## Alur dan API

`POST /api/analyze-apk` tetap multipart `file` dengan autentikasi serta pemeriksaan origin. Setelah validasi metadata dan SHA-256, rekaman bergerak `RECEIVED` → `PROCESSING`. Ekstraksi berhasil menyimpan laporan dan status `UNAVAILABLE` secara atomik; respons 201 berisi DTO kanonis. Kegagalan sesudah input diterima mengembalikan 422 berisi rekaman `FAILED` dengan ID nyata. Input/form tidak valid mengembalikan error 400/413 tanpa ID; mesin sibuk 429. Kegagalan database menghasilkan error, bukan ID atau hasil pengganti.

Kode error mencakup `APK_INVALID_ARCHIVE`, `APK_ARCHIVE_REJECTED`, `APK_MANIFEST_MISSING`, `APK_MANIFEST_INVALID`, `APK_MANIFEST_LIMIT`, `APK_DECOMPILE_FAILED`, `APK_OUTPUT_LIMIT`, `APK_TIMEOUT`, `APK_CANCELLED`, dan `APK_TOOLS_UNAVAILABLE`. Alasan ramah pengguna tersedia pada `errorMessage`; stdout/stderr, path mesin, dan sumber mentah tidak dikembalikan.

Input statis tersedia sebagai kontrak fitur bagi integrasi model berikutnya. Kontrak model terlatih masih perlu disepakati; tahap ini tidak menambahkan inferensi heuristik atau panggilan DeepSeek.

Permintaan unggah memakai status pending tersendiri agar proses jaringan yang lama tidak menahan navigasi halaman. Saat komponen/scope akun ditinggalkan, request dibatalkan dan callback hasil lama diabaikan. Navigasi hasil setelah respons tetap memakai transition. Pengguna dapat memeriksa riwayat untuk melihat status akhir request yang terputus.

## Verifikasi

Tes memeriksa manifest biner dan DEX dari APK fixture berlisensi Apache, resource-only APK, izin/flag XML, XXE/DTD, ZIP palsu/traversal/duplikasi/symlink/bomb/checksum rusak, masking token/kontak/konstanta, batas output, pembatalan Java dan pembersihan temp. API diuji terhadap persistensi, DTO riwayat identik, risiko tetap kosong, gagal tersimpan, dan respons sibuk. Fixtures beserta sumber/hash/lisensi ada di `tests/fixtures/apk/NOTICE.md` dan tidak tersedia sebagai preset website.

Hasil browser dan pemeriksaan akhir dicatat di [TEST_READY.md](../TEST_READY.md).

Audit manual microinteractions: **10/10** (8/8 diagnostik). Tidak ada diagnostik gagal pada alur akhir. Browser memeriksa pemilih berkas, status proses, klik ganda, perpindahan halaman, mode/reload, rincian bukti, retry baca, dan tampilan ponsel.

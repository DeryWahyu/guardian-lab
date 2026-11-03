# Tahap 3 — Alur Input Investigasi

Tahap ini menyelesaikan jalur input URL dan gambar QR sebelum model tersedia, serta menyelaraskan unggahan APK. Ekstraksi statis APK telah ditambahkan pada tahap 7; rujuk [apk-static.md](./apk-static.md). Model belum terhubung dan binary APK tidak disimpan permanen.

## Alur pengguna

1. Pilih tab URL, QR, atau APK. Tab mendukung keyboard, memiliki panel berlabel, dan tersinkron dengan `?tab=`. Native History API Next.js digunakan untuk perubahan tampilan lokal tanpa meminta ulang halaman server. Tombol Back/Forward mengembalikan tab.
2. Masukkan URL atau pilih/tarik satu berkas ke area unggah. Input file tetap dapat diakses dengan keyboard. Berkas terpilih menampilkan nama, ukuran, dan pratinjau QR; pengguna dapat mengganti atau menghapusnya.
3. Validasi lokal menampilkan pesan di dekat input. Berkas pengganti yang tidak valid menghapus pilihan lama agar berkas lama tidak terkirim tanpa sengaja. Perubahan input menghapus hasil lama dari tampilan, sementara rekamannya tetap tersimpan di database.
4. Tamu diarahkan melalui dialog autentikasi. Setelah USER masuk, aplikasi tetap menggunakan landing. File harus dipilih ulang setelah navigasi login; biner tidak disimpan di browser storage atau URL.
5. Saat dikirim, kontrol terkunci dan menampilkan status proses. Kunci pengiriman sinkron mencegah dua submit pada satu event loop. Tidak ada pengiriman ulang otomatis.
6. Server memverifikasi sesi, tipe konten, ukuran aktual, serta isi input. Input yang diterima terhubung dengan rekaman investigasi sebagaimana dijelaskan di [investigations.md](./investigations.md).

## URL dan QR memakai satu jalur

[Skema input](../lib/validations/analysis-input.ts) dipakai di client dan server. [receiveUrlInvestigation](../lib/investigations/receive-url.ts) menerima URL langsung maupun URL hasil QR; jenis asli `URL` atau `QR` tetap dipertahankan. QR tidak memicu permintaan kedua ke endpoint URL.

- Protokol yang didukung adalah HTTP dan HTTPS. Domain lengkap tanpa protokol, misalnya `example.com/halaman`, menggunakan HTTPS, termasuk bila berasal dari QR.
- URL dinormalisasi dengan Web URL API, termasuk huruf domain dan IDN. Batas 16.384 karakter diperiksa sebelum serta setelah normalisasi.
- Spasi internal, karakter kontrol, backslash, URL yang tidak valid, serta nama pengguna/kata sandi pada URL ditolak. Spasi di awal/akhir dibersihkan.
- Tidak ada kunjungan ke alamat target atau permintaan ke model selama penerimaan input. PII serta nilai query/fragment disamarkan sebelum persistensi sesuai kebijakan tahap 2.

Decoder QR menggunakan Sharp dan jsQR dengan piksel nyata. Input dibatasi ke PNG, JPG, atau WebP statis, maksimal 5 MB dan 16 juta piksel. Orientasi dibaca, ruang warna diubah ke sRGB/RGBA, dan transparansi diratakan di atas putih. Gambar grayscale, grayscale-alpha, transparan, JPG, dan WebP memiliki uji regresi.

Kegagalan membaca QR, isi non-URL, URL berkredensial/tidak valid, atau gambar yang tidak didukung menghasilkan rekaman `FAILED` dan respons `422` dengan ID. Isi non-URL tidak disimpan. Upload kosong, ganda, atau metadata yang tidak valid ditolak sebelum rekaman dibuat.

## Batas permintaan dan respons

[Pembaca request](../lib/investigations/request-input.ts) memakai parser JSON/multipart Web API. Batas diterapkan pada `Content-Length` serta byte stream aktual, termasuk bila header tidak ada atau mengaku lebih kecil.

| Input          | Batas berkas                        | Batas badan permintaan   |
| -------------- | ----------------------------------- | ------------------------ |
| URL JSON       | 16.384 karakter setelah normalisasi | 128 KiB                  |
| QR multipart   | 5 MiB                               | 5 MiB + 64 KiB overhead  |
| QR JSON base64 | Hasil decode maksimal 5 MiB         | 7 MiB + 64 KiB overhead  |
| APK multipart  | 50 MiB                              | 50 MiB + 64 KiB overhead |

- `201`: rekaman tersimpan, status saat ini `UNAVAILABLE` tanpa skor risiko karena model belum terhubung.
- `400`: input atau badan request tidak valid.
- `401`/`403`: sesi/akses tidak memenuhi syarat.
- `413`: batas byte request terlampaui.
- `415`: tipe konten request tidak didukung.
- `422`: pemeriksaan QR gagal dengan rekaman tersimpan.
- `500`: persistensi gagal; respons tidak memberikan ID sukses.

APK menerima unggahan satu berkas `.apk` yang tidak kosong dan maksimal 50 MB, termasuk ekstensi huruf besar. Setelah validasi awal, tahap 7 memeriksa arsip/checksum dan mengekstrak manifest/resource serta kode melalui JADX. Batas unggahan dan hasil statis tidak membuktikan APK aman; skor model tetap kosong. Detail status parsial, error 422 tersimpan, dan respons sibuk 429 ada di [apk-static.md](./apk-static.md).

## Kegagalan dan pemulihan

Kegagalan server mempertahankan isian dan menyediakan aksi kirim ulang. Jika jaringan terputus atau respons sukses tidak dapat dikonfirmasi, aplikasi menyatakan hasil penyimpanan belum diketahui dan memberikan tautan riwayat. Pengguna dapat memeriksa apakah rekaman sudah tersimpan sebelum mengirim kembali. Tidak ada klaim bahwa data pasti gagal disimpan pada kondisi tersebut.

Pratinjau memakai object URL yang dicabut ketika berkas berganti atau komponen dilepas. Animasi indikator dan scroll hasil mengikuti preferensi reduced motion.

## Validasi

- `tests/investigations/input.test.ts`: normalisasi, input tidak valid, batas ukuran, metadata file, jalur URL/QR, serta pembacaan body yang dibatasi.
- `lib/analysis/qr.test.ts`: gambar QR nyata dalam beragam format/ruang warna, konten SVG yang menyamar, dan batas piksel.
- Laporan otomatis dan browser produksi terdapat di [TEST_READY.md](../TEST_READY.md).

Audit manual microinteractions: **10/10**, delapan diagnostik terpenuhi. Kontrol terlihat dan memiliki status; aturan validasi konsisten; umpan balik langsung; pesan sesuai dampak; area unggah berubah menjadi ringkasan setelah dipilih; mode tab terlihat; serta input dapat digunakan melalui keyboard. Tidak ada baris diagnostik yang gagal.

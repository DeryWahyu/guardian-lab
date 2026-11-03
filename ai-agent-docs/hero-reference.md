# Hero sederhana dengan maskot asli

Pembaruan 3 November 2026. Pengguna meminta redesign menyeluruh yang sederhana, elegan, tanpa elemen berulang, menggunakan maskot asli `design/guardian-lab-fox-mascot.png`. Batas kiri dan kanan disamakan dengan header dan bagian landing lainnya. Desain ini menggantikan komposisi referensi `1.png` sebelumnya.

## Komposisi

- Judul **Sebelum klik, / cek dulu.**, pengantar singkat, form putih, dan maskot asli berlogo Koneksi. Tidak ada badge tambahan, balon percakapan, halo, atau tombol contoh.
- Container maksimal 1280 px, padding horizontal 16 px di ponsel, 24 px mulai 640 px, dan 32 px mulai 1024 px, sama dengan `max-w-7xl px-4 sm:px-6 lg:px-8` pada bagian lain.
- Pada desktop, kolom kiri memuat pengantar dan form maksimal 600 px; maskot maksimal 280 px berada di kolom kanan. Pada ponsel, maskot 88/120 px mendampingi pengantar dan form memakai lebar penuh tanpa tumpang tindih.
- Judul desktop 44 px, deskripsi 16 px, dan teks kontrol 14 px. Ukuran mengikuti bagian bawah halaman; tombol utama minimal 44 px.
- Warna mengikuti palet global navy/teal, latar `#f8fafc`, dan kartu putih. CSS Modules menjaga gaya lokal; loader Tailwind tetap dibatasi ke `globals.css`.
- Placeholder loading memakai `GatewaySkeleton` dengan susunan yang sama dengan kartu form. Tidak ada animasi dekoratif pada ilustrasi.

## Perilaku form

Tab **Tautan**, **Kode QR**, dan **File APK** tetap memakai hook serta endpoint investigasi yang sama. Label **Alamat tautan**, placeholder URL, dan petunjuk terlihat menjelaskan input. Label wajib tersedia untuk pembaca layar dan input tetap `required`. Tombol utama menyesuaikan jenis input: **Periksa tautan**, **Baca kode QR**, atau **Periksa APK**. QR/APK mempertahankan format, batas berkas, pratinjau, dan validasinya.

Tombol **Tempel** meminta clipboard hanya setelah diklik. Clipboard kosong, akses ditolak, tidak didukung, atau timeout lima detik menampilkan pesan di dekat input dan mengembalikan kontrol ke kondisi yang dapat digunakan. Tempel manual tetap tersedia.

Input selalu dimasukkan pengguna sendiri. Tombol contoh dari desain terdahulu telah dihapus untuk menyederhanakan alur.

Validasi URL dilakukan saat pengiriman. Validasi pada blur sebelumnya dapat menggeser tombol saat pointer sedang diklik, sehingga pengiriman tidak terpanggil. Pengiriman invalid kini menampilkan pesan dan memfokuskan kolom pada klik pertama.

Status **AI sedang disiapkan. Skor risiko belum tersedia.** selalu terlihat pada kartu. Catatan privasi dapat dibuka untuk membaca penjelasan sanitasi dan penyimpanan akun. AI tetap belum terhubung; input baru menghasilkan status serta metadata nyata dari backend, tanpa skor pengganti. URL/QR/APK, autentikasi, dan ID riwayat tetap mengikuti kontrak sebelumnya.

## Berkas utama dan bukti

- `components/landing/hero.tsx`, `hero-mascot.tsx`, dan `hero.module.css`.
- `components/landing/analysis-gateway.tsx`, `gateway-url-field.tsx`, `gateway-upload-field.tsx`, `gateway-privacy-control.tsx`, `gateway-skeleton.tsx`, dan `gateway.module.css`.
- `components/landing/use-gateway-clipboard.ts` untuk pembacaan clipboard.
- Aset aktif: `public/brand/guardian-lab-fox.webp`. Master asli: `design/guardian-lab-fox-mascot.png`.
- Screenshot dan hasil browser terbaru: `test-results/hero-minimal/` (diabaikan Git). Bukti desain sebelumnya berada di `test-results/hero-compact/` serta `test-results/hero-reference/`.

Pengujian browser memakai database MySQL audit terpisah dan berkas QR/APK fixture jinak. Server audit serta database sementara dibersihkan sesudah pemeriksaan; server pengembangan pengguna dipertahankan.

## Verifikasi desain terbaru

- **22 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error. Tampilan 320/390/640/768/837/1024/1440 px tidak meluber; batas container terhadap header juga diperiksa pada 1920 px.
- Maskot asli beserta logo Koneksi tampil dan byte aset publik cocok dengan berkas lokal. Ilustrasi tidak menghalangi kontrol.
- Clipboard nyata dan keadaan gagal, tab/back/forward, keyboard/fokus, validasi URL, login, unggahan/pratinjau QR, serta validasi APK lulus.
- Pengiriman URL/QR/APK memakai API nyata dengan database audit terpisah. QR benar-benar didekode dan APK diekstraksi statis; hasil tersimpan, reload, serta sesi kedaluwarsa mempertahankan kontrak sebelumnya.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.
- Screenshot desktop: `test-results/hero-minimal/production-page-1440.png`. Screenshot responsif dan hasil terstruktur berada di folder yang sama.

## Arsip verifikasi skala ringkas dan logo Koneksi

- **22 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error. Lebar 320/390/640/768/837/1024/1440 px tidak memiliki overflow horizontal; teks balon tetap dua baris.
- Pada desktop 1440 px, tinggi hero turun dari 870 menjadi 600 px, maskot dari sekitar 500 menjadi 340 px, lebar kartu dari 804 menjadi 600 px, serta judul dari 63,6 menjadi 43,68 px. Teks deskripsi 16 px selaras dengan bagian di bawahnya.
- Patch jaket diperiksa secara visual memakai logo resmi Koneksi sebagai referensi. Browser juga memverifikasi aset baru yang tampil dan byte file publik sesuai hasil tersimpan, sehingga tidak memuat maskot v2 dari cache lama.
- Uji clipboard, tab, keyboard, validasi, login, contoh tanpa auto-submit, unggahan QR/APK, serta hasil tersimpan tetap lulus.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.
- Aset aktif transparan berukuran 1000 × 1143 px dan 142.258 byte. Screenshot produksi dan log terbaru berada di `test-results/hero-compact/`.

## Arsip verifikasi desain referensi awal

- **21 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error, pada lebar 320/390/640/768/837/1024/1440 px.
- Posisi kartu pada lebar 837 px diperiksa terhadap referensi, tanpa overflow horizontal atau kontrol yang terhalang ilustrasi.
- Clipboard nyata, clipboard kosong/ditolak/timeout, contoh tanpa auto-submit, tab dan back/forward, keyboard/fokus, validasi pada klik pertama, dialog autentikasi dan sanitasi target, drag-and-drop QR, serta validasi APK lulus.
- Pengiriman URL/QR/APK memakai API nyata dan database terpisah. QR didekode dari gambar; APK melewati ekstraksi statis nyata. ID hasil tersimpan dan status AI belum tersedia tetap konsisten setelah reload atau kedaluwarsa sesi.
- **459 tes Bun lulus**, 0 gagal, 34 file, 2586 assertion. TypeScript, Biome, formatter file tugas, dan build produksi lulus.
- Aset web terpilih memiliki alpha transparan, ukuran 1000 × 1142 px dan 146.222 byte; pemuatan gambar nyata diperiksa pada screenshot produksi.

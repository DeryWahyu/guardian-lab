# Guardian Share Card — Tahap 5

## Alur dan sumber data

Di hasil landing atau detail riwayat, pilih **Buat Guardian Share Card**. Builder rute `PUBLIC_ROUTES.actWithInvestigation(id)` membuka `/act?id=...`. Halaman memerlukan sesi USER/ADMIN; API detail tetap memeriksa pemilik atau hak admin. Query seperti `target`, skor, kategori, dan temuan tidak menjadi sumber data kartu.

`ActContent` meneruskan scope akun/peran ke pembacaan investigasi. Pergantian sesi atau ID membersihkan data lama. Rekaman `COMPLETED` dengan hasil valid, sumber, dan versi model dapat menghasilkan kartu. `RECEIVED`, `PROCESSING`, `FAILED`, `UNAVAILABLE`, legacy, serta hasil tidak lengkap tidak dapat diekspor. Status yang masih berjalan mengikuti polling yang sama dengan laporan. Gangguan baca menyediakan retry GET; snapshot yang gagal diperbarui tidak diekspor.

`lib/share-card/content.ts` membentuk satu representasi untuk pratinjau, PNG, dan pesan teks. Skor nol tetap valid. SAFE/LOW memakai judul netral, sedangkan tingkat risiko lain memakai peringatan sesuai verdict tersimpan. Ringkasan tidak memerlukan tiga temuan: tampilkan paling banyak tiga temuan unik yang benar-benar tersedia, tanpa mengisi kekurangan dengan teks rekaan.

Kartu memuat jenis input, target, tingkat/skor risiko, kategori, ringkasan, temuan, sumber, versi model, waktu hasil dalam UTC, dan ID. Waktu pembaruan digunakan dengan label berbeda jika waktu selesai belum tercatat. Tidak ada klaim resmi, sertifikasi, atau jaminan keamanan. APK dilabeli sebagai nama berkas.

## Privasi dan panjang konten

Target dihitung ulang dari data tersimpan, bukan mempercayai `defangedTarget` kiriman. Teks dan indikator kembali melewati penyamaran PII, penghapusan kredensial/nilai query URL, penonaktifan protokol/domain, serta pembersihan karakter kontrol/arah tulisan. Bukti teknis mentah, token, identitas pemilik, dan tautan riwayat privat tidak dimasukkan ke pesan.

Ringkasan, temuan, dan metadata panjang dipersingkat dengan tanda yang terlihat. Hostname target dipertahankan lengkap agar akhiran domain tidak tersembunyi. Laporan lengkap tetap tersedia melalui tombol kembali ke hasil. Isi investigasi asli tidak diubah oleh generator.

## Ekspor dan berbagi

- `html-to-image` merender kanvas 600 px dengan pixel ratio 2 menjadi PNG selebar 1200 px. Kanvas ekspor memakai komponen yang sama dengan pratinjau, font sistem, dan ukuran tetap agar hasil konsisten di ponsel/desktop.
- PNG disiapkan setelah kanvas tersedia. Tombol menampilkan status persiapan; kegagalan menyediakan retry. Pesan teks tetap dapat disalin ketika ekspor gagal.
- File disimpan hanya di memori halaman dan digunakan ulang selama hasil tetap sama. Perubahan rekaman/scope membuang file sebelumnya. URL unduhan sementara dicabut setelah digunakan atau ketika halaman dilepas.
- **Unduh PNG** memulai unduhan, tanpa mengklaim file telah tersimpan di perangkat. Nama file memuat jenis input dan ID investigasi.
- **Salin pesan WhatsApp** menyalin teks. Ketika clipboard tidak tersedia/ditolak, tampilkan textarea read-only yang bisa dipilih untuk disalin manual.
- **Bagikan gambar** hanya muncul ketika browser mendukung berbagi file PNG. File sudah disiapkan sebelum klik agar aktivasi pengguna tetap berlaku. Browser membuka pemilih aplikasi; pengguna memilih tujuan sendiri. Pembatalan dan kegagalan memiliki pesan tersendiri.
- Browser tanpa dukungan berbagi file menggunakan unduh PNG dan salin pesan. Aplikasi tidak otomatis mengirim pesan, membuka URL berbahaya, memublikasikan kartu, atau mengunggah gambar ke layanan lain.

Tombol **Ajukan ke komunitas** membuka preview snapshot dari ID investigasi yang sama. Pengguna memberi persetujuan sebelum pengajuan masuk moderasi. Kontrak tahap 6 tersedia di [community.md](./community.md).

## Verifikasi

Unit test menguji gating status/sumber, skor nol/verdict, temuan kurang dari tiga, pemendekan, hostname lengkap, PII/indikator dalam prosa, markup aman, dan rute berbasis ID. Browser memeriksa unduhan PNG nyata, kesamaan piksel desktop/mobile, fallback clipboard, retry ekspor, kemampuan berbagi file, pembatalan, serta pembatasan owner/admin. API berbagi dan clipboard dimock saat pengujian, sehingga tidak ada pesan yang dikirim ke orang lain.

Model URL/QR/APK belum terhubung: input baru tetap `UNAVAILABLE`. Fixture hasil lengkap hanya dipakai dalam pengujian dan dibersihkan setelahnya; tidak disediakan sebagai preset website. Rincian hasil pemeriksaan ada di [TEST_READY.md](../TEST_READY.md).

Audit manual microinteractions: **10/10** (8/8 diagnostik). Tombol jelas dan menampilkan status, proses mengikuti kemampuan browser, feedback langsung dan sesuai aksi, PNG siap digunakan ulang, serta cara berbagi/fallback terlihat. Tidak ada diagnostik yang gagal pada alur akhir.

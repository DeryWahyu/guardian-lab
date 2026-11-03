# Audit alur sistem — 3 November 2026

Audit ini memeriksa aplikasi web saat model AI masih dilatih oleh tim. Integrasi V6 yang sempat dimulai telah dibatalkan; aplikasi tidak menghubungi model atau membuat skor pengganti. Repository penelitian AI tidak diubah.

## Penilaian alur

Alur aplikasi konsisten dengan kemampuan yang tersedia. `ForensicRecord` menjadi sumber ID/status yang sama untuk landing, riwayat, sandbox sumber, Share Card, dan pengajuan komunitas. Fitur yang memerlukan kesimpulan model tetap menunggu hasil lengkap.

| Alur                | Perilaku yang diperiksa                                                                                                                                                                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tamu → fitur        | Halaman fitur meminta login; API memeriksa sesi sendiri. Landing dan peringkat contoh berlabel tetap terbuka.                                                                                   |
| Login USER / ADMIN  | USER kembali ke landing, ADMIN ke dashboard. Pengguna biasa tidak memperoleh akses admin. Logout mencabut sesi server.                                                                          |
| URL / gambar QR     | Validasi URL bersama, provenance URL/QR terpisah, nilai sensitif disamarkan, rekaman tersimpan dengan `UNAVAILABLE` dan risiko `null`. QR didekode dari gambar nyata.                           |
| Unggahan APK        | Ekstraksi manifest/resource/izin melalui pipeline statis nyata; binary sementara dibersihkan. Fakta statis tersedia, kesimpulan AI tetap belum tersedia.                                        |
| Hasil / riwayat     | ID kanonis dapat dimuat ulang; filter dan akses owner/admin diperiksa. Rekaman pengguna lain tidak terbuka untuk USER. Mode Manusia/Geek mengikuti hasil tersimpan.                             |
| Sandbox web         | Tidak membuat container saat halaman dibuka. Target berparameter memerlukan persetujuan versi bersih. Sesi bersumber dari investigasi tersimpan dan berakhir setelah penghentian terkonfirmasi. |
| Unduhan sandbox     | Karantina APK pada server, verifikasi hash/ukuran, transfer privat, blokir unduhan lokal, dan cleanup diuji dengan container nyata.                                                             |
| Academy             | Kunci tidak dikirim sebelum penilaian. Hasil disimpan; kelulusan pertama memperoleh EXP, latihan ulang tidak menggandakan EXP, retry UUID mengembalikan hasil yang sama.                        |
| Komunitas           | Memerlukan hasil lengkap dan persetujuan pemilik. Pengajuan menunggu moderasi dan bersifat privat; persetujuan admin menerbitkan snapshot serta latihan kasus.                                  |
| Guardian Share Card | Hanya tersedia dari hasil lengkap yang tersimpan. Ekspor menghasilkan PNG nyata; status `UNAVAILABLE` tidak menghasilkan kartu risiko buatan.                                                   |
| Android dinamis     | Tetap jelas belum tersedia; endpoint mengembalikan 503. Jalur APK statis tetap dapat digunakan.                                                                                                 |

Tanpa model aktif, hasil lengkap baru, Share Card baru, dan pengajuan kasus baru memang belum dapat dihasilkan dari input pengguna. Hal tersebut adalah batas kemampuan yang disengaja. Pengujian fitur hilir menggunakan fixture hasil terkontrol pada database audit terpisah, bukan hasil AI sebenarnya.

## Bug yang diperbaiki

1. **Pemuatan data berhenti setelah timeout.** `useApiResource` sebelumnya menggunakan satu AbortController sepanjang umur effect. Timeout membuat refresh saat fokus kembali langsung terhenti. Setiap request kini memiliki controller baru; unmount tetap membatalkan request yang aktif.
2. **Target sandbox tertinggal setelah navigasi query.** State awal URL dan sumber hanya dibaca sekali. Form kini memiliki scope berdasarkan akun, target, dan investigasi sumber. Navigasi memperbarui target/sumber sekaligus mereset persetujuan penghapusan parameter.
3. **Polling terlambat menampilkan sesi yang sudah dihentikan sebagai aktif.** Status database kini dibaca kembali setelah respons provider. Pembaruan terminal bersyarat menjaga status penghentian dan respons tidak lagi membuka stream dari snapshot lama.
4. **Password panjang terpotong diam-diam oleh bcrypt.** Validasi dan fungsi hash/verifikasi membatasi 72 byte UTF-8. Suffix password yang sebelumnya dapat diabaikan tidak lagi diterima. Password tepat 72 byte, termasuk multibyte, tetap terverifikasi. Email dibatasi sesuai kolom database, 191 karakter.
5. **Body autentikasi tidak berbatas.** Login/registrasi kini memakai pembaca stream berbatas 16 KiB, termasuk tanpa Content-Length. Body berlebih menghasilkan 413, format salah 415, dan JSON rusak 400.
6. **Opsi kuis dapat kosong setelah sanitasi.** Konten CMS yang telah disanitasi divalidasi kembali sebelum transaksi. Teks yang hanya terdiri dari karakter kontrol tidak dapat diterbitkan sebagai jawaban tak terlihat. Urutan pertanyaan tetap dipertahankan dan diperiksa melalui tes penyimpanan tiga soal.

Regresi server: `tests/flow/system-audit.test.ts` dan `tests/sandbox/sessions.test.ts`. Kedua masalah browser direproduksi sebelum perbaikan dan diperiksa lagi setelah build.

## Verifikasi

- Suite Bun pada MySQL sementara: **459 lulus**, 0 gagal, 34 file, 2586 assertion.
- TypeScript `bunx tsc --noEmit`, Biome `bun run lint`, serta build produksi: lulus.
- Formatter diperiksa pada file audit yang berubah.
- **24 skenario browser produksi Chrome lulus**, 0 gagal dan 0 unhandled page error; termasuk layout 320/390/768/1440 px. Dua pemeriksaan regresi browser tambahan juga lulus. Browser menggunakan database `guardian_lab_audit_*` tersendiri. Hasil rinci dan skenario pemulihan timeout ada pada `test-results/system-audit/browser-results.json` dan `browser-reproductions.json`.
- `scripts/verify-sandbox.mjs`: autentikasi stream, WebSocket VNC, internet publik, blokir jaringan lokal/metadata/DNS lokal, dan penghentian manual lulus.
- `scripts/verify-quarantine.mjs`: watcher karantina, SHA-256/ukuran, transfer privat byte-identik, blokir pengunduhan lokal, dan teardown lulus.

Log dan artefak browser berada pada `test-results/system-audit/` yang diabaikan Git. Akun, hasil fixture, progres, dan kasus untuk browser hanya dibuat pada database audit. Server produksi sementara serta database audit dibersihkan setelah verifikasi; layanan pengembangan pengguna dan broker yang sudah ada dipertahankan.

Hasil audit berarti skenario tersebut telah diperiksa pada lingkungan lokal ini. Ia tidak menggantikan pengujian integrasi model setelah artifact/API tersedia, uji browser/perangkat lain, atau pengujian deployment publik.

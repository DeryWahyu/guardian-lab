# Penyelesaian audit alur lokal

Audit lanjutan 3 November 2026, perbaikan bug, serta batas kemampuan aktif: [audit keseluruhan sistem](./system-flow-audit.md).

Pembaruan 2 November 2026, setelah tahap 8. Model URL/QR/APK masih dilatih. Pengguna menyetujui penundaan Android dinamis sampai server Linux dengan binder/Redroid tersedia.

## Perubahan terhubung

- Landing membaca jumlah URL/QR, APK, dan kasus disetujui dari database. Atas permintaan pengguna, peringkat landing sementara menampilkan Dery Wahyu Perdana, Alfian Gading Saputra, dan Rafli Maulana beserta EXP contoh, dengan label Data contoh. Daftar tetap terlihat sebelum login dan ketika statistik memuat/gagal; CTA Mulai belajar menuju Academy melalui autentikasi. Peringkat komunitas tetap memakai EXP akun USER aktual dan alias anonim dengan pagination; data contoh landing tidak mengubah database. Kontrak: [community.md](./community.md).
- Gateway aktif pada tab URL/QR; APK X-Ray hanya pada tab APK. Aturan sama untuk desktop dan menu mobile.
- Kolom URL tetap lebar pada ponsel. Header memakai menu pada tablet agar seluruh navigasi dan akun tidak meluber.
- Target dan sumber sesi sandbox berasal dari database. Permintaan tautan baru tidak mengganti tampilan target sesi yang sedang berjalan. URL dengan parameter/fragmen memerlukan persetujuan membuka versi bersih sebelum container dialokasikan.
- Unduhan APK di browser server masuk karantina sementara. Pengguna memilih bedah statis, lalu hasil tersimpan pada riwayat dengan sumber sesi dan investigasi URL/QR. Retry tidak membuat investigasi ganda. Link hasil tetap tersedia setelah container dihapus.
- Kasus komunitas yang disetujui menyediakan tiga pertanyaan dari snapshot nyata. Kelulusan pertama memberi 30 EXP, lencana, dan progres Academy; pengulangan memberi nol EXP. Pembacaan kasus saja tidak memberi EXP.
- Login memperbarui aktivitas masuk saja. Streak menggunakan aktivitas belajar dalam kalender WIB.
- Salinan landing mengikuti kemampuan fitur saat ini; tidak ada angka, testimoni, artikel, atau hasil model contoh yang dijanjikan sebagai data nyata.

## Akun lokal

`bun run db:seed` membuat atau menyesuaikan akun berikut. Password seluruh akun: `password`.

| Email            | Role  | Setelah login |
| ---------------- | ----- | ------------- |
| admin@gmail.com  | ADMIN | /admin        |
| dery@gmail.com   | USER  | /             |
| gading@gmail.com | USER  | /             |
| rafli@gmail.com  | USER  | /             |

Seed tidak menghapus riwayat, EXP, atau nama akun yang sudah ada, dan tidak membuat investigasi/progres palsu. Materi awal ditambahkan tanpa menimpa edit admin. Password tetap disimpan sebagai hash bcrypt. Sesi dicabut ketika hash/password atau role perlu diubah. CLI menolak production.

## Migrasi dan pemeriksaan

Migrasi `20261102030000_flow_consistency` menambah sumber investigasi pada sesi, mapping hasil unduhan, serta UUID/hasil pengiriman latihan komunitas. Terapkan migrasi dan generate Prisma sebelum menjalankan kode baru.

```powershell
bunx prisma migrate deploy
bunx prisma generate
bun run db:seed
bun run sandbox:build
bun run sandbox:up
bun test
bunx tsc --noEmit
bun run lint
bun run build
node --env-file=.env scripts/verify-quarantine.mjs
```

Script karantina menggunakan APK fixture jinak dan container nyata; tidak menambahkan preset pada website. Pengujian browser menggunakan akun/kasus sementara yang dibersihkan sesudahnya. Akun demo yang diminta tetap tersedia. Hasil pemeriksaan aktual tercatat di [TEST_READY.md](../TEST_READY.md).

Model AI tetap tidak dipanggil; APK statis berakhir `UNAVAILABLE` dengan skor/verdict null. Share Card dan pengajuan komunitas tetap memerlukan hasil model lengkap. Tanpa kasus valid, komunitas menampilkan keadaan kosong. Android dinamis, viewport ponsel remote, dan thumbnail sesi belum tersedia.

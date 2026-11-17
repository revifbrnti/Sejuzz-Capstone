# Laporan Pengujian Backend Sejuzz (A26-CS002)

Dokumen ini mencatat hasil pengujian API Backend untuk memastikan seluruh fitur berjalan sesuai dengan _Use Case_ dan _Project Plan_.

## Lingkungan Pengujian

- **URL Produksi:** `https://sejuzz-capstone-production.up.railway.app/api/v1`
- **Database:** PostgreSQL (Neon.tech)
- **Layanan AI:** FastAPI (Tim AI)

## Tabel Pengujian

| No  | Fitur yang Diuji         | Skenario Pengujian                                          | Hasil yang Diharapkan                                            | Status   |
| :-- | :----------------------- | :---------------------------------------------------------- | :--------------------------------------------------------------- | :------- |
| 1   | Kalkulator Normal        | `POST /calculate` input 5 kg Semangka (Large)               | Status 200, `estimatedCups` muncul, `aiInsight` terisi.          | ✅ Lulus |
| 2   | Kalkulator Normal (Buah) | `POST /calculate` input 2 buah Alpukat                      | Berat dikonversi otomatis ke kg, status 200.                     | ✅ Lulus |
| 3   | Kalkulator Target        | `POST /calculate-target` input 50 cup (Small)               | Status 200, `beratKgDibutuhkan` dan `estimasiJumlahBuah` muncul. | ✅ Lulus |
| 4   | Kalkulator Kombinasi     | `POST /calculate-combination` input 2 kg Pisang + 1 kg Naga | Status 200, `totalCups` gabungan dan detail per buah muncul.     | ✅ Lulus |
| 5   | Kehilangan Produksi      | `POST /calculate` dengan `kehilangan_produksi_persen: 5`    | Jumlah cup lebih sedikit dibanding tanpa kehilangan produksi.    | ✅ Lulus |
| 6   | Validasi Joi (Error)     | `POST /calculate` input berat negatif (-5 kg)               | Ditolak (400 Bad Request) dengan pesan error yang jelas.         | ✅ Lulus |
| 7   | Validasi Joi (Error)     | `POST /calculate` tanpa mengisi field `amount`              | Ditolak (400 Bad Request) dengan pesan field wajib.              | ✅ Lulus |
| 8   | Login Owner (Auth)       | `POST /login` dengan email dan password yang benar          | Status 200, mendapatkan Token JWT.                               | ✅ Lulus |
| 9   | Proteksi Endpoint        | `PUT /fruits/:id` tanpa menyertakan Token                   | Ditolak (401 Unauthorized).                                      | ✅ Lulus |
| 10  | Proteksi Endpoint        | `PUT /fruits/:id` dengan menyertakan Token yang valid       | Status 200, takaran berhasil diubah di database.                 | ✅ Lulus |
| 11  | Chatbot AI (Gen AI)      | `POST /chat` dengan pesan "5 kg semangka berapa cup?"       | Status 200, `reply` dari AI muncul.                              | ✅ Lulus |
| 12  | Chatbot History          | `GET /chat/history`                                         | Menampilkan riwayat percakapan user dengan AI.                   | ✅ Lulus |
| 13  | Analisis Sentimen        | `POST /sentimen` dengan teks "Jusnya segar banget"          | Status 200, `sentimen: positif`, `skor` muncul.                  | ✅ Lulus |
| 14  | Analisis Sentimen Batch  | `POST /sentimen/batch` dengan array teks                    | Status 200, ringkasan sentimen (positif/negatif) muncul.         | ✅ Lulus |
| 15  | FAQ AI                   | `POST /ai/faq` dengan pertanyaan panduan                    | Status 200, `answer` dari AI (RAG) muncul.                       | ✅ Lulus |
| 16  | Riwayat Perhitungan      | `GET /history`                                              | Menampilkan log perhitungan dengan detail buah (relasi).         | ✅ Lulus |
| 17  | Akurasi (DS)             | `GET /accuracy`                                             | Menampilkan ringkasan total uji dan rata-rata selisih.           | ✅ Lulus |
| 18  | CORS (Frontend)          | Mengakses API dari domain Vercel Frontend                   | Berhasil mengambil data tanpa error CORS di _browser console_.   | ✅ Lulus |

## Catatan Tambahan

- Pengujian fungsional (API) dilakukan menggunakan **PowerShell (Command Line)** di terminal, baik saat server berjalan di lokal (localhost) maupun setelah di-deploy ke Railway (production).
- Jika layanan AI eksternal _timeout_ atau gagal merespons, sistem backend akan otomatis beralih ke `Local_Fallback` menggunakan rumus standar (terbukti pada pengujian No. 1).
- Seluruh _endpoint_ yang membutuhkan autentikasi sudah diuji menggunakan Token JWT yang didapat dari hasil Login (Pengujian No. 8).
- Pengujian manual di browser juga dilakukan untuk memastikan integrasi CORS dengan Frontend Vercel berjalan lancar (Pengujian No. 18).

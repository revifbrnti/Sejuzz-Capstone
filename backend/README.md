# Sejuzz Backend API (A26-CS002)

Backend API untuk aplikasi **Sejuzz** (Sistem Estimasi Hasil Produksi Jus Berdasarkan Berat Buah). Proyek ini dikembangkan untuk membantu pelaku UMKM (Sejuzz) dalam mengestimasi jumlah cup jus yang dapat dihasilkan dari berat buah tertentu, menggunakan integrasi kecerdasan buatan (Gen AI) dan analisis data.

## 🚀 Tech Stack

- **Runtime:** Node.js (v22)
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon.tech - Cloud)
- **ORM:** Prisma 7
- **Authentication:** JWT (JSON Web Token) & Bcrypt
- **Validation:** Joi
- **HTTP Client:** Axios (untuk komunikasi ke layanan AI)
- **Deployment:** Railway

## 🌐 Link Aplikasi (Production)

- **Base URL API:** `https://sejuzz-capstone-production.up.railway.app/api/v1`
- **Frontend (Aplikasi Web):** [https://sejuzz-frontend.vercel.app](https://sejuzz-frontend.vercel.app)

## 🛠️ Cara Menjalankan di Lokal

Ikuti langkah ini untuk menjalankan server di komputer Anda:

1. **Clone repository ini:**

   ```bash
   git clone https://github.com/revifbrnti/Sejuzz-Capstone.git
   cd Sejuzz-Capstone/backend
   ```

2. **Install dependensi:**

   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables:**
   Salin file `.env.example` menjadi `.env`, lalu isi nilainya:

   ```bash
   cp .env.example .env
   ```

   Buka file `.env` dan sesuaikan `DATABASE_URL` dengan database PostgreSQL lokal/Neon Anda, serta isi `JWT_SECRET`, `AI_SERVICE_URL`, dan `AI_API_KEY`.

4. **Sinkronisasi Database & Seeder:**

   ```bash
   npx prisma db push
   npm run seed
   ```

5. **Jalankan Server:**

   ```bash
   npm run dev
   ```

   Server akan berjalan di `http://localhost:5000`.

## 📚 Daftar Endpoint API

Semua endpoint diawali dengan `/api/v1`. Beberapa endpoint membutuhkan header `Authorization: Bearer <token>`.

| Kategori  | Method | Endpoint                 | Deskripsi                                    |
| --------- | ------ | ------------------------ | -------------------------------------------- |
| Auth      | POST   | `/login`                 | Login Owner (mendapatkan Token JWT)          |
| Fruits    | GET    | `/fruits`                | Mengambil semua data buah & takaran          |
| Fruits    | PUT    | `/fruits/:id`            | Mengubah takaran (khusus Owner, butuh Token) |
| Kalkulasi | POST   | `/calculate`             | Hitung estimasi cup (normal)                 |
| Kalkulasi | POST   | `/calculate-target`      | Hitung berat buah dari target cup            |
| Kalkulasi | POST   | `/calculate-combination` | Hitung kombinasi 2 jenis buah                |
| Gen AI    | POST   | `/chat`                  | Chatbot AI Sejuzz                            |
| Gen AI    | POST   | `/sentimen`              | Analisis sentimen ulasan pelanggan           |
| Gen AI    | POST   | `/sentimen/batch`        | Analisis sentimen banyak ulasan              |
| Gen AI    | POST   | `/ai/faq`                | Tanya jawab panduan aplikasi (RAG)           |
| Riwayat   | GET    | `/history`               | Riwayat perhitungan (untuk FE & DS)          |
| Riwayat   | GET    | `/chat/history`          | Riwayat percakapan Chatbot                   |
| Riwayat   | PATCH  | `/history/:id`           | Input `cup_nyata` untuk evaluasi akurasi     |
| Riwayat   | GET    | `/accuracy`              | Data ringkasan akurasi estimasi              |

## 📁 Struktur Folder

```text
backend/
├── prisma/               # Skema database & seeder (data dari Tim DS)
├── src/
│   ├── config/           # Konfigurasi Database (Prisma)
│   ├── controllers/      # Logika utama (Auth, Kalkulasi, AI, Riwayat)
│   ├── middlewares/      # Auth JWT, Validasi Joi, Error Handler
│   ├── routes/           # Definisi URL endpoint
│   ├── services/         # Integrasi ke API Tim AI (FastAPI)
│   ├── utils/            # Helper & Custom Error
│   ├── validators/       # Skema validasi Joi
│   ├── app.js            # Setup Express
│   └── server.js         # Entry point
├── .env.example          # Template environment variables
├── package.json
└── README.md
```

## 🤝 Tim Pengembang (A26-CS002)

- **Full-Stack Developer:** Revi Febrianti, Nabilla Wulandari
- **Data Science:** Aria Budi Kusuma, Fadillah Dwi Cahyanti
- **AI Engineer:** I Nyoman Geraldo Minggus Augusta, Mayla Triana Ratu

Proyek ini dikembangkan sebagai bagian dari Capstone Project Program Asah 2026 (Dicoding x GoTo).

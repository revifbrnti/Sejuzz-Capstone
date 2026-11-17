# Kontrak API - Sejuzz (A26-CS002)

Dokumen ini adalah kesepakatan format data antara Tim Full Stack (Backend & Frontend), Tim Data Science, dan Tim AI.

**Base URL (Production):** `https://sejuzz-capstone-production.up.railway.app/api/v1`

---

## 1. Format Error Seragam (Standard Error Response)

Semua _error_ dari Backend Express akan mengembalikan format JSON yang konsisten seperti ini:

```json
{
  "error": "Pesan kesalahan yang jelas dan mudah dipahami pengguna"
}
```

**Daftar Kode Status HTTP & Skenario:**

| Status Code                | Skenario / Penyebab                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------------------- |
| `400 Bad Request`          | Validasi Joi gagal (input kosong, berat negatif, format salah).                                   |
| `401 Unauthorized`         | Token JWT tidak ada, tidak valid, atau sudah kedaluwarsa saat mengakses endpoint yang diproteksi. |
| `404 Not Found`            | Data (ID buah atau riwayat) tidak ditemukan di database.                                          |
| `422 Unprocessable Entity` | Format request tidak sesuai (dikirim dari Backend ke FastAPI AI jika ada field yang salah).       |
| `503 Service Unavailable`  | Layanan Tim AI (FastAPI) sedang mati, timeout, atau mengembalikan error.                          |

---

## 2. Format Data Buah (Dari Tim DS ke Database Backend)

Data dari Tim Data Science (berhasil dimasukkan melalui `seed.js`):

```json
{
  "nama_buah": "Semangka",
  "berat_rata_per_buah_gram": 3381,
  "faktor_susut": 0.489,
  "gram_per_cup_small": 200,
  "gram_per_cup_large": 300,
  "sumber_data": "dataset_ds",
  "sumber_takaran": "data_contoh",
  "jumlah_sampel": 100
}
```

---

## 3. Endpoint Backend untuk Frontend

### A. POST `/login`

Mendapatkan Token JWT.

**Request:**

```json
{
  "email": "owner@sejuzz.com",
  "password": "<password-owner>"
}
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": { "id": 1, "email": "owner@sejuzz.com", "nama": "Sean Conery" }
  }
}
```

**Response 401 Unauthorized:**

```json
{ "error": "Email atau password salah" }
```

### B. GET `/fruits`

Mengambil semua daftar buah untuk dropdown.

**Response 200 OK:**

```json
[
  {
    "id": 1,
    "nama_buah": "Alpukat",
    "berat_rata_per_buah_gram": 247,
    "gram_per_cup_small": 200,
    "gram_per_cup_large": 300,
    "faktor_susut": 0.2603
  }
]
```

### C. PUT `/fruits/:id` (Proteksi: Wajib Login)

Mengubah takaran buah.

**Header:** `Authorization: Bearer <token>`

**Request Body:**

```json
{ "gram_per_cup_small": 210 }
```

**Response 200 OK:**

```json
{ "message": "Takaran berhasil diubah", "data": { ... } }
```

### D. POST `/calculate`

Menghitung estimasi cup (Normal).

**Request:**

```json
{
  "fruitId": 1,
  "amount": 5,
  "unit": "kg",
  "cupSize": "large",
  "kehilangan_produksi_persen": 0
}
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "fruitName": "Alpukat",
    "weightKgUsed": 5,
    "skinWeight": 1.3,
    "fleshWeight": 3.7,
    "estimatedCups": 12,
    "remainingFleshGram": 98.5,
    "aiInsight": "Dari 5 kg Alpukat...",
    "dihitungOleh": "AI_Service"
  }
}
```

**Response 400 Bad Request (Validasi Gagal):**

```json
{ "error": "\"amount\" must be a positive number" }
```

### E. POST `/calculate-target`

Menghitung target cup ke berat buah.

**Request:**

```json
{
  "fruitId": 1,
  "targetCups": 50,
  "cupSize": "large"
}
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "fruitName": "Alpukat",
    "targetCups": 50,
    "beratKgDibutuhkan": 29.35,
    "estimasiJumlahBuah": 119
  }
}
```

### F. POST `/calculate-combination`

Menghitung kombinasi 2 buah.

**Request:**

```json
{
  "fruitA_id": 1,
  "amountA": 2,
  "unitA": "kg",
  "fruitB_id": 2,
  "amountB": 1,
  "unitB": "kg",
  "cupSize": "large"
}
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "kombinasi": "Alpukat + Mangga",
    "detailA": { "nama": "Alpukat", "cups": 4, "sisa_gram": 279.4 },
    "detailB": { "nama": "Mangga", "cups": 2, "sisa_gram": 182.2 },
    "totalCups": 6,
    "totalSisaGram": 461.6
  }
}
```

### G. POST `/chat`

Chatbot AI (Gen AI).

**Request:**

```json
{ "message": "5 kg alpukat berapa cup?" }
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "intent": "hitung_estimasi",
    "status": "answered",
    "reply": "Dari 5 kg alpukat...",
    "intent_source": "llm"
  }
}
```

**Response 503 Service Unavailable (AI Mati):**

```json
{ "error": "Layanan Chatbot sedang sibuk atau mati, coba lagi nanti." }
```

### H. GET `/chat/history`

Riwayat percakapan Chatbot.

**Response 200 OK:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "user_message": "Halo",
      "ai_response": "Halo! Ada yang bisa dibantu?",
      "created_at": "..."
    }
  ]
}
```

### I. POST `/sentimen`

Analisis sentimen 1 ulasan (Gen AI).

**Request:**

```json
{ "teks": "Jusnya segar banget" }
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "teks": "Jusnya segar banget",
    "sentimen": "positif",
    "skor": 0.91,
    "yakin": true,
    "peringatan": null
  }
}
```

### J. POST `/sentimen/batch`

Analisis sentimen banyak ulasan.

**Request:**

```json
{ "daftar_teks": ["Jusnya enak", "Pelayanan lambat"] }
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "jumlah": 2,
    "jumlah_positif": 1,
    "jumlah_negatif": 1,
    "daftar_hasil": [ ... ]
  }
}
```

### K. POST `/ai/faq`

Tanya jawab panduan (RAG).

**Request:**

```json
{ "message": "Bagaimana cara mengubah takaran?" }
```

**Response 200 OK:**

```json
{
  "status": "success",
  "data": {
    "status": "answered",
    "answer": "Cara mengubah takaran adalah...",
    "rag": { "sumber": ["panduan.txt"] }
  }
}
```

### L. GET `/history`

Riwayat perhitungan kalkulator (Untuk Tim DS).

**Response 200 OK:**

```json
[
  {
    "id": 1,
    "weight_kg": 5,
    "cup_size": "large",
    "estimated_cups": 12,
    "created_at": "2026-11-16T10:00:00Z",
    "fruit": { "nama_buah": "Alpukat" }
  }
]
```

### M. PATCH `/history/:id`

Mengisi `cup_nyata` (hasil produksi asli) untuk evaluasi akurasi.

**Request:**

```json
{ "cup_nyata": 11 }
```

**Response 200 OK:**

```json
{ "message": "Cup nyata berhasil disimpan", "data": { ... } }
```

### N. GET `/accuracy`

Ringkasan akurasi (Untuk Tim DS).

**Response 200 OK:**

```json
{
  "ringkasan": { "total_uji": 10, "rata_rata_selisih_cup": 0.8 },
  "detail": [ ... ]
}
```

---

## 4. Endpoint Integrasi Internal (Backend ke FastAPI Tim AI)

> Catatan: Request dari Express ke FastAPI wajib menyertakan header `X-API-Key`.

| Endpoint AI        | Format Request (dari Express)                                                               | Format Response (dari AI)                                                |
| ------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `POST /calculate`  | `{"fruit": "alpukat", "amount": 5, "unit": "kg", "cup_size": "large", "gram_per_cup": 300}` | `{"berat_isi_gram": 3700, "jumlah_cup": 12, "sisa_buah_gram": 100}`      |
| `POST /ai/explain` | Sama dengan `/calculate`                                                                    | `{"calculation": {...}, "explanation": "Dari 5 kg...", "source": "llm"}` |
| `POST /ai/chat`    | `{"message": "...", "takaran": {"alpukat": {"small": 200, "large": 300}}}`                  | `{"intent": "hitung_estimasi", "status": "answered", "reply": "..."}`    |
| `POST /sentimen`   | `{"teks": "..."}`                                                                           | `{"sentimen": "positif", "skor": 0.91, "yakin": true}`                   |
| `POST /ai/faq`     | `{"question": "..."}`                                                                       | `{"status": "answered", "answer": "...", "rag": {...}}`                  |

---

## 5. Checklist Persetujuan

- [v] Tim Frontend (FS) setuju dengan format request/response di atas.
- [v] Tim Data Science setuju dengan format data buah.
- [v] Tim AI setuju dengan format integrasi endpoint.

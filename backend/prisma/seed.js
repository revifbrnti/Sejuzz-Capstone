const prisma = require("../src/config/db");
const bcrypt = require("bcryptjs");

async function main() {
  console.log("Mulai memasukkan data final dari Tim DS...");

  const dataBuah = [
    {
      nama_buah: "Alpukat",
      berat_rata_per_buah_gram: 247,
      faktor_susut: 0.2603,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Mangga",
      berat_rata_per_buah_gram: 358,
      faktor_susut: 0.2919,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Buah Naga",
      berat_rata_per_buah_gram: 390,
      faktor_susut: 0.3284,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Jambu Merah",
      berat_rata_per_buah_gram: 206,
      faktor_susut: 0.2178,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Pisang",
      berat_rata_per_buah_gram: 128,
      faktor_susut: 0.3607,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Sirsak",
      berat_rata_per_buah_gram: 743,
      faktor_susut: 0.3319,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Semangka",
      berat_rata_per_buah_gram: 3381,
      faktor_susut: 0.489,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Melon",
      berat_rata_per_buah_gram: 1210,
      faktor_susut: 0.4895,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Tomat",
      berat_rata_per_buah_gram: 117,
      faktor_susut: 0.0855,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Nanas",
      berat_rata_per_buah_gram: 1213,
      faktor_susut: 0.4903,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Pepaya",
      berat_rata_per_buah_gram: 1218,
      faktor_susut: 0.3792,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Kelapa",
      berat_rata_per_buah_gram: 879,
      faktor_susut: 0.7423,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Jeruk",
      berat_rata_per_buah_gram: 181,
      faktor_susut: 0.2693,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Terong Belanda",
      berat_rata_per_buah_gram: 88,
      faktor_susut: 0.2994,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Stroberi",
      berat_rata_per_buah_gram: 258,
      faktor_susut: 0.062,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Blueberry",
      berat_rata_per_buah_gram: 126,
      faktor_susut: 0.047,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    {
      nama_buah: "Blackberry",
      berat_rata_per_buah_gram: 124,
      faktor_susut: 0.0414,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "dataset_ds",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 100,
    },
    // Mix Berry tetap ada karena dianggap 1 entitas beli per berat
    {
      nama_buah: "Mix Berry",
      berat_rata_per_buah_gram: null,
      faktor_susut: 0.0501,
      gram_per_cup_small: 200,
      gram_per_cup_large: 300,
      sumber_data: "asumsi_tim",
      sumber_takaran: "data_contoh",
      jumlah_sampel: 0,
    },
  ];

  // Hapus data lama agar bersih
  console.log("Menghapus data lama...");
  await prisma.riwayatChat.deleteMany({});
  await prisma.riwayatPerhitungan.deleteMany({});
  await prisma.takaranBuah.deleteMany({});

  // Masukkan data baru
  console.log("Memasukkan 18 data buah final...");
  for (const buah of dataBuah) {
    await prisma.takaranBuah.create({
      data: buah,
    });
  }

  // 3. Buat Akun Owner Default
  console.log("Membuat akun Owner default...");
  const hashedPassword = await bcrypt.hash("sejuzz123", 10);
  await prisma.user.upsert({
    where: { email: "owner@sejuzz.com" }, // Gunakan upsert agar tidak error jika dijalankan 2x
    update: {},
    create: {
      email: "owner@sejuzz.com", // <-- Ubah ke email
      password: hashedPassword,
      nama_lengkap: "Sean Conery",
      peran: "owner",
    },
  });

  console.log("Selesai! Semua data berhasil dimasukkan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

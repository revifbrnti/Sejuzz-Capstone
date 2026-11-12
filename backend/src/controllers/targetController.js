const prisma = require("../config/db");

const calculateTargetCup = async (req, res, next) => {
  // Frontend mengirim: { fruitId, targetCups, cupSize }
  const { fruitId, targetCups, cupSize } = req.body;

  try {
    const fruit = await prisma.takaranBuah.findUnique({
      where: { id: fruitId },
    });
    if (!fruit) return res.status(404).json({ error: "Buah tidak ditemukan" });

    // 1. Tentukan gram per cup berdasarkan ukuran
    const gramPerCup =
      cupSize === "small" ? fruit.gram_per_cup_small : fruit.gram_per_cup_large;

    // 2. Hitung total daging buah yang dibutuhkan (dalam gram)
    const totalFleshGram = targetCups * gramPerCup;

    // 3. Hitung berat buah utuh yang harus dibeli (dalam kg)
    // Rumus: Berat Utuh = Total Daging / (1 - faktor_susut)
    const totalWeightKg = totalFleshGram / 1000 / (1 - fruit.faktor_susut);

    // 4. Hitung estimasi jumlah buah (jika data berat rata-rata tersedia)
    let estimasiJumlahBuah = null;
    if (fruit.berat_rata_per_buah_gram) {
      estimasiJumlahBuah = Math.ceil(
        (totalWeightKg * 1000) / fruit.berat_rata_per_buah_gram,
      );
    }

    res.status(200).json({
      status: "success",
      data: {
        fruitName: fruit.nama_buah,
        targetCups: targetCups,
        cupSize: cupSize,
        beratKgDibutuhkan: Number(totalWeightKg.toFixed(2)), // Misal: 5.25 kg
        estimasiJumlahBuah: estimasiJumlahBuah, // Misal: 2 buah
        catatan:
          "Berat dan jumlah buah di atas adalah estimasi berdasarkan target cup.",
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateTargetCup };

const prisma = require("../config/db");

const calculateTargetCup = async (req, res, next) => {
  const { fruitId, targetCups, cupSize } = req.body;

  try {
    const fruit = await prisma.takaranBuah.findUnique({
      where: { id: fruitId },
    });
    if (!fruit) return res.status(404).json({ error: "Buah tidak ditemukan" });

    const gramPerCup =
      cupSize === "small" ? fruit.gram_per_cup_small : fruit.gram_per_cup_large;

    const totalFleshGram = targetCups * gramPerCup;
    const totalWeightKg = totalFleshGram / 1000 / (1 - fruit.faktor_susut);

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
        beratKgDibutuhkan: Number(totalWeightKg.toFixed(2)),
        estimasiJumlahBuah: estimasiJumlahBuah,
        catatan:
          "Berat dan jumlah buah di atas adalah estimasi berdasarkan target cup.",
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateTargetCup };

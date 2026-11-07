const prisma = require("../config/db");

const calculateEstimation = async (req, res, next) => {
  const { fruitId, weightKg, cupSize } = req.body;

  try {
    const fruit = await prisma.takaranBuah.findUnique({
      where: { id: fruitId },
    });
    if (!fruit) return res.status(404).json({ error: "Buah tidak ditemukan" });

    const gramPerCup =
      cupSize === "small" ? fruit.gram_per_cup_small : fruit.gram_per_cup_large;

    // Rumus
    const skinWeight = weightKg * fruit.faktor_susut;
    const fleshWeight = weightKg - skinWeight;
    const fleshGram = fleshWeight * 1000;
    const estimatedCups = Math.floor(fleshGram / gramPerCup);
    const remaining = fleshGram - estimatedCups * gramPerCup;

    // Simpan riwayat
    await prisma.riwayatPerhitungan.create({
      data: {
        fruit_id: fruitId,
        weight_kg: weightKg,
        cup_size: cupSize,
        estimated_cups: estimatedCups,
        remaining_flesh_gram: remaining,
      },
    });

    res.status(200).json({
      fruitName: fruit.nama_buah,
      skinWeight: Number(skinWeight.toFixed(2)),
      fleshWeight: Number(fleshWeight.toFixed(2)),
      estimatedCups,
      remainingFleshGram: Number(remaining.toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateEstimation };

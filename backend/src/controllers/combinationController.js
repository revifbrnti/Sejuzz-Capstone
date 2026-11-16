const prisma = require("../config/db");
const { hitungDariAI } = require("../services/calculatorService");
const { hitungManual } = require("../services/helperService");

const calculateCombination = async (req, res, next) => {
  const { fruitA_id, amountA, unitA, fruitB_id, amountB, unitB, cupSize } =
    req.body;

  try {
    const fruitA = await prisma.takaranBuah.findUnique({
      where: { id: fruitA_id },
    });
    if (!fruitA)
      return res.status(404).json({ error: "Buah A tidak ditemukan" });

    let weightKgA = amountA;
    if (unitA === "buah" && fruitA.berat_rata_per_buah_gram) {
      weightKgA = (amountA * fruitA.berat_rata_per_buah_gram) / 1000;
    }
    const gramPerCupA =
      cupSize === "small"
        ? fruitA.gram_per_cup_small
        : fruitA.gram_per_cup_large;

    const payloadA = {
      fruit: fruitA.nama_buah.toLowerCase(),
      amount: weightKgA,
      unit: "kg",
      cup_size: cupSize,
      gram_per_cup: gramPerCupA,
    };

    let hasilA;
    try {
      const aiA = await hitungDariAI(payloadA);
      hasilA = { cups: aiA.jumlah_cup, sisa: aiA.sisa_buah_gram || 0 };
    } catch {
      const manualA = hitungManual(weightKgA, fruitA.faktor_susut, gramPerCupA);
      hasilA = {
        cups: manualA.estimatedCups,
        sisa: manualA.remainingFleshGram,
      };
    }

    const fruitB = await prisma.takaranBuah.findUnique({
      where: { id: fruitB_id },
    });
    if (!fruitB)
      return res.status(404).json({ error: "Buah B tidak ditemukan" });

    let weightKgB = amountB;
    if (unitB === "buah" && fruitB.berat_rata_per_buah_gram) {
      weightKgB = (amountB * fruitB.berat_rata_per_buah_gram) / 1000;
    }
    const gramPerCupB =
      cupSize === "small"
        ? fruitB.gram_per_cup_small
        : fruitB.gram_per_cup_large;

    const payloadB = {
      fruit: fruitB.nama_buah.toLowerCase(),
      amount: weightKgB,
      unit: "kg",
      cup_size: cupSize,
      gram_per_cup: gramPerCupB,
    };

    let hasilB;
    try {
      const aiB = await hitungDariAI(payloadB);
      hasilB = { cups: aiB.jumlah_cup, sisa: aiB.sisa_buah_gram || 0 };
    } catch {
      const manualB = hitungManual(weightKgB, fruitB.faktor_susut, gramPerCupB);
      hasilB = {
        cups: manualB.estimatedCups,
        sisa: manualB.remainingFleshGram,
      };
    }

    const totalCups = hasilA.cups + hasilB.cups;
    const totalSisa = hasilA.sisa + hasilB.sisa;

    await prisma.riwayatPerhitungan.create({
      data: {
        fruit_id: fruitA_id,
        weight_kg: weightKgA + weightKgB,
        cup_size: cupSize,
        estimated_cups: totalCups,
        remaining_flesh_gram: totalSisa,
        tipe_input: "kombinasi",
        nilai_input: amountA + amountB,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        kombinasi: `${fruitA.nama_buah} + ${fruitB.nama_buah}`,
        detailA: {
          nama: fruitA.nama_buah,
          berat_kg_dipakai: Number(weightKgA.toFixed(2)),
          cups: hasilA.cups,
          sisa_gram: hasilA.sisa,
        },
        detailB: {
          nama: fruitB.nama_buah,
          berat_kg_dipakai: Number(weightKgB.toFixed(2)),
          cups: hasilB.cups,
          sisa_gram: hasilB.sisa,
        },
        totalCups: totalCups,
        totalSisaGram: totalSisa,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateCombination };

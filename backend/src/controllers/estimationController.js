const prisma = require("../config/db");
const { hitungDariAI } = require("../services/calculatorService");
const { hitungManual } = require("../services/helperService");
const { mintaPenjelasanAI } = require("../services/aiService");

const calculateEstimation = async (req, res, next) => {
  // Tambahkan 'kehilangan_produksi_persen' dari body (opsional, default 0)
  const {
    fruitId,
    amount,
    unit,
    cupSize,
    kehilangan_produksi_persen = 0,
  } = req.body;

  try {
    const fruit = await prisma.takaranBuah.findUnique({
      where: { id: fruitId },
    });
    if (!fruit) return res.status(404).json({ error: "Buah tidak ditemukan" });

    let weightKg = amount;
    if (unit === "buah") {
      if (!fruit.berat_rata_per_buah_gram)
        return res.status(400).json({ error: "Data berat belum ada." });
      weightKg = (amount * fruit.berat_rata_per_buah_gram) / 1000;
    }

    const gramPerCup =
      cupSize === "small" ? fruit.gram_per_cup_small : fruit.gram_per_cup_large;

    // Hitung total daging bersih SEBELUM kehilangan produksi
    const totalFleshGram = weightKg * 1000 * (1 - fruit.faktor_susut);

    // Hitung potongan kehilangan produksi (jika ada)
    const lossGram = totalFleshGram * (kehilangan_produksi_persen / 100);

    // Daging bersih yang benar-benar bisa diblender
    const netFleshGram = totalFleshGram - lossGram;

    // --- KIRIM KE AI DENGAN BERAT YANG SUDAH DIKURANGI KEHILANGAN ---
    // Tim AI hanya butuh tahu total berat buah utuh yang setara dengan netFleshGram ini
    const equivalentWeightKg = netFleshGram / (1 - fruit.faktor_susut) / 1000;

    const payloadKeAI = {
      fruit: fruit.nama_buah.toLowerCase(),
      amount: equivalentWeightKg,
      unit: "kg",
      cup_size: cupSize,
      gram_per_cup: gramPerCup,
    };

    let hasilHitung;
    let aiInsight = "Penjelasan AI tidak tersedia.";
    let dihitungOleh = "AI_Service";

    try {
      const aiResponse = await hitungDariAI(payloadKeAI);
      const explainResponse = await mintaPenjelasanAI(payloadKeAI);
      if (explainResponse && explainResponse.explanation) {
        aiInsight = explainResponse.explanation;
      }

      hasilHitung = {
        skinWeight: Number((weightKg * fruit.faktor_susut).toFixed(2)),
        fleshWeight: Number((netFleshGram / 1000).toFixed(2)), // Daging bersih setelah loss
        estimatedCups: aiResponse.jumlah_cup,
        remainingFleshGram: aiResponse.sisa_buah_gram || 0,
      };
    } catch (aiError) {
      console.warn("AI gagal, pakai fallback lokal.");
      dihitungOleh = "Local_Fallback";

      // Fallback juga harus menghitung loss
      const hasilManual = hitungManual(
        weightKg,
        fruit.faktor_susut,
        gramPerCup,
      );
      // Kita sesuaikan hasil manual dengan loss
      const estimasiManualCups = Math.floor(netFleshGram / gramPerCup);
      const sisaManual = netFleshGram - estimasiManualCups * gramPerCup;

      hasilHitung = {
        skinWeight: hasilManual.skinWeight,
        fleshWeight: Number((netFleshGram / 1000).toFixed(2)),
        estimatedCups: estimasiManualCups,
        remainingFleshGram: Number(sisaManual.toFixed(2)),
      };
      aiInsight =
        "AI sedang sibuk, hasil dihitung dengan rumus standar (termasuk kehilangan produksi).";
    }

    // Simpan ke database
    await prisma.riwayatPerhitungan.create({
      data: {
        fruit_id: fruitId,
        weight_kg: weightKg,
        cup_size: cupSize,
        estimated_cups: hasilHitung.estimatedCups,
        remaining_flesh_gram: hasilHitung.remainingFleshGram,
        tipe_input: unit,
        nilai_input: amount,
      },
    });

    res.status(200).json({
      status: "success",
      data: {
        fruitName: fruit.nama_buah,
        weightKgUsed: Number(weightKg.toFixed(2)),
        kehilangan_produksi_persen: kehilangan_produksi_persen, // Tampilkan untuk konfirmasi
        ...hasilHitung,
        aiInsight,
        dihitungOleh,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateEstimation };

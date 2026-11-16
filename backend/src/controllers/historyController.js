const prisma = require("../config/db");

const getHistory = async (req, res, next) => {
  try {
    const history = await prisma.riwayatPerhitungan.findMany({
      include: { fruit: true },
      orderBy: { created_at: "desc" },
    });
    res.status(200).json(history);
  } catch (err) {
    next(err);
  }
};

const updateActualCup = async (req, res, next) => {
  const { id } = req.params;
  const { cup_nyata } = req.body;
  try {
    const updated = await prisma.riwayatPerhitungan.update({
      where: { id: Number(id) },
      data: { cup_nyata: Number(cup_nyata) },
    });
    res
      .status(200)
      .json({ message: "Cup nyata berhasil disimpan", data: updated });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Riwayat tidak ditemukan" });
    next(err);
  }
};

const getAccuracy = async (req, res, next) => {
  try {
    const data = await prisma.riwayatPerhitungan.findMany({
      where: { cup_nyata: { not: null } },
    });
    const totalUji = data.length;
    let totalSelisih = 0;
    data.forEach((d) => {
      totalSelisih += Math.abs(d.estimated_cups - d.cup_nyata);
    });
    const rataRataSelisih =
      totalUji > 0 ? (totalSelisih / totalUji).toFixed(2) : 0;

    res.status(200).json({
      ringkasan: {
        total_uji: totalUji,
        rata_rata_selisih_cup: Number(rataRataSelisih),
      },
      detail: data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory, updateActualCup, getAccuracy };

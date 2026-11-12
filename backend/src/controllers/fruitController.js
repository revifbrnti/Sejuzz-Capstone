const prisma = require("../config/db");

const getFruits = async (req, res, next) => {
  try {
    const fruits = await prisma.takaranBuah.findMany({
      orderBy: { id: "asc" },
    });
    res.status(200).json(fruits);
  } catch (err) {
    next(err);
  }
};

const updateFruit = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Ambil HANYA field yang diizinkan (mencegah user mengubah id atau nama_buah)
    const { gram_per_cup_small, gram_per_cup_large, faktor_susut } = req.body;

    const updatedFruit = await prisma.takaranBuah.update({
      where: { id: Number(id) },
      data: {
        ...(gram_per_cup_small !== undefined && { gram_per_cup_small }),
        ...(gram_per_cup_large !== undefined && { gram_per_cup_large }),
        ...(faktor_susut !== undefined && { faktor_susut }),
      },
    });

    res
      .status(200)
      .json({ message: "Takaran berhasil diubah", data: updatedFruit });
  } catch (err) {
    if (err.code === "P2025")
      return res.status(404).json({ error: "Buah tidak ditemukan" });
    next(err);
  }
};

module.exports = { getFruits, updateFruit };

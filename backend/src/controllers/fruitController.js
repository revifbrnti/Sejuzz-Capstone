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
    const updatedFruit = await prisma.takaranBuah.update({
      where: { id: Number(id) },
      data: req.body,
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

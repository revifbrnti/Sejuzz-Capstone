const {
  tanyaFAQ,
  analisisSentimen,
  analisisSentimenBatch,
} = require("../services/aiService");
const prisma = require("../config/db");

const handleFAQ = async (req, res, next) => {
  const { message } = req.body;
  try {
    const result = await tanyaFAQ(message);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    if (error.message === "AI_FAQ_DOWN") {
      return res
        .status(503)
        .json({ error: "Layanan FAQ sedang sibuk, coba lagi nanti." });
    }
    next(error);
  }
};

const handleSentimen = async (req, res, next) => {
  const { teks } = req.body;
  try {
    const result = await analisisSentimen(teks);

    const savedUlasan = await prisma.ulasanPelanggan.create({
      data: {
        teks: result.teks,
        sentimen: result.sentimen,
        skor: result.skor,
        yakin: result.yakin,
      },
    });

    res.status(200).json({ status: "success", data: savedUlasan });
  } catch (error) {
    if (error.message === "AI_SENTIMEN_DOWN") {
      return res
        .status(503)
        .json({ error: "Layanan Analisis Sentimen sedang sibuk." });
    }
    next(error);
  }
};

const getUlasan = async (req, res, next) => {
  try {
    const ulasan = await prisma.ulasanPelanggan.findMany({
      orderBy: { created_at: "desc" },
    });
    res.status(200).json({ status: "success", data: ulasan });
  } catch (error) {
    next(error);
  }
};

const handleSentimenBatch = async (req, res, next) => {
  const { daftar_teks } = req.body;
  try {
    const result = await analisisSentimenBatch(daftar_teks);
    res.status(200).json({ status: "success", data: result });
  } catch (error) {
    if (error.message === "AI_SENTIMEN_DOWN") {
      return res
        .status(503)
        .json({ error: "Layanan Analisis Sentimen sedang sibuk." });
    }
    next(error);
  }
};

module.exports = { handleFAQ, handleSentimen, getUlasan, handleSentimenBatch };

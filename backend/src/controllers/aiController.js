const {
  tanyaFAQ,
  analisisSentimen,
  analisisSentimenBatch,
} = require("../services/aiService");

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

module.exports = { handleFAQ, handleSentimen, handleSentimenBatch };

const axios = require("axios");
const prisma = require("../config/db");

const chatDenganAI = async (message) => {
  try {
    const semuaBuah = await prisma.takaranBuah.findMany();
    const takaranData = {};
    semuaBuah.forEach((buah) => {
      takaranData[buah.nama_buah.toLowerCase()] = {
        small: buah.gram_per_cup_small,
        large: buah.gram_per_cup_large,
      };
    });

    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/chat`,
      { message, takaran: takaranData },
      {
        timeout: 60000,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );

    if (response.data && response.data.reply) {
      await prisma.riwayatChat.create({
        data: { user_message: message, ai_response: response.data.reply },
      });
    }
    return response.data;
  } catch (error) {
    console.error("AI Chat Error:", error.message);
    throw new Error("AI_CHATBOT_DOWN");
  }
};

const mintaPenjelasanAI = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/explain`,
      payload,
      {
        timeout: 60000,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    return response.data;
  } catch (error) {
    console.error("AI Explain Error:", error.message);
    return null;
  }
};

const tanyaFAQ = async (message) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/faq`,
      { message },
      {
        timeout: 30000,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    return response.data;
  } catch (error) {
    console.error("AI FAQ Error:", error.message);
    throw new Error("AI_FAQ_DOWN");
  }
};

const analisisSentimen = async (teks) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/sentimen`,
      { teks },
      {
        timeout: 30000,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    return response.data;
  } catch (error) {
    console.error("AI Sentimen Error:", error.message);
    throw new Error("AI_SENTIMEN_DOWN");
  }
};

const analisisSentimenBatch = async (daftarTeks) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/sentimen/batch`,
      { daftar_teks: daftarTeks },
      {
        timeout: 60000,
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    return response.data;
  } catch (error) {
    console.error("AI Sentimen Batch Error:", error.message);
    throw new Error("AI_SENTIMEN_DOWN");
  }
};

module.exports = {
  chatDenganAI,
  mintaPenjelasanAI,
  tanyaFAQ,
  analisisSentimen,
  analisisSentimenBatch,
};

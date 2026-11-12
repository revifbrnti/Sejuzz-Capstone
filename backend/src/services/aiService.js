const axios = require("axios");
const prisma = require("../config/db");

// 1. Fungsi Chatbot (Untuk percakapan interaktif)
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

// 2. Fungsi BARU: Minta Penjelasan AI (Insight dari LLM)
const mintaPenjelasanAI = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/ai/explain`,
      payload,
      {
        timeout: 60000, // LLM butuh waktu lama
        headers: { "X-API-Key": process.env.AI_API_KEY },
      },
    );
    return response.data; // Berisi { calculation, explanation, source, model }
  } catch (error) {
    console.error("AI Explain Error:", error.message);
    return null; // Kembalikan null agar tidak crash
  }
};

module.exports = { chatDenganAI, mintaPenjelasanAI };

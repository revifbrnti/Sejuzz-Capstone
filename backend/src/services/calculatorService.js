const axios = require("axios");

const hitungDariAI = async (payload) => {
  try {
    const response = await axios.post(
      `${process.env.AI_SERVICE_URL}/calculate`,
      payload,
      {
        timeout: 5000,
        headers: {
          "X-API-Key": process.env.AI_API_KEY, // <-- Memanggil kunci dari .env
        },
      },
    );
    return response.data;
  } catch (error) {
    throw new Error("AI_CALCULATOR_DOWN");
  }
};
module.exports = { hitungDariAI };

const { chatDenganAI } = require("../services/aiService");

const handleChat = async (req, res, next) => {
  const { message } = req.body;
  try {
    const aiResponse = await chatDenganAI(message);
    res.status(200).json(aiResponse);
  } catch (error) {
    if (error.message === "AI_CHATBOT_DOWN") {
      return res
        .status(503)
        .json({
          error: "Layanan Chatbot sedang sibuk atau mati, coba lagi nanti.",
        });
    }
    next(error);
  }
};

module.exports = { handleChat };

const express = require("express");
const router = express.Router();
const { handleChat } = require("../controllers/chatController");
const validate = require("../middlewares/validate");
const { chatSchema } = require("../validators/chatValidator");

router.post("/", validate(chatSchema), handleChat);

module.exports = router;

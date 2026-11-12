const express = require("express");
const router = express.Router();
const { getFruits, updateFruit } = require("../controllers/fruitController");
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/authMiddleware"); // <-- Pastikan ini di-import
const { updateSchema } = require("../validators/fruitValidator");

// Endpoint GET (Publik - Tanpa Login)
router.get("/", getFruits);

// Endpoint PUT (Proteksi - Wajib Login)
router.put("/:id", authMiddleware, validate(updateSchema), updateFruit);

module.exports = router;

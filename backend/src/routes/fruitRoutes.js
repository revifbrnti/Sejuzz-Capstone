const express = require("express");
const router = express.Router();
const { getFruits, updateFruit } = require("../controllers/fruitController");
const validate = require("../middlewares/validate");
const authMiddleware = require("../middlewares/authMiddleware");
const { updateSchema } = require("../validators/fruitValidator");

router.get("/", getFruits);
router.put("/:id", authMiddleware, validate(updateSchema), updateFruit);

module.exports = router;

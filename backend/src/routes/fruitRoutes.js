const express = require("express");
const router = express.Router();
const { getFruits, updateFruit } = require("../controllers/fruitController");
const validate = require("../middlewares/validate");
const Joi = require("joi");

const updateSchema = Joi.object({
  gram_per_cup_small: Joi.number().integer().positive(),
  gram_per_cup_large: Joi.number().integer().positive(),
  faktor_susut: Joi.number().min(0).max(1),
}).min(1);

router.get("/", getFruits);
router.put("/:id", validate(updateSchema), updateFruit);

module.exports = router;

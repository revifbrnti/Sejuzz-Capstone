const express = require("express");
const router = express.Router();
const { calculateEstimation } = require("../controllers/calculateController");
const validate = require("../middlewares/validate");
const Joi = require("joi");

const calcSchema = Joi.object({
  fruitId: Joi.number().integer().positive().required(),
  weightKg: Joi.number().positive().required(),
  cupSize: Joi.string().valid("small", "large").required(),
});

router.post("/", validate(calcSchema), calculateEstimation);

module.exports = router;

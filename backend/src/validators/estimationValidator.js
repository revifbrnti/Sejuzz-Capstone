const Joi = require("joi");

const calculateSchema = Joi.object({
  fruitId: Joi.number().integer().positive().required(),
  amount: Joi.number().positive().required(),
  unit: Joi.string().valid("kg", "buah").required(),
  cupSize: Joi.string().valid("small", "large").required(),
  kehilangan_produksi_persen: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .default(0),
});

module.exports = { calculateSchema };

const Joi = require("joi");

const updateSchema = Joi.object({
  gram_per_cup_small: Joi.number().integer().positive(),
  gram_per_cup_large: Joi.number().integer().positive(),
  faktor_susut: Joi.number().min(0).max(1),
}).min(1);

module.exports = { updateSchema };

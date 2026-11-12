const Joi = require("joi");

const chatSchema = Joi.object({
  message: Joi.string().min(1).max(300).required(),
});

module.exports = { chatSchema };

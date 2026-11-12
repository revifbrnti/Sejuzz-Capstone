const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true, // <-- Membuang data sampah yang tidak ada di schema Joi
  });

  if (error) {
    return res.status(400).json({
      error: error.details.map((err) => err.message).join(", "),
    });
  }

  req.body = value; // Gunakan data yang sudah bersih
  next();
};
module.exports = validate;

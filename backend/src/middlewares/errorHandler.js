const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Terjadi kesalahan internal pada server",
  });
};
module.exports = errorHandler;

const notFound = (req, res, next) => {
  res.status(404).json({ error: `Route ${req.originalUrl} tidak ditemukan` });
};
module.exports = notFound;

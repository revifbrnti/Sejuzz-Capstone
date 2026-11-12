const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Akses ditolak. Silakan login terlebih dahulu.",
    });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "rahasia_sejuzz_default",
    );
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Sesi berakhir atau token tidak valid. Silakan login ulang.",
    });
  }
};

module.exports = authMiddleware;

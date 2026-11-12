const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validasi input sederhana
  if (!email || !password) {
    return res.status(400).json({ error: "Email dan password wajib diisi" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: "Email atau password salah" });
    }

    // Buat Token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, peran: user.peran },
      process.env.JWT_SECRET || "rahasia_sejuzz_default",
      { expiresIn: "1d" },
    );

    res.status(200).json({
      status: "success",
      data: {
        token,
        user: { id: user.id, email: user.email, nama: user.nama_lengkap },
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login };

const express = require("express");
const router = express.Router();
const prisma = require("../config/db");

const fruitRoutes = require("./fruitRoutes");
const estimationRoutes = require("./estimationRoutes");
const chatRoutes = require("./chatRoutes");
const historyController = require("../controllers/historyController");
const targetController = require("../controllers/targetController");
const combinationController = require("../controllers/combinationController");
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");

router.use("/fruits", fruitRoutes);
router.use("/calculate", estimationRoutes);
router.use("/chat", chatRoutes);

// Endpoint untuk Tim DS (Kalkulasi)
router.get("/history", historyController.getHistory);
router.patch("/history/:id", historyController.updateActualCup);
router.get("/accuracy", historyController.getAccuracy);

// Endpoint BARU: Riwayat Chat Gen AI (Untuk Frontend)
router.get("/chat/history", async (req, res, next) => {
  try {
    const history = await prisma.riwayatChat.findMany({
      orderBy: { created_at: "desc" },
      take: 50, // Ambil 50 chat terakhir
    });
    res.status(200).json({ status: "success", data: history });
  } catch (err) {
    next(err);
  }
});

router.post("/calculate-target", targetController.calculateTargetCup);
router.post(
  "/calculate-combination",
  combinationController.calculateCombination,
);
router.post("/login", authController.login);

module.exports = router;

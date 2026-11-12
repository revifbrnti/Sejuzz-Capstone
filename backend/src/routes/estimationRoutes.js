const express = require("express");
const router = express.Router();
const { calculateEstimation } = require("../controllers/estimationController"); // Pastikan ambil dari estimationController
const validate = require("../middlewares/validate");
const { calculateSchema } = require("../validators/estimationValidator");

router.post("/", validate(calculateSchema), calculateEstimation);

module.exports = router; // <-- INI PENTING

const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import router utama (yang nanti memuat semua route)
const apiRoutes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// 1. Middleware Dasar
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// 2. Route Utama
// Semua route akan diawali dengan /api/v1
app.use("/api/v1", apiRoutes);

// 3. Route Dasar untuk cek server
app.get("/", (req, res) => res.send("API Sejuzz Berjalan!"));

// 4. Global Error Handler (Wajib ditaruh paling bawah)
app.use(errorHandler);

module.exports = app;

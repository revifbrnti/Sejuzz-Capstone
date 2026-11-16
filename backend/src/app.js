const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());
app.use("/api/v1", apiRoutes);
app.get("/", (req, res) => res.send("API Sejuzz Berjalan!"));
app.use(errorHandler);

module.exports = app;

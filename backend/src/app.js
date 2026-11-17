const express = require("express");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://sejuzz-frontend.vercel.app"],
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(express.json());
app.use("/api/v1", apiRoutes);
app.get("/", (req, res) => res.send("API Sejuzz Berjalan!"));
app.use(errorHandler);

module.exports = app;

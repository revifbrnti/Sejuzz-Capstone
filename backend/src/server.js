const express = require("express");
const cors = require("cors");
require("dotenv").config();

const fruitRoutes = require("./routes/fruitRoutes");
const calculateRoutes = require("./routes/calculateRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

app.use("/api/v1/fruits", fruitRoutes);
app.use("/api/v1/calculate", calculateRoutes);

app.get("/", (req, res) => res.send("API Sejuzz Berjalan!"));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));

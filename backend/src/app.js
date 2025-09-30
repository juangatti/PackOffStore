require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { pool, checkConnection } = require("./config/db.config");

checkConnection();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/status", (req, res) => {
  res
    .status(200)
    .json({ message: "API is running", service: "PackOff Backend" });
});

// Conexion de modulos de rutas
const authRoutes = require("./routes/auth.routes");
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

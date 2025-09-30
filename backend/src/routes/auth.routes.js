// /backend/src/routes/auth.routes.js

const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

// Rutas de Acceso Público
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;

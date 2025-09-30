// /backend/src/controllers/auth.controller.js

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user.model");

const saltRounds = 12; // Costo alto para el hashing de bcrypt
const jwtSecret = process.env.JWT_SECRET;

// --- Función Auxiliar para JWT ---
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    jwtSecret,
    { expiresIn: "1d" }
  );
};

// --- 1. REGISTRO DE USUARIO (Público) ---
exports.register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "El email ya está registrado." });
    }

    // Hashing seguro
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const userId = await UserModel.create(email, passwordHash);
    const newUser = await UserModel.findById(userId);
    const token = generateToken(newUser);

    res.status(201).json({
      message: "Registro exitoso.",
      token,
      user: { id: newUser.id, email: newUser.email, rol: newUser.rol },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor durante el registro." });
  }
};

// --- 2. LOGIN (Público y Admin) ---
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findByEmail(email);

    if (!user || !user.password_hash) {
      return res.status(401).json({
        message: "Credenciales inválidas o método de login incorrecto.",
      });
    }

    // Comparación segura de contraseña
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: "Credenciales inválidas." });
    }

    const token = generateToken(user);

    // Retornamos el token y los datos del usuario sin el hash
    const { password_hash, google_id, ...userData } = user;
    res.status(200).json({ message: "Login exitoso.", token, user: userData });
  } catch (error) {
    console.error("Error en el login:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor durante el login." });
  }
};

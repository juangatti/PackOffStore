// /backend/src/models/user.model.js

const { pool } = require("../config/db.config");

const UserModel = {
  /**
   * Busca un usuario por email (usa consultas preparadas con '?').
   * @param {string} email
   */
  findByEmail: async (email) => {
    // Uso de placeholder '?' y execute() para prevenir Inyección SQL
    const [rows] = await pool.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );
    return rows.length > 0 ? rows[0] : null;
  },

  /**
   * Crea un nuevo usuario con rol 'user'.
   */
  create: async (email, passwordHash, rol = "user") => {
    const [result] = await pool.execute(
      "INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, ?)",
      [email, passwordHash, rol]
    );
    return result.insertId;
  },

  /**
   * Crea un usuario con rol 'admin' (para setup inicial).
   */
  createAdmin: async (email, passwordHash) => {
    const [result] = await pool.execute(
      'INSERT INTO usuarios (email, password_hash, rol) VALUES (?, ?, "admin")',
      [email, passwordHash]
    );
    return result.insertId;
  },

  /**
   * Busca un usuario por ID (para generar el JWT después del registro/login).
   */
  findById: async (id) => {
    // Solo selecciona datos no sensibles
    const [rows] = await pool.execute(
      "SELECT id, email, rol, whatsapp_number FROM usuarios WHERE id = ?",
      [id]
    );
    return rows.length > 0 ? rows[0] : null;
  },
};

module.exports = UserModel;

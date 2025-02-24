const express = require('express');
const router = express.Router();
const { register, login, logout  } = require('../controllers/authController');

// Rutas de autenticación
// /api/auth/register
router.post('/register', register); // Registro de usuarios
// /api/auth/login
router.post('/login', login); // Inicio de sesión

// /api/auth/logout - ruta para cerrar sesión
router.post('/logout', logout); // Cerrar sesión

module.exports = router;
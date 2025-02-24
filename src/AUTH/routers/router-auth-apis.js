import express from 'express';
import { register, login, logout } from '../controllers/authController.js'; // Cambio de require a import

const router = express.Router();

// Rutas de autenticación
router.post('/register', register); // Registro de usuarios
router.post('/login', login); // Inicio de sesión
router.post('/logout', logout); // Cerrar sesión

export default router; // Usamos export default
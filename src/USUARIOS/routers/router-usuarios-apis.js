const express = require('express');
const router = express.Router();
const { 
  getUsuarios, 
  getUsuarioById, 
  getConfigurarMetodoPagoUsuarioById, 
  createConfigurarMetodoPagoUsuario, 
  updateConfigurarMetodoPagoUsuario, 
  deleteConfigurarMetodoPagoUsuario 
} = require('../controllers/usuariosController');

// Rutas de administración (solo accesibles para administradores)
router.get('/admin', getUsuarios); // Obtener la lista de usuarios (solo admin)
router.get('/admin/:id', getUsuarioById); // Obtener detalles de un usuario específico (solo admin)

// Rutas de configuración de método de pago (usuarios autenticados)
router.get('/config/:id', getConfigurarMetodoPagoUsuarioById); // Obtener método de pago del usuario autenticado
router.post('/config', createConfigurarMetodoPagoUsuario); // Crear método de pago del usuario autenticado
router.put('/config', updateConfigurarMetodoPagoUsuario); // Actualizar método de pago del usuario autenticado
router.delete('/config', deleteConfigurarMetodoPagoUsuario); // Eliminar método de pago del usuario autenticado

module.exports = router;